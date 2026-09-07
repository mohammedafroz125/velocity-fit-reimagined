import { NextRequest, NextResponse } from "next/server";
import { createOrderSchema } from "@/lib/validations/payments";
import { resolveVerifiedPricing } from "@/lib/payments/pricing";
import { createRazorpayOrder } from "@/lib/payments/razorpay";
import { crmDb } from "@/lib/supabase/db";
import { checkRateLimit } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const rateLimit = await checkRateLimit(`order:${ip}`, 15, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Too many checkout requests. Please try again shortly." },
        { status: 429 }
      );
    }

    // 2. Parse & Validate Payload
    const rawBody = await req.json();
    const parseResult = createOrderSchema.safeParse(rawBody);
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

    const { leadId, programTrack, supportTier, duration } = parseResult.data;

    // 3. Verify Lead Exists
    const lead = await crmDb.getLeadById(leadId);
    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Lead record not found" },
        { status: 404 }
      );
    }

    // 4. Server-Side Price Resolution (Strictly immutable from client)
    const pricing = resolveVerifiedPricing(programTrack, supportTier, duration);
    if (!pricing) {
      return NextResponse.json(
        { success: false, error: "Invalid track, tier, or duration configuration" },
        { status: 400 }
      );
    }

    // 5. Create Gateway Order (Razorpay)
    const order = await createRazorpayOrder({
      leadId,
      track: programTrack,
      tier: supportTier,
      duration,
    });

    // 6. Record Payment in Database & transition lead to PAYMENT_PENDING
    const paymentRecord = await crmDb.createPaymentOrder({
      leadId,
      programTrack,
      supportTier,
      duration,
      amount: pricing.amountInRupees,
      currency: "INR",
      gatewayOrderId: order.id,
      gateway: process.env.RAZORPAY_KEY_SECRET ? "razorpay" : "mock",
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount, // in paise
      amountInRupees: pricing.amountInRupees,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
      programTrack,
      supportTier,
      duration,
      paymentRecordId: paymentRecord.id,
    });
  } catch (err: unknown) {
    console.error("[API: Create Payment Order Error]", err);
    const message = err instanceof Error ? err.message : "Failed to create payment order";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
