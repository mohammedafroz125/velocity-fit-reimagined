import { NextRequest, NextResponse } from "next/server";
import { cancelPaymentSchema } from "@/lib/validations/payments";
import { crmDb } from "@/lib/supabase/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parseResult = cancelPaymentSchema.safeParse(rawBody);
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

    const { orderId } = parseResult.data;
    const payment = await crmDb.markPaymentCancelled(orderId);

    if (!payment) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Payment order marked as cancelled",
      payment,
    });
  } catch (err: unknown) {
    console.error("[API: Cancel Payment Error]", err);
    return NextResponse.json({ success: false, error: "Failed to cancel payment" }, { status: 500 });
  }
}
