import {
  Lead,
  LeadStatus,
  ClinicalAssessment,
  LeadStatusHistoryItem,
  LeadNote,
  SystemNotification,
  AuditLogItem,
  DashboardMetrics,
  Appointment,
  AppointmentStatus,
  PaymentRecord,
  PaymentStatus,
} from "@/types/crm";

/**
 * Thread-safe In-Memory Store for Phase 2A/2B Development, Offline Testing,
 * and Fallback execution when Supabase remote instance is not connected.
 */
class MemoryCrmStore {
  private leads: Map<string, Lead> = new Map();
  private assessments: Map<string, ClinicalAssessment> = new Map();
  private notes: Map<string, LeadNote[]> = new Map();
  private statusHistory: Map<string, LeadStatusHistoryItem[]> = new Map();
  private appointments: Map<string, Appointment> = new Map();
  private payments: Map<string, PaymentRecord> = new Map();
  private notifications: SystemNotification[] = [];
  private auditLogs: AuditLogItem[] = [];

  constructor() {
    // Start with a clean state as required by spec (displays 0 with intentional empty state if empty)
  }

  // Clear all data (useful for test isolation)
  public clear(): void {
    this.leads.clear();
    this.assessments.clear();
    this.notes.clear();
    this.statusHistory.clear();
    this.appointments.clear();
    this.payments.clear();
    this.notifications = [];
    this.auditLogs = [];
  }

  // -------------------------------------------------------------------------
  // Leads & Deduplication
  // -------------------------------------------------------------------------
  public findLeadByPhoneOrEmail(phoneNormalized: string, email?: string | null): Lead | undefined {
    for (const lead of this.leads.values()) {
      if (lead.phoneNormalized === phoneNormalized) {
        return lead;
      }
      if (email && lead.email && lead.email.toLowerCase() === email.toLowerCase()) {
        return lead;
      }
    }
    return undefined;
  }

  public getLeadById(id: string): Lead | undefined {
    const lead = this.leads.get(id);
    if (!lead) return undefined;

    return {
      ...lead,
      assessment: this.getAssessmentByLeadId(lead.id),
      notes: this.notes.get(lead.id) || [],
      statusHistory: this.statusHistory.get(lead.id) || [],
      appointments: this.getAppointmentsByLeadId(lead.id),
      payments: this.getPaymentsByLeadId(lead.id),
    };
  }

  public getAllLeads(params?: {
    search?: string;
    status?: LeadStatus | "ALL";
    source?: string;
    page?: number;
    pageSize?: number;
  }): { leads: Lead[]; total: number } {
    let result = Array.from(this.leads.values());

    // Filter by Status
    if (params?.status && params.status !== "ALL") {
      result = result.filter((l) => l.status === params.status);
    }

    // Filter by Source
    if (params?.source && params.source !== "ALL") {
      result = result.filter((l) => (l.utmSource || l.sourceType).toLowerCase() === params.source?.toLowerCase());
    }

    // Search query (name, phone, email, city)
    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (l) =>
          l.fullName.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          (l.email && l.email.toLowerCase().includes(q)) ||
          (l.city && l.city.toLowerCase().includes(q))
      );
    }

    // Sort by createdAt descending
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = result.length;
    const page = Math.max(1, params?.page || 1);
    const pageSize = Math.max(1, params?.pageSize || 25);
    const paginated = result.slice((page - 1) * pageSize, page * pageSize);

    return {
      leads: paginated.map((lead) => ({
        ...lead,
        notes: this.notes.get(lead.id) || [],
      })),
      total,
    };
  }

  public createOrUpdateLead(data: {
    fullName: string;
    phone: string;
    phoneNormalized: string;
    email?: string | null;
    age?: number | null;
    gender?: "Male" | "Female" | "Rather not specify" | null;
    city?: string | null;
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
  }): { lead: Lead; isNew: boolean } {
    const existing = this.findLeadByPhoneOrEmail(data.phoneNormalized, data.email);
    const now = new Date().toISOString();

    if (existing) {
      // Update existing lead without overwriting historical data
      const updated: Lead = {
        ...existing,
        fullName: data.fullName || existing.fullName,
        email: data.email || existing.email,
        city: data.city || existing.city,
        age: data.age || existing.age,
        gender: data.gender || existing.gender,
        enquiryMessage: data.enquiryMessage || existing.enquiryMessage,
        lastActivityAt: now,
        updatedAt: now,
      };

      // If lead was previously LOST or NOT_INTERESTED, re-activate to FOLLOW_UP
      if (existing.status === "LOST" || existing.status === "NOT_INTERESTED") {
        this.addStatusHistory(existing.id, existing.status, "FOLLOW_UP", "Lead re-engaged via new inquiry/assessment", "System");
        updated.status = "FOLLOW_UP";
      }

      this.leads.set(existing.id, updated);

      this.addAuditLog({
        actorName: "System",
        action: "LEAD_RE_ENGAGED",
        entityType: "lead",
        entityId: existing.id,
        metadata: { source: data.sourceType, utm_source: data.utmSource },
      });

      return { lead: updated, isNew: false };
    }

    // Create New Lead
    const newId = `lead-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const newLead: Lead = {
      id: newId,
      fullName: data.fullName,
      phone: data.phone,
      phoneNormalized: data.phoneNormalized,
      email: data.email || null,
      age: data.age || null,
      gender: data.gender || null,
      city: data.city || null,
      status: "NEW",
      preferredProgram: data.preferredProgram || null,
      preferredContactMethod: data.preferredContactMethod || "WhatsApp",
      sourceType: data.sourceType,
      enquiryMessage: data.enquiryMessage || null,
      utmSource: data.utmSource || null,
      utmMedium: data.utmMedium || null,
      utmCampaign: data.utmCampaign || null,
      utmContent: data.utmContent || null,
      utmTerm: data.utmTerm || null,
      landingPage: data.landingPage || null,
      referrerUrl: data.referrerUrl || null,
      deviceType: data.deviceType || null,
      assignedTo: null,
      createdAt: now,
      updatedAt: now,
      lastActivityAt: now,
    };

    this.leads.set(newId, newLead);

    // Record initial status in history
    this.addStatusHistory(newId, null, "NEW", "Initial lead capture", "System");

    // Add audit log
    this.addAuditLog({
      actorName: "System",
      action: "LEAD_CREATED",
      entityType: "lead",
      entityId: newId,
      metadata: { source: data.sourceType, utm_source: data.utmSource },
    });

    // Create internal notification
    this.createNotification({
      type: "NEW_LEAD",
      title: `New Lead: ${newLead.fullName}`,
      message: `${newLead.fullName} submitted via ${newLead.sourceType}. Preferred channel: ${newLead.preferredContactMethod || "WhatsApp"}.`,
      leadId: newId,
    });

    return { lead: newLead, isNew: true };
  }

  // -------------------------------------------------------------------------
  // Status Transitions & History
  // -------------------------------------------------------------------------
  public updateLeadStatus(
    leadId: string,
    newStatus: LeadStatus,
    reason?: string,
    changedByName: string = "Admin"
  ): Lead | undefined {
    const lead = this.leads.get(leadId);
    if (!lead) return undefined;

    const oldStatus = lead.status;
    const now = new Date().toISOString();

    lead.status = newStatus;
    lead.updatedAt = now;
    lead.lastActivityAt = now;
    this.leads.set(leadId, lead);

    this.addStatusHistory(leadId, oldStatus, newStatus, reason, changedByName);

    this.addAuditLog({
      actorName: changedByName,
      action: "STATUS_CHANGED",
      entityType: "lead",
      entityId: leadId,
      metadata: { from: oldStatus, to: newStatus, reason: reason || "Manual status update" },
    });

    this.createNotification({
      type: "STATUS_CHANGE",
      title: `Status Changed: ${lead.fullName}`,
      message: `Status updated from ${oldStatus} to ${newStatus}.`,
      leadId,
    });

    return lead;
  }

  public assignLead(leadId: string, adminId: string, adminName: string): Lead | undefined {
    const lead = this.leads.get(leadId);
    if (!lead) return undefined;

    lead.assignedTo = adminId;
    lead.assignedAdminName = adminName;
    lead.updatedAt = new Date().toISOString();
    this.leads.set(leadId, lead);

    this.addAuditLog({
      actorName: "Admin",
      action: "ASSIGNMENT_CHANGED",
      entityType: "lead",
      entityId: leadId,
      metadata: { assignedTo: adminName },
    });

    return lead;
  }

  private addStatusHistory(
    leadId: string,
    oldStatus: string | null,
    newStatus: LeadStatus,
    reason?: string | null,
    changedByName: string = "System"
  ): void {
    const item: LeadStatusHistoryItem = {
      id: `sh-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      leadId,
      oldStatus,
      newStatus,
      changedByName,
      reason: reason || null,
      createdAt: new Date().toISOString(),
    };

    const history = this.statusHistory.get(leadId) || [];
    history.unshift(item);
    this.statusHistory.set(leadId, history);
  }

  // -------------------------------------------------------------------------
  // Clinical Assessments
  // -------------------------------------------------------------------------
  public createAssessment(
    leadId: string,
    assessmentData: Omit<ClinicalAssessment, "id" | "leadId" | "createdAt">
  ): ClinicalAssessment {
    const id = `asmt-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date().toISOString();

    const assessment: ClinicalAssessment = {
      id,
      leadId,
      createdAt: now,
      ...assessmentData,
    };

    this.assessments.set(id, assessment);

    // Update lead last activity
    const lead = this.leads.get(leadId);
    if (lead) {
      lead.lastActivityAt = now;
      lead.updatedAt = now;
      this.leads.set(leadId, lead);
    }

    // Add safe audit log (NO MEDICAL DATA IN DESCRIPTION)
    this.addAuditLog({
      actorName: "System",
      action: "ASSESSMENT_SUBMITTED",
      entityType: "assessment",
      entityId: id,
      metadata: { leadId, primaryGoal: assessmentData.primaryGoals[0] },
    });

    // Create Notification
    this.createNotification({
      type: "NEW_ASSESSMENT",
      title: `New Health Assessment: ${lead?.fullName || "Applicant"}`,
      message: `Completed 5-stage intake. Primary Goal: ${assessmentData.primaryGoals.join(", ")}.`,
      leadId,
    });

    return assessment;
  }

  public getAssessmentByLeadId(leadId: string): ClinicalAssessment | undefined {
    for (const asmt of this.assessments.values()) {
      if (asmt.leadId === leadId) {
        return asmt;
      }
    }
    return undefined;
  }

  // -------------------------------------------------------------------------
  // Lead Notes
  // -------------------------------------------------------------------------
  public addLeadNote(leadId: string, authorName: string, noteBody: string): LeadNote {
    const note: LeadNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      leadId,
      authorName,
      noteBody,
      createdAt: new Date().toISOString(),
    };

    const notes = this.notes.get(leadId) || [];
    notes.unshift(note);
    this.notes.set(leadId, notes);

    const lead = this.leads.get(leadId);
    if (lead) {
      lead.lastActivityAt = new Date().toISOString();
      this.leads.set(leadId, lead);
    }

    this.addAuditLog({
      actorName: authorName,
      action: "NOTE_ADDED",
      entityType: "note",
      entityId: note.id,
      metadata: { leadId },
    });

    return note;
  }

  // -------------------------------------------------------------------------
  // Notifications & Audit Logs
  // -------------------------------------------------------------------------
  public createNotification(data: Omit<SystemNotification, "id" | "isRead" | "createdAt">): SystemNotification {
    const item: SystemNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      isRead: false,
      createdAt: new Date().toISOString(),
      ...data,
    };
    this.notifications.unshift(item);
    return item;
  }

  public getNotifications(unreadOnly = false): SystemNotification[] {
    if (unreadOnly) {
      return this.notifications.filter((n) => !n.isRead);
    }
    return [...this.notifications];
  }

  public markNotificationAsRead(id: string): void {
    const item = this.notifications.find((n) => n.id === id);
    if (item) {
      item.isRead = true;
    }
  }

  private addAuditLog(data: Omit<AuditLogItem, "id" | "createdAt">): void {
    const item: AuditLogItem = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
      ...data,
    };
    this.auditLogs.unshift(item);
  }

  public getAuditLogs(): AuditLogItem[] {
    return [...this.auditLogs];
  }

  // -------------------------------------------------------------------------
  // Appointments & Consultation Booking
  // -------------------------------------------------------------------------
  public createAppointment(data: {
    leadId: string;
    startTime: string;
    endTime: string;
    meetingType?: "VIDEO_CALL" | "PHONE_CALL" | "IN_PERSON";
    notes?: string;
  }): Appointment {
    const lead = this.leads.get(data.leadId);
    if (!lead) {
      throw new Error(`Lead with ID ${data.leadId} not found`);
    }

    // Double-booking check: verify that no active appointment occupies this start time
    const startIso = new Date(data.startTime).toISOString();
    for (const existing of this.appointments.values()) {
      if (
        new Date(existing.startTime).toISOString() === startIso &&
        existing.status !== "CANCELLED"
      ) {
        throw new Error("This consultation slot is already booked. Please select another time.");
      }
    }

    const now = new Date().toISOString();
    const id = `appt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const appointment: Appointment = {
      id,
      leadId: data.leadId,
      customerId: null,
      startTime: data.startTime,
      endTime: data.endTime,
      timezone: "Asia/Kolkata",
      status: "REQUESTED",
      meetingType: data.meetingType || "VIDEO_CALL",
      meetingLink: data.meetingType === "PHONE_CALL" ? `tel:${lead.phone}` : "https://meet.google.com/vel-fit-consultation",
      notes: data.notes || null,
      createdAt: now,
      updatedAt: now,
    };

    this.appointments.set(id, appointment);

    // Update lead status to CONSULTATION_BOOKED
    const oldStatus = lead.status;
    lead.status = "CONSULTATION_BOOKED";
    lead.updatedAt = now;
    lead.lastActivityAt = now;
    this.leads.set(data.leadId, lead);

    this.addStatusHistory(
      data.leadId,
      oldStatus,
      "CONSULTATION_BOOKED",
      `Consultation scheduled for ${new Date(data.startTime).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })} at ${new Date(data.startTime).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" })} IST`,
      "Client Booking Flow"
    );

    this.createNotification({
      type: "STATUS_CHANGE",
      title: `Consultation Booked: ${lead.fullName}`,
      message: `Scheduled for ${new Date(data.startTime).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })} (IST). Mode: ${appointment.meetingType}.`,
      leadId: data.leadId,
    });

    this.addAuditLog({
      actorName: "Client",
      action: "APPOINTMENT_BOOKED",
      entityType: "lead",
      entityId: data.leadId,
      metadata: { appointmentId: id, startTime: data.startTime, meetingType: appointment.meetingType },
    });

    return appointment;
  }

  public getAppointmentsByLeadId(leadId: string): Appointment[] {
    const list: Appointment[] = [];
    for (const appt of this.appointments.values()) {
      if (appt.leadId === leadId) {
        list.push(appt);
      }
    }
    return list.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  }

  public getBookedStartTimes(dateStr: string): string[] {
    const booked: string[] = [];
    for (const appt of this.appointments.values()) {
      if (appt.status !== "CANCELLED") {
        // Compare date portion in IST
        const apptDateStr = new Date(appt.startTime).toISOString().split("T")[0];
        if (apptDateStr === dateStr) {
          booked.push(appt.startTime);
        }
      }
    }
    return booked;
  }

  public updateAppointmentStatus(
    id: string,
    newStatus: AppointmentStatus,
    reason?: string,
    changedByName: string = "Admin"
  ): Appointment | undefined {
    const appt = this.appointments.get(id);
    if (!appt) return undefined;

    const oldStatus = appt.status;
    const now = new Date().toISOString();
    appt.status = newStatus;
    appt.updatedAt = now;
    this.appointments.set(id, appt);

    const lead = this.leads.get(appt.leadId);
    if (lead) {
      // If appointment completed, progress lead to CONSULTATION_COMPLETED
      if (newStatus === "COMPLETED" && lead.status === "CONSULTATION_BOOKED") {
        const prevLeadStatus = lead.status;
        lead.status = "CONSULTATION_COMPLETED";
        lead.updatedAt = now;
        lead.lastActivityAt = now;
        this.leads.set(lead.id, lead);

        this.addStatusHistory(
          lead.id,
          prevLeadStatus,
          "CONSULTATION_COMPLETED",
          reason || "Consultation successfully conducted by Dr. Lubna Fatima",
          changedByName
        );
      }

      this.addAuditLog({
        actorName: changedByName,
        action: "APPOINTMENT_STATUS_CHANGED",
        entityType: "lead",
        entityId: appt.leadId,
        metadata: { appointmentId: id, from: oldStatus, to: newStatus, reason },
      });
    }

    return appt;
  }

  // -------------------------------------------------------------------------
  // Payments & Checkout
  // -------------------------------------------------------------------------
  public createPaymentOrder(data: {
    leadId: string;
    programTrack: "Flex" | "Grit";
    supportTier: "Prime" | "Elite";
    duration: "1-month" | "3-months";
    amount: number;
    currency?: "INR";
    gatewayOrderId: string;
    gateway?: "razorpay" | "cashfree" | "mock";
  }): PaymentRecord {
    const lead = this.leads.get(data.leadId);
    if (!lead) {
      throw new Error(`Lead with ID ${data.leadId} not found`);
    }

    const now = new Date().toISOString();
    const id = `pay-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const payment: PaymentRecord = {
      id,
      leadId: data.leadId,
      customerId: null,
      programTrack: data.programTrack,
      supportTier: data.supportTier,
      duration: data.duration,
      amount: data.amount,
      currency: "INR",
      gateway: data.gateway || "razorpay",
      gatewayOrderId: data.gatewayOrderId,
      status: "CREATED",
      createdAt: now,
      updatedAt: now,
    };

    this.payments.set(data.gatewayOrderId, payment);

    // Update lead status to PAYMENT_PENDING if currently prior to payment
    if (lead.status !== "PAYMENT_PENDING" && lead.status !== "CONVERTED") {
      const oldStatus = lead.status;
      lead.status = "PAYMENT_PENDING";
      lead.updatedAt = now;
      lead.lastActivityAt = now;
      this.leads.set(data.leadId, lead);

      this.addStatusHistory(
        data.leadId,
        oldStatus,
        "PAYMENT_PENDING",
        `Initiated checkout for ${data.programTrack} (${data.supportTier} - ${data.duration}) - Order: ${data.gatewayOrderId}`,
        "System / Checkout"
      );
    }

    return payment;
  }

  public getPaymentByOrderId(orderId: string): PaymentRecord | undefined {
    return this.payments.get(orderId);
  }

  public getPaymentsByLeadId(leadId: string): PaymentRecord[] {
    const list: PaymentRecord[] = [];
    for (const pay of this.payments.values()) {
      if (pay.leadId === leadId) {
        list.push(pay);
      }
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public markPaymentSuccess(
    orderId: string,
    paymentId: string,
    signature: string
  ): { payment: PaymentRecord; lead: Lead; isFirstTime: boolean } {
    const payment = this.payments.get(orderId);
    if (!payment) {
      throw new Error(`Payment order ${orderId} not found`);
    }

    // Idempotency: if already SUCCESS, return immediately
    if (payment.status === "SUCCESS") {
      const lead = this.leads.get(payment.leadId)!;
      return { payment, lead, isFirstTime: false };
    }

    const now = new Date().toISOString();
    payment.status = "SUCCESS";
    payment.gatewayPaymentId = paymentId;
    payment.gatewaySignature = signature;
    payment.updatedAt = now;
    this.payments.set(orderId, payment);

    const lead = this.leads.get(payment.leadId);
    if (!lead) {
      throw new Error(`Lead ${payment.leadId} not found`);
    }

    const oldStatus = lead.status;
    lead.status = "CONVERTED";
    lead.updatedAt = now;
    lead.lastActivityAt = now;
    this.leads.set(lead.id, lead);

    this.addStatusHistory(
      lead.id,
      oldStatus,
      "CONVERTED",
      `Verified Razorpay payment ₹${payment.amount.toLocaleString("en-IN")} (${payment.programTrack} - ${payment.supportTier} ${payment.duration}). Payment ID: ${paymentId}`,
      "Razorpay Verification Engine"
    );

    this.createNotification({
      type: "STATUS_CHANGE",
      title: `Client Converted: ${lead.fullName}`,
      message: `Verified payment received: ₹${payment.amount.toLocaleString("en-IN")} for ${payment.programTrack} (${payment.supportTier} track).`,
      leadId: lead.id,
    });

    this.addAuditLog({
      actorName: "Payment Gateway",
      action: "PAYMENT_SUCCESS_VERIFIED",
      entityType: "lead",
      entityId: lead.id,
      metadata: {
        orderId,
        paymentId,
        amount: payment.amount,
        programTrack: payment.programTrack,
        supportTier: payment.supportTier,
      },
    });

    return { payment, lead, isFirstTime: true };
  }

  public markPaymentFailed(orderId: string, reason?: string): PaymentRecord | undefined {
    const payment = this.payments.get(orderId);
    if (!payment) return undefined;

    payment.status = "FAILED";
    payment.updatedAt = new Date().toISOString();
    this.payments.set(orderId, payment);

    const lead = this.leads.get(payment.leadId);
    if (lead) {
      // Lead remains in its current pre-conversion status (NOT CONVERTED)
      this.addAuditLog({
        actorName: "Payment Gateway",
        action: "PAYMENT_FAILED",
        entityType: "lead",
        entityId: lead.id,
        metadata: { orderId, reason: reason || "Transaction declined / failed" },
      });
    }

    return payment;
  }

  public markPaymentCancelled(orderId: string): PaymentRecord | undefined {
    const payment = this.payments.get(orderId);
    if (!payment) return undefined;

    payment.status = "CANCELLED";
    payment.updatedAt = new Date().toISOString();
    this.payments.set(orderId, payment);

    const lead = this.leads.get(payment.leadId);
    if (lead) {
      // Lead remains in pre-conversion status
      this.addAuditLog({
        actorName: "Client",
        action: "PAYMENT_CANCELLED",
        entityType: "lead",
        entityId: lead.id,
        metadata: { orderId },
      });
    }

    return payment;
  }

  // -------------------------------------------------------------------------
  // Dashboard Metrics
  // -------------------------------------------------------------------------
  public getMetrics(): DashboardMetrics {
    const all = Array.from(this.leads.values());
    return {
      totalLeads: all.length,
      newLeads: all.filter((l) => l.status === "NEW").length,
      followUps: all.filter((l) => l.status === "FOLLOW_UP").length,
      consultationsBooked: all.filter((l) => l.status === "CONSULTATION_BOOKED").length,
      converted: all.filter((l) => l.status === "CONVERTED").length,
      activeCustomers: all.filter((l) => l.status === "ACTIVE_CUSTOMER").length,
    };
  }
}

// Global Singleton for in-memory CRM store across hot-reloads
const globalForCrm = globalThis as unknown as { crmStore?: MemoryCrmStore };
export const crmStore = globalForCrm.crmStore || new MemoryCrmStore();
if (process.env.NODE_ENV !== "production") globalForCrm.crmStore = crmStore;
