export type AppointmentStatus =
  | "REQUESTED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type MeetingType = "VIDEO_CALL" | "PHONE_CALL" | "IN_PERSON";

export interface Appointment {
  id: string;
  leadId: string;
  customerId?: string | null;
  startTime: string; // ISO 8601 string
  endTime: string; // ISO 8601 string
  timezone: string; // "Asia/Kolkata"
  status: AppointmentStatus;
  meetingType: MeetingType;
  meetingLink?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  startTime: string; // ISO 8601 string
  endTime: string; // ISO 8601 string
  displayTime: string; // e.g. "10:00 AM - 10:30 AM"
  timezone: string; // "Asia/Kolkata (IST)"
  available: boolean;
  isMock?: boolean;
}

export type AvailabilitySlot = TimeSlot & { label?: string };

export interface CreateAppointmentInput {
  leadId: string;
  startTime: string; // ISO 8601 string
  meetingType?: MeetingType;
  notes?: string;
}
