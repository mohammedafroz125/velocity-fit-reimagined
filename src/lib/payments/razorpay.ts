import crypto from "crypto";
import { resolveVerifiedPricing } from "./pricing";
import { ProgramTrack, SupportTier, DurationOption } from "@/types";

export interface RazorpayOrderResult {
  id: string; // Order ID
  orderId: string;
  amount: number; // in paise
  amountPaise: number;
  amountInr: number;
  currency: "INR";
  keyId: string;
  isMock: boolean;
  programTitle: string;
  track: ProgramTrack;
  tier: SupportTier;
  duration: DurationOption;
}

/**
 * Server-side Order Creator for Razorpay.
 * Strictly calculates the price on the server via `resolveVerifiedPricing`,
 * guaranteeing that client-side tamper attempts are impossible.
 */
export async function createRazorpayOrder(params: {
  leadId: string;
  track: ProgramTrack;
  tier: SupportTier;
  duration: DurationOption;
}): Promise<RazorpayOrderResult> {
  const verified = resolveVerifiedPricing(params.track, params.tier, params.duration);

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  // If real Razorpay keys are configured in environment
  if (keyId && keySecret) {
    try {
      const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
      const res = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: verified.amountPaise,
          currency: "INR",
          receipt: `rcpt_${params.leadId.substring(0, 8)}_${Date.now().toString().slice(-4)}`,
          notes: {
            leadId: params.leadId,
            programTrack: verified.track,
            supportTier: verified.tier,
            duration: verified.duration,
          },
        }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error?.description || "Razorpay order creation failed");
      }

      const orderData = await res.json();
      return {
        id: orderData.id,
        orderId: orderData.id,
        amount: verified.amountPaise,
        amountPaise: verified.amountPaise,
        amountInr: verified.amountInr,
        currency: "INR",
        keyId,
        isMock: false,
        programTitle: verified.programTitle,
        track: verified.track,
        tier: verified.tier,
        duration: verified.duration,
      };
    } catch (err) {
      console.error("[Razorpay API Error, falling back to mock]", err);
    }
  }

  // Development / Demo Fallback Mode
  const mockOrderId = `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  return {
    id: mockOrderId,
    orderId: mockOrderId,
    amount: verified.amountPaise,
    amountPaise: verified.amountPaise,
    amountInr: verified.amountInr,
    currency: "INR",
    keyId: keyId || "rzp_test_mock_velocityfit",
    isMock: true,
    programTitle: verified.programTitle,
    track: verified.track,
    tier: verified.tier,
    duration: verified.duration,
  };
}

/**
 * Server-side Razorpay Payment Signature Verifier.
 * Validates HMAC-SHA256 signature using the private RAZORPAY_KEY_SECRET.
 */
export function verifyRazorpaySignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (keySecret) {
    try {
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${params.orderId}|${params.paymentId}`)
        .digest("hex");

      return crypto.timingSafeEqual(
        Buffer.from(generatedSignature),
        Buffer.from(params.signature)
      );
    } catch {
      return false;
    }
  }

  // In production, real cryptographic signature verification with RAZORPAY_KEY_SECRET is strictly mandatory
  if (process.env.NODE_ENV === "production") {
    console.error("[SECURITY ALERT] Razorpay payment verification rejected in production: RAZORPAY_KEY_SECRET is not configured or signature was invalid.");
    return false;
  }

  // Development / Mock Verification (Local test suites & dev sandbox only)
  if (params.orderId.startsWith("order_mock_") || params.signature.startsWith("mock_sig_")) {
    return (
      params.signature === `mock_sig_${params.orderId}` ||
      params.signature === "mock_verified_signature" ||
      params.signature.length >= 10
    );
  }

  return false;
}

/**
 * Convenience wrapper for payment signature verification accepting positional arguments.
 */
export function verifyRazorpayPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  return verifyRazorpaySignature({ orderId, paymentId, signature });
}

/**
 * Validates Razorpay Webhook Signatures (`X-Razorpay-Signature`).
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string | null,
  customSecret?: string
): boolean {
  if (!signature) return false;

  const webhookSecret = customSecret || process.env.RAZORPAY_WEBHOOK_SECRET;

  // In production, webhook signature verification is strictly mandatory
  if (process.env.NODE_ENV === "production") {
    if (!webhookSecret) {
      console.error("[SECURITY ALERT] Razorpay webhook verification rejected in production: RAZORPAY_WEBHOOK_SECRET is not configured.");
      return false;
    }
  } else if (!webhookSecret) {
    // In dev mode without webhook secret, accept mock signatures for automated testing
    return signature === "mock_webhook_signature" || signature.startsWith("mock_");
  }

  try {
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret!)
      .update(rawBody)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );
  } catch {
    return false;
  }
}
