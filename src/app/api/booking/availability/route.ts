import { NextRequest, NextResponse } from "next/server";
import { bookingSlotQuerySchema } from "@/lib/validations/booking";
import { getCalendarProvider } from "@/lib/calendar";
import { crmDb } from "@/lib/supabase/db";
import { checkRateLimit } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // 0. Rate Limiting Check (30 requests per minute per IP)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const rateLimit = await checkRateLimit(`availability:${ip}`, 30, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Too many availability requests. Please try again in a moment." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");

    const parseResult = bookingSlotQuerySchema.safeParse({ date: dateParam });
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid date parameter. Use YYYY-MM-DD format.",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { date } = parseResult.data;
    const provider = getCalendarProvider();

    // 1. Fetch already-booked start times from database to prevent double bookings
    const bookedTimes = await crmDb.getBookedStartTimes(date);

    // 2. Fetch slots from calendar provider taking booked times into account
    const slots = await provider.getAvailableSlots(date, bookedTimes);

    // 3. Filter available slots and attach label for UI
    const availableSlots = slots
      .filter((slot) => slot.available && !bookedTimes.includes(slot.startTime))
      .map((slot) => ({
        ...slot,
        label: slot.displayTime,
      }));

    return NextResponse.json({
      success: true,
      date,
      timezone: "Asia/Kolkata",
      slots: availableSlots,
    });
  } catch (err) {
    console.error("[API: Booking Availability Error]", err);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve consultation availability" },
      { status: 500 }
    );
  }
}
