import { ProgramTrack, SupportTier, DurationOption } from "./index";

export type PaymentStatus =
  | "CREATED"
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentGateway = "razorpay" | "cashfree" | "mock";

export interface PaymentRecord {
  id: string;
  leadId: string;
  customerId?: string | null;
  programTrack: ProgramTrack;
  supportTier: SupportTier;
  duration: DurationOption;
  amount: number; // in INR (₹2,000, ₹3,000, ₹5,500, ₹8,000)
  currency: "INR";
  gateway: PaymentGateway;
  gatewayOrderId: string;
  gatewayPaymentId?: string | null;
  gatewaySignature?: string | null;
  status: PaymentStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  leadId: string;
  track: ProgramTrack;
  tier: SupportTier;
  duration: DurationOption;
}

export interface VerifyPaymentInput {
  leadId: string;
  orderId: string;
  paymentId: string;
  signature: string;
}
