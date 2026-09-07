import { z } from "zod";

export const createOrderSchema = z.object({
  leadId: z.string().min(1, "Lead ID is required"),
  programTrack: z.enum(["Flex", "Grit"]),
  supportTier: z.enum(["Prime", "Elite"]),
  duration: z.enum(["1-month", "3-months"]),
});

export const verifyPaymentSchema = z.object({
  orderId: z.string().min(1, "Gateway order ID is required"),
  paymentId: z.string().min(1, "Gateway payment ID is required"),
  signature: z.string().min(1, "Gateway signature is required"),
});

export const cancelPaymentSchema = z.object({
  orderId: z.string().min(1, "Gateway order ID is required"),
});
