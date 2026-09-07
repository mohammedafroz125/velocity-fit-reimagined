import { z } from "zod";

export const bookingSlotQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

export const createAppointmentSchema = z.object({
  leadId: z.string().min(1, "Lead ID is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  meetingType: z.enum(["VIDEO_CALL", "PHONE_CALL", "IN_PERSON"]).default("VIDEO_CALL"),
  notes: z.string().max(500).optional().nullable(),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(["REQUESTED", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"]),
  reason: z.string().max(500).optional().nullable(),
});
