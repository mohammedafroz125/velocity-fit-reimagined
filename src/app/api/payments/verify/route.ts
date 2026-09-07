import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentSchema } from "@/lib/validations/payments";
import { verifyRazorpayPaymentSignature } from "@/lib/payments/razorpay";
import { crmDb } from "@/lib/supabase/db";
import { checkRateLimit } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const rateLimit = await checkRateLimit(`verify:${ip}`, 20, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Too many verification attempts. Please try again shortly." },
        { status: 429 }
      );
    }

    // 2. Parse & Validate Payload
    const rawBody = await req.json();
    const parseResult = verifyPaymentSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { orderId, paymentId, signature } = parseResult.data;

    // 3. Cryptographic Signature Verification (HMAC-SHA256)
    const isValid = verifyRazorpayPaymentSignature(orderId, paymentId, signature);
    if (!isValid) {
      console.warn(`[Payment Verification Failed] Signature mismatch for order: ${orderId}`);
      await crmDb.markPaymentFailed(orderId, "Cryptographic signature verification failed");
      return NextResponse.json(
        { success: false, error: "Invalid payment signature. Transaction could not be verified." },
        { status: 400 }
      );
    }

    // 4. Update Payment to SUCCESS and Lead to CONVERTED (Idempotent)
    const result = await crmDb.markPaymentSuccess(orderId, paymentId, signature);

    return NextResponse.json({
      success: true,
      isConverted: true,
      message: "Payment successfully verified and enrollment confirmed.",
      payment: result.payment,
      lead: {
        id: result.lead.id,
        fullName: result.lead.fullName,
        status: result.lead.status,
      },
    });
  } catch (err: unknown) {
    console.error("[API: Verify Payment Error]", err);
    const message = err instanceof Error ? err.message : "Payment verification failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
