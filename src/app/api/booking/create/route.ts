import { NextRequest, NextResponse } from "next/server";
import { createAppointmentSchema } from "@/lib/validations/booking";
import { getCalendarProvider } from "@/lib/calendar";
import { crmDb } from "@/lib/supabase/db";
import { checkRateLimit } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. Abuse & Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const rateLimit = await checkRateLimit(`booking:${ip}`, 10, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    // 2. Parse & Validate Payload
    const rawBody = await req.json();
    const parseResult = createAppointmentSchema.safeParse(rawBody);
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

    const data = parseResult.data;

    // 3. Verify Lead Exists
    const lead = await crmDb.getLeadById(data.leadId);
    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Lead record not found" },
        { status: 404 }
      );
    }

    // 4. Register external provider booking (if calendar provider is active)
    const provider = getCalendarProvider();
    let calendarEvent;
    try {
      calendarEvent = await provider.bookSlot({
        leadId: lead.id,
        leadName: lead.fullName,
        leadEmail: lead.email || undefined,
        startTime: data.startTime,
        endTime: data.endTime,
        meetingType: data.meetingType,
        notes: data.notes || undefined,
      });
    } catch (calErr) {
      console.warn("[Calendar Provider Booking Warning]", calErr);
    }

    // 5. Create appointment in database (with double-booking check)
    const appointment = await crmDb.createAppointment({
      leadId: lead.id,
      startTime: data.startTime,
      endTime: data.endTime,
      meetingType: data.meetingType,
      notes: data.notes || undefined,
    });

    if (calendarEvent?.meetingUrl && !appointment.meetingLink) {
      appointment.meetingLink = calendarEvent.meetingUrl;
    }

    return NextResponse.json({
      success: true,
      appointment,
      message: "Consultation booked successfully with Dr. Lubna Fatima",
    });
  } catch (err: unknown) {
    console.error("[API: Booking Create Error]", err);
    const message = err instanceof Error ? err.message : "Failed to book consultation";
    const status = message.includes("already booked") ? 409 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
