import { NextRequest, NextResponse } from "next/server";
import { bookingSlotQuerySchema } from "@/lib/validations/booking";
import { getCalendarProvider } from "@/lib/calendar";
import { crmDb } from "@/lib/supabase/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
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
