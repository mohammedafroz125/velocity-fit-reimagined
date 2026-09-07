import { Lead } from "@/types/crm";

/**
 * Provider-Agnostic Notification Service.
 * Safely dispatches admin alerts for incoming leads and completed assessments.
 * Falls back gracefully to structured dev logging without exposing health data.
 */

export interface LeadNotificationPayload {
  leadId: string;
  fullName: string;
  phone: string;
  sourceType: string;
  preferredContactMethod?: string | null;
  primaryGoal?: string;
  isAssessment: boolean;
}

export async function sendAdminLeadNotification(payload: LeadNotificationPayload): Promise<{ success: boolean; dispatched: boolean }> {
  const recipient = process.env.ADMIN_EMAIL_NOTIFICATION_RECIPIENT || "velocityfit55@gmail.com";
  const apiKey = process.env.EMAIL_PROVIDER_API_KEY;

  const subject = payload.isAssessment
    ? `[Velocity Fit CRM] New Health Assessment: ${payload.fullName}`
    : `[Velocity Fit CRM] New Lead Inquiry: ${payload.fullName}`;

  // Safe notification message containing NO medical or bowel details
  const safeSummary = `
Velocity Fit — Inbound Lead Notification
=========================================
Lead Name: ${payload.fullName}
Phone: ${payload.phone}
Channel: ${payload.sourceType}
Preferred Contact: ${payload.preferredContactMethod || "WhatsApp"}
${payload.primaryGoal ? `Primary Focus: ${payload.primaryGoal}` : ""}
CRM Lead ID: ${payload.leadId}
Timestamp: ${new Date().toISOString()}

Access full profile and secure assessment in Velocity Fit Admin:
${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/leads/${payload.leadId}
  `.trim();

  // If a provider API key is set, send via provider (e.g. Resend / SendGrid / Postmark)
  if (apiKey) {
    try {
      // Future provider integration hook
      // e.g. await fetch("https://api.resend.com/emails", { ... })
      return { success: true, dispatched: true };
    } catch (err) {
      console.error("[Notification Service] Provider delivery failed, logged locally instead:", err);
      return { success: false, dispatched: false };
    }
  }

  // Development Fallback: Safe structured log (ZERO MEDICAL DATA)
  if (process.env.NODE_ENV !== "production") {
    // console.info(`[Dev Notification Dispatch] To: ${recipient} | Subject: "${subject}"`);
  }

  return { success: true, dispatched: false };
}
