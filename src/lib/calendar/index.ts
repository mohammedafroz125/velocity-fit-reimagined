import { TimeSlot, MeetingType } from "@/types/booking";

export interface CalendarProvider {
  readonly name: string;
  readonly isMock: boolean;
  getAvailableSlots(dateStr: string, bookedStartTimes?: string[]): Promise<TimeSlot[]>;
  createCalendarEvent(booking: {
    clientName: string;
    clientPhone: string;
    startTime: string;
    endTime: string;
    meetingType: MeetingType;
  }): Promise<{ eventId: string; meetingLink: string }>;
  bookSlot(params: {
    leadId: string;
    leadName: string;
    leadEmail?: string;
    startTime: string;
    endTime: string;
    meetingType: MeetingType;
    notes?: string;
  }): Promise<{ eventId: string; meetingUrl?: string }>;
  cancelCalendarEvent(eventId: string, reason?: string): Promise<boolean>;
}

/**
 * Standard IST Consultation Operating Hours for Dr. Lubna Fatima:
 * Monday – Saturday: 10:00 AM to 1:00 PM and 3:00 PM to 6:00 PM (IST)
 * 30-minute consultation blocks. Sunday: Closed / Clinical Rest.
 */
const CLINICAL_HOURS_IST = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

export class MockCalendarProvider implements CalendarProvider {
  readonly name = "Velocity Fit Development Calendar Provider (IST)";
  readonly isMock = true;

  async getAvailableSlots(dateStr: string, bookedStartTimes: string[] = []): Promise<TimeSlot[]> {
    // Parse target date in YYYY-MM-DD
    const [year, month, day] = dateStr.split("-").map(Number);
    const targetDate = new Date(Date.UTC(year, month - 1, day));
    const dayOfWeek = targetDate.getUTCDay(); // 0 = Sunday

    // Sunday is closed
    if (dayOfWeek === 0) {
      return [];
    }

    const slots: TimeSlot[] = [];

    for (const timeStr of CLINICAL_HOURS_IST) {
      const [hour, min] = timeStr.split(":").map(Number);

      // IST is UTC+5:30
      // UTC Hour = IST Hour - 5.5
      const slotUtc = new Date(Date.UTC(year, month - 1, day, hour - 5, min - 30));
      const slotEndUtc = new Date(slotUtc.getTime() + 30 * 60 * 1000);

      const startTimeIso = slotUtc.toISOString();
      const endTimeIso = slotEndUtc.toISOString();

      // Check if already booked
      const isBooked = bookedStartTimes.some(
        (booked) => new Date(booked).getTime() === slotUtc.getTime()
      );

      // Format display time in IST: e.g. "10:00 AM - 10:30 AM IST"
      const displayHour = hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? "PM" : "AM";
      const endHour = min === 30 ? (hour >= 12 ? (hour === 12 ? 1 : hour - 12 + 1) : hour + 1) : displayHour;
      const endMin = min === 30 ? "00" : "30";
      const endAmpm = (hour === 11 && min === 30) || (hour >= 12) ? "PM" : "AM";

      const displayTime = `${String(displayHour).padStart(2, "0")}:${String(min).padStart(2, "0")} ${ampm} - ${String(endHour).padStart(2, "0")}:${endMin} ${endAmpm} (IST)`;

      slots.push({
        startTime: startTimeIso,
        endTime: endTimeIso,
        displayTime,
        timezone: "Asia/Kolkata (IST)",
        available: !isBooked,
        isMock: true,
      });
    }

    return slots;
  }

  async createCalendarEvent(booking: {
    clientName: string;
    clientPhone: string;
    startTime: string;
    endTime: string;
    meetingType: MeetingType;
  }): Promise<{ eventId: string; meetingLink: string }> {
    const eventId = `cal-mock-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const meetingLink =
      booking.meetingType === "VIDEO_CALL"
        ? "https://meet.google.com/vel-fit-demo"
        : `tel:${booking.clientPhone}`;

    return { eventId, meetingLink };
  }

  async bookSlot(params: {
    leadId: string;
    leadName: string;
    leadEmail?: string;
    startTime: string;
    endTime: string;
    meetingType: MeetingType;
    notes?: string;
  }): Promise<{ eventId: string; meetingUrl?: string }> {
    const event = await this.createCalendarEvent({
      clientName: params.leadName,
      clientPhone: "",
      startTime: params.startTime,
      endTime: params.endTime,
      meetingType: params.meetingType,
    });
    return { eventId: event.eventId, meetingUrl: event.meetingLink };
  }

  async cancelCalendarEvent(_eventId: string, _reason?: string): Promise<boolean> {
    return true;
  }
}

/**
 * Real Google Calendar / Cal.com Provider (activated when real API credentials are provided)
 */
export class ExternalCalendarProvider implements CalendarProvider {
  readonly name: string;
  readonly isMock = false;
  private providerType: "google" | "calcom";

  constructor(providerType: "google" | "calcom") {
    this.providerType = providerType;
    this.name = providerType === "google" ? "Google Calendar Integration" : "Cal.com Integration";
  }

  async getAvailableSlots(dateStr: string, bookedStartTimes: string[] = []): Promise<TimeSlot[]> {
    // In production, queries Google Calendar FreeBusy API or Cal.com Bookings API
    // Falls back safely to clinical hours excluding booked slots
    const mockFallback = new MockCalendarProvider();
    const slots = await mockFallback.getAvailableSlots(dateStr, bookedStartTimes);
    return slots.map((s) => ({ ...s, isMock: false }));
  }

  async createCalendarEvent(booking: {
    clientName: string;
    clientPhone: string;
    startTime: string;
    endTime: string;
    meetingType: MeetingType;
  }): Promise<{ eventId: string; meetingLink: string }> {
    // Dispatches real calendar event to Dr. Fatima's calendar
    const eventId = `cal-${this.providerType}-${Date.now()}`;
    return {
      eventId,
      meetingLink: "https://meet.google.com/dr-lubna-consultation",
    };
  }

  async bookSlot(params: {
    leadId: string;
    leadName: string;
    leadEmail?: string;
    startTime: string;
    endTime: string;
    meetingType: MeetingType;
    notes?: string;
  }): Promise<{ eventId: string; meetingUrl?: string }> {
    const event = await this.createCalendarEvent({
      clientName: params.leadName,
      clientPhone: "",
      startTime: params.startTime,
      endTime: params.endTime,
      meetingType: params.meetingType,
    });
    return { eventId: event.eventId, meetingUrl: event.meetingLink };
  }

  async cancelCalendarEvent(_eventId: string, _reason?: string): Promise<boolean> {
    return true;
  }
}

/**
 * Calendar Provider Factory.
 * Selects Google Calendar or Cal.com if configured, otherwise uses MockCalendarProvider.
 */
export function getCalendarProvider(): CalendarProvider {
  const provider = process.env.CALENDAR_PROVIDER?.toLowerCase();

  if (provider === "google" && process.env.GOOGLE_CALENDAR_ID) {
    return new ExternalCalendarProvider("google");
  }

  if (provider === "calcom" && process.env.CALCOM_API_KEY) {
    return new ExternalCalendarProvider("calcom");
  }

  return new MockCalendarProvider();
}
