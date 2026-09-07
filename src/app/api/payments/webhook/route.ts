import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/payments/razorpay";
import { crmDb } from "@/lib/supabase/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Strict signature verification when webhook secret is configured
    if (webhookSecret) {
      if (!signature) {
        return NextResponse.json({ error: "Missing x-razorpay-signature header" }, { status: 400 });
      }

      const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        console.warn("[Webhook Verification Failed] Invalid Razorpay webhook signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const event = payload.event;
    console.log(`[Razorpay Webhook Received] Event: ${event}`);

    // Handle payment capture / order paid events
    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderEntity = payload.payload?.order?.entity;

      const orderId = paymentEntity?.order_id || orderEntity?.id;
      const paymentId = paymentEntity?.id || `wh_pay_${Date.now()}`;

      if (orderId) {
        const paymentRecord = await crmDb.getPaymentByOrderId(orderId);
        if (paymentRecord) {
          await crmDb.markPaymentSuccess(
            orderId,
            paymentId,
            signature || "webhook_verified"
          );
          console.log(`[Webhook Success] Marked order ${orderId} as SUCCESS`);
        }
      }
    } else if (event === "payment.failed") {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const reason = paymentEntity?.error_description || "Payment failed via webhook notification";

      if (orderId) {
        await crmDb.markPaymentFailed(orderId, reason);
        console.log(`[Webhook Failed] Marked order ${orderId} as FAILED: ${reason}`);
      }
    }

    return NextResponse.json({ status: "ok", received: true });
  } catch (err: unknown) {
    console.error("[API: Webhook Processing Error]", err);
    return NextResponse.json(
      { error: "Webhook handling failed" },
      { status: 500 }
    );
  }
}
