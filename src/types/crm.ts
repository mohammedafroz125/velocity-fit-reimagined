import { LeadAttribution } from "./index";
import { Appointment } from "./booking";
import { PaymentRecord } from "./payment";

export * from "./booking";
export * from "./payment";

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "FOLLOW_UP"
  | "CONSULTATION_BOOKED"
  | "CONSULTATION_COMPLETED"
  | "PAYMENT_PENDING"
  | "CONVERTED"
  | "ACTIVE_CUSTOMER"
  | "NOT_INTERESTED"
  | "LOST";

export type AdminRole = "SUPER_ADMIN" | "ADMIN";

export interface AdminProfile {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  fullName: string;
  phone: string;
  phoneNormalized: string;
  email?: string | null;
  age?: number | null;
  gender?: "Male" | "Female" | "Rather not specify" | null;
  city?: string | null;
  status: LeadStatus;
  preferredProgram?: string | null;
  preferredContactMethod?: "WhatsApp" | "Phone Call" | "Email" | null;
  sourceType: "CONTACT_FORM" | "ASSESSMENT_WIZARD" | "DIRECT_WHATSAPP" | "MANUAL_ENTRY";
  enquiryMessage?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
  landingPage?: string | null;
  referrerUrl?: string | null;
  deviceType?: string | null;
  assignedTo?: string | null;
  assignedAdminName?: string | null;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  // Included in detailed queries
  assessment?: ClinicalAssessment | null;
  notes?: LeadNote[];
  statusHistory?: LeadStatusHistoryItem[];
  appointments?: Appointment[];
  payments?: PaymentRecord[];
}

export interface ClinicalAssessment {
  id: string;
  leadId?: string | null;
  createdAt: string;
  heightCm: number;
  currentWeightKg: number;
  highestWeightKg?: number | null;
  targetWeightKg: number;
  calculatedBmi?: number | null;
  targetTimeframe: "1 Months" | "2 Months" | "3 Months" | "6 Months";
  primaryGoals: string[];
  medicalConditions: string[];
  medications?: string | null;
  surgeries?: string | null;
  femaleMarkers?: string[] | null;
  dailyWaterLiters: number;
  sleepHours: number;
  bowelMovement?: string | null;
  eatingPatterns: string[];
  dietStruggles?: string | null;
  seriousnessScale: number;
  lifeChangeVision?: string | null;
  pastRoadblocks?: string | null;
  readyFor60Days: "Yes" | "No" | "Not Sure";
  referralSource?: string | null;
  rawPayload?: Record<string, unknown>;
}

export interface LeadStatusHistoryItem {
  id: string;
  leadId: string;
  oldStatus?: string | null;
  newStatus: LeadStatus;
  changedBy?: string | null;
  changedByName?: string | null;
  reason?: string | null;
  createdAt: string;
}

export interface LeadNote {
  id: string;
  leadId: string;
  authorId?: string | null;
  authorName: string;
  noteBody: string;
  createdAt: string;
}

export interface SystemNotification {
  id: string;
  type: "NEW_LEAD" | "NEW_ASSESSMENT" | "STATUS_CHANGE" | "NOTE_ADDED";
  title: string;
  message: string;
  leadId?: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  actorId?: string | null;
  actorName: string;
  action: string;
  entityType: "lead" | "assessment" | "note";
  entityId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface DashboardMetrics {
  totalLeads: number;
  newLeads: number;
  followUps: number;
  consultationsBooked: number;
  converted: number;
  activeCustomers: number;
}
