import { createAdminClient } from "./admin";
import { crmStore } from "./mock-store";
import {
  Lead,
  LeadStatus,
  ClinicalAssessment,
  LeadNote,
  LeadStatusHistoryItem,
  SystemNotification,
  DashboardMetrics,
  Appointment,
  AppointmentStatus,
  PaymentRecord,
  PaymentStatus,
} from "@/types/crm";

/**
 * Unified CRM Database Gateway.
 * Uses Supabase PostgreSQL when credentials exist, otherwise falls back to
 * the resilient in-memory store for local testing and build stability.
 */

export const crmDb = {
  /**
   * Check if Supabase connection is actively configured.
   */
  isSupabaseConfigured(): boolean {
    return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  },

  /**
   * Find a lead by normalized phone or email.
   */
  async findLeadByPhoneOrEmail(phoneNormalized: string, email?: string | null): Promise<Lead | null> {
    const supabase = createAdminClient();
    if (!supabase) {
      return crmStore.findLeadByPhoneOrEmail(phoneNormalized, email) || null;
    }

    let query = supabase
      .from("leads")
      .select("*")
      .or(`phone_normalized.eq.${phoneNormalized}${email ? `,email.eq.${email}` : ""}`)
      .limit(1);

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return null;
    }

    const row = data[0];
    return {
      id: row.id,
      fullName: row.full_name,
      phone: row.phone,
      phoneNormalized: row.phone_normalized,
      email: row.email,
      age: row.age,
      gender: row.gender,
      city: row.city,
      status: row.status as LeadStatus,
      preferredProgram: row.preferred_program,
      preferredContactMethod: row.preferred_contact_method,
      sourceType: row.source_type,
      enquiryMessage: row.enquiry_message,
      utmSource: row.utm_source,
      utmMedium: row.utm_medium,
      utmCampaign: row.utm_campaign,
      utmContent: row.utm_content,
      utmTerm: row.utm_term,
      landingPage: row.landing_page,
      referrerUrl: row.referrer_url,
      deviceType: row.device_type,
      assignedTo: row.assigned_to,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lastActivityAt: row.last_activity_at,
    };
  },

  /**
   * Create or update a lead with automatic deduplication.
   */
  async createOrUpdateLead(data: {
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
  }): Promise<{ lead: Lead; isNew: boolean }> {
    const supabase = createAdminClient();
    if (!supabase) {
      return crmStore.createOrUpdateLead(data);
    }

    const existing = await this.findLeadByPhoneOrEmail(data.phoneNormalized, data.email);
    const now = new Date().toISOString();

    if (existing) {
      const updatePayload: Record<string, unknown> = {
        full_name: data.fullName || existing.fullName,
        email: data.email || existing.email,
        city: data.city || existing.city,
        age: data.age || existing.age,
        gender: data.gender || existing.gender,
        enquiry_message: data.enquiryMessage || existing.enquiryMessage,
        last_activity_at: now,
        updated_at: now,
      };

      if (existing.status === "LOST" || existing.status === "NOT_INTERESTED") {
        updatePayload.status = "FOLLOW_UP";
        await supabase.from("lead_status_history").insert({
          lead_id: existing.id,
          old_status: existing.status,
          new_status: "FOLLOW_UP",
          reason: "Lead re-engaged via new submission",
        });
      }

      await supabase.from("leads").update(updatePayload).eq("id", existing.id);

      await supabase.from("audit_logs").insert({
        action: "LEAD_RE_ENGAGED",
        entity_type: "lead",
        entity_id: existing.id,
        metadata: { source: data.sourceType, utm_source: data.utmSource },
      });

      const updatedLead = await this.getLeadById(existing.id);
      return { lead: updatedLead || existing, isNew: false };
    }

    // Insert new lead
    const { data: inserted, error } = await supabase
      .from("leads")
      .insert({
        full_name: data.fullName,
        phone: data.phone,
        phone_normalized: data.phoneNormalized,
        email: data.email || null,
        age: data.age || null,
        gender: data.gender || null,
        city: data.city || null,
        status: "NEW",
        preferred_program: data.preferredProgram || null,
        preferred_contact_method: data.preferredContactMethod || "WhatsApp",
        source_type: data.sourceType,
        enquiry_message: data.enquiryMessage || null,
        utm_source: data.utmSource || null,
        utm_medium: data.utmMedium || null,
        utm_campaign: data.utmCampaign || null,
        utm_content: data.utmContent || null,
        utm_term: data.utmTerm || null,
        landing_page: data.landingPage || null,
        referrer_url: data.referrerUrl || null,
        device_type: data.deviceType || null,
      })
      .select()
      .single();

    if (error || !inserted) {
      throw new Error(`Failed to create lead: ${error?.message || "Unknown error"}`);
    }

    // Initial status history
    await supabase.from("lead_status_history").insert({
      lead_id: inserted.id,
      old_status: null,
      new_status: "NEW",
      reason: "Initial lead creation",
    });

    // Create notification
    await supabase.from("notifications").insert({
      type: "NEW_LEAD",
      title: `New Lead: ${inserted.full_name}`,
      message: `${inserted.full_name} submitted via ${inserted.source_type}. Preferred: ${inserted.preferred_contact_method || "WhatsApp"}.`,
      lead_id: inserted.id,
    });

    // Audit log
    await supabase.from("audit_logs").insert({
      action: "LEAD_CREATED",
      entity_type: "lead",
      entity_id: inserted.id,
      metadata: { source: data.sourceType, utm_source: data.utmSource },
    });

    const leadObj: Lead = {
      id: inserted.id,
      fullName: inserted.full_name,
      phone: inserted.phone,
      phoneNormalized: inserted.phone_normalized,
      email: inserted.email,
      age: inserted.age,
      gender: inserted.gender,
      city: inserted.city,
      status: inserted.status as LeadStatus,
      preferredProgram: inserted.preferred_program,
      preferredContactMethod: inserted.preferred_contact_method,
      sourceType: inserted.source_type,
      enquiryMessage: inserted.enquiry_message,
      utmSource: inserted.utm_source,
      utmMedium: inserted.utm_medium,
      utmCampaign: inserted.utm_campaign,
      utmContent: inserted.utm_content,
      utmTerm: inserted.utm_term,
      landingPage: inserted.landing_page,
      referrerUrl: inserted.referrer_url,
      deviceType: inserted.device_type,
      assignedTo: inserted.assigned_to,
      createdAt: inserted.created_at,
      updatedAt: inserted.updated_at,
      lastActivityAt: inserted.last_activity_at,
    };

    return { lead: leadObj, isNew: true };
  },

  /**
   * Get single lead by ID with details (assessment, notes, status history).
   */
  async getLeadById(id: string): Promise<Lead | null> {
    const supabase = createAdminClient();
    if (!supabase) {
      return crmStore.getLeadById(id) || null;
    }

    const { data: leadRow, error } = await supabase.from("leads").select("*").eq("id", id).single();
    if (error || !leadRow) return null;

    // Fetch assessment, notes, status history, appointments, and payments in parallel
    const [asmtRes, notesRes, historyRes, apptsRes, paymentsRes] = await Promise.all([
      supabase.from("assessments").select("*").eq("lead_id", id).maybeSingle(),
      supabase.from("lead_notes").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
      supabase.from("lead_status_history").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
      supabase.from("appointments").select("*").eq("lead_id", id).order("start_time", { ascending: false }),
      supabase.from("payments").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
    ]);

    let assessment: ClinicalAssessment | null = null;
    if (asmtRes.data) {
      const a = asmtRes.data;
      assessment = {
        id: a.id,
        leadId: a.lead_id,
        createdAt: a.created_at,
        heightCm: Number(a.height_cm),
        currentWeightKg: Number(a.current_weight_kg),
        highestWeightKg: a.highest_weight_kg ? Number(a.highest_weight_kg) : null,
        targetWeightKg: Number(a.target_weight_kg),
        calculatedBmi: a.calculated_bmi ? Number(a.calculated_bmi) : null,
        targetTimeframe: a.target_timeframe,
        primaryGoals: a.primary_goals || [],
        medicalConditions: a.medical_conditions || [],
        medications: a.medications,
        surgeries: a.surgeries,
        femaleMarkers: a.female_markers || [],
        dailyWaterLiters: Number(a.daily_water_liters),
        sleepHours: Number(a.sleep_hours),
        bowelMovement: a.bowel_movement,
        eatingPatterns: a.eating_patterns || [],
        dietStruggles: a.diet_struggles,
        seriousnessScale: Number(a.seriousness_scale),
        lifeChangeVision: a.life_change_vision,
        pastRoadblocks: a.past_roadblocks,
        readyFor60Days: a.ready_for_60_days,
        referralSource: a.referral_source,
      };
    }

    const notes: LeadNote[] = (notesRes.data || []).map((n) => ({
      id: n.id,
      leadId: n.lead_id,
      authorId: n.author_id,
      authorName: n.author_name,
      noteBody: n.note_body,
      createdAt: n.created_at,
    }));

    const statusHistory: LeadStatusHistoryItem[] = (historyRes.data || []).map((h) => ({
      id: h.id,
      leadId: h.lead_id,
      oldStatus: h.old_status,
      newStatus: h.new_status as LeadStatus,
      changedBy: h.changed_by,
      reason: h.reason,
      createdAt: h.created_at,
    }));

    const appointments: Appointment[] = (apptsRes.data || []).map((a) => ({
      id: a.id,
      leadId: a.lead_id,
      customerId: a.customer_id,
      startTime: a.start_time,
      endTime: a.end_time,
      timezone: a.timezone,
      status: a.status as AppointmentStatus,
      meetingType: a.meeting_type,
      meetingLink: a.meeting_link,
      notes: a.notes,
      createdAt: a.created_at,
      updatedAt: a.updated_at,
    }));

    const payments: PaymentRecord[] = (paymentsRes.data || []).map((p) => ({
      id: p.id,
      leadId: p.lead_id,
      customerId: p.customer_id,
      programTrack: p.program_track,
      supportTier: p.support_tier,
      duration: p.duration,
      amount: p.amount,
      currency: p.currency,
      gateway: p.gateway,
      gatewayOrderId: p.gateway_order_id,
      gatewayPaymentId: p.gateway_payment_id,
      gatewaySignature: p.gateway_signature,
      status: p.status as PaymentStatus,
      metadata: p.metadata,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    }));

    return {
      id: leadRow.id,
      fullName: leadRow.full_name,
      phone: leadRow.phone,
      phoneNormalized: leadRow.phone_normalized,
      email: leadRow.email,
      age: leadRow.age,
      gender: leadRow.gender,
      city: leadRow.city,
      status: leadRow.status as LeadStatus,
      preferredProgram: leadRow.preferred_program,
      preferredContactMethod: leadRow.preferred_contact_method,
      sourceType: leadRow.source_type,
      enquiryMessage: leadRow.enquiry_message,
      utmSource: leadRow.utm_source,
      utmMedium: leadRow.utm_medium,
      utmCampaign: leadRow.utm_campaign,
      utmContent: leadRow.utm_content,
      utmTerm: leadRow.utm_term,
      landingPage: leadRow.landing_page,
      referrerUrl: leadRow.referrer_url,
      deviceType: leadRow.device_type,
      assignedTo: leadRow.assigned_to,
      createdAt: leadRow.created_at,
      updatedAt: leadRow.updated_at,
      lastActivityAt: leadRow.last_activity_at,
      assessment,
      notes,
      statusHistory,
      appointments,
      payments,
    };
  },

  /**
   * Query all leads with filtering, search, and pagination.
   */
  async getAllLeads(params?: {
    search?: string;
    status?: LeadStatus | "ALL";
    source?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ leads: Lead[]; total: number }> {
    const supabase = createAdminClient();
    if (!supabase) {
      return crmStore.getAllLeads(params);
    }

    let query = supabase.from("leads").select("*", { count: "exact" });

    if (params?.status && params.status !== "ALL") {
      query = query.eq("status", params.status);
    }

    if (params?.source && params.source !== "ALL") {
      query = query.ilike("utm_source", `%${params.source}%`);
    }

    if (params?.search && params.search.trim()) {
      const q = params.search.trim();
      query = query.or(`full_name.ilike.%${q}%,phone.ilike.%${q}%,email.ilike.%${q}%,city.ilike.%${q}%`);
    }

    query = query.order("created_at", { ascending: false });

    const page = Math.max(1, params?.page || 1);
    const pageSize = Math.max(1, params?.pageSize || 25);
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error || !data) {
      return { leads: [], total: 0 };
    }

    const leads: Lead[] = data.map((row) => ({
      id: row.id,
      fullName: row.full_name,
      phone: row.phone,
      phoneNormalized: row.phone_normalized,
      email: row.email,
      age: row.age,
      gender: row.gender,
      city: row.city,
      status: row.status as LeadStatus,
      preferredProgram: row.preferred_program,
      preferredContactMethod: row.preferred_contact_method,
      sourceType: row.source_type,
      enquiryMessage: row.enquiry_message,
      utmSource: row.utm_source,
      utmMedium: row.utm_medium,
      utmCampaign: row.utm_campaign,
      utmContent: row.utm_content,
      utmTerm: row.utm_term,
      landingPage: row.landing_page,
      referrerUrl: row.referrer_url,
      deviceType: row.device_type,
      assignedTo: row.assigned_to,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lastActivityAt: row.last_activity_at,
    }));

    return { leads, total: count || leads.length };
  },

  /**
   * Update lead status with history tracking.
   */
  async updateLeadStatus(
    leadId: string,
    newStatus: LeadStatus,
    reason?: string,
    changedByName: string = "Admin"
  ): Promise<Lead | null> {
    const supabase = createAdminClient();
    if (!supabase) {
      const updated = crmStore.updateLeadStatus(leadId, newStatus, reason, changedByName);
      return updated || null;
    }

    const currentLead = await this.getLeadById(leadId);
    if (!currentLead) return null;

    const oldStatus = currentLead.status;
    const now = new Date().toISOString();

    await supabase
      .from("leads")
      .update({ status: newStatus, last_activity_at: now, updated_at: now })
      .eq("id", leadId);

    await supabase.from("lead_status_history").insert({
      lead_id: leadId,
      old_status: oldStatus,
      new_status: newStatus,
      reason: reason || null,
    });

    await supabase.from("notifications").insert({
      type: "STATUS_CHANGE",
      title: `Status Changed: ${currentLead.fullName}`,
      message: `Status updated from ${oldStatus} to ${newStatus}.`,
      lead_id: leadId,
    });

    await supabase.from("audit_logs").insert({
      actor_name: changedByName,
      action: "STATUS_CHANGED",
      entity_type: "lead",
      entity_id: leadId,
      metadata: { from: oldStatus, to: newStatus, reason },
    });

    return this.getLeadById(leadId);
  },

  /**
   * Save a clinical health assessment record.
   */
  async createAssessment(
    leadId: string,
    assessmentData: Omit<ClinicalAssessment, "id" | "leadId" | "createdAt">
  ): Promise<ClinicalAssessment> {
    const supabase = createAdminClient();
    if (!supabase) {
      return crmStore.createAssessment(leadId, assessmentData);
    }

    const { data: inserted, error } = await supabase
      .from("assessments")
      .insert({
        lead_id: leadId,
        height_cm: assessmentData.heightCm,
        current_weight_kg: assessmentData.currentWeightKg,
        highest_weight_kg: assessmentData.highestWeightKg || null,
        target_weight_kg: assessmentData.targetWeightKg,
        calculated_bmi: assessmentData.calculatedBmi || null,
        target_timeframe: assessmentData.targetTimeframe,
        primary_goals: assessmentData.primaryGoals,
        medical_conditions: assessmentData.medicalConditions,
        medications: assessmentData.medications || null,
        surgeries: assessmentData.surgeries || null,
        female_markers: assessmentData.femaleMarkers || [],
        daily_water_liters: assessmentData.dailyWaterLiters,
        sleep_hours: assessmentData.sleepHours,
        bowel_movement: assessmentData.bowelMovement || null,
        eating_patterns: assessmentData.eatingPatterns,
        diet_struggles: assessmentData.dietStruggles || null,
        seriousness_scale: assessmentData.seriousnessScale,
        life_change_vision: assessmentData.lifeChangeVision || null,
        past_roadblocks: assessmentData.pastRoadblocks || null,
        ready_for_60_days: assessmentData.readyFor60Days,
        referral_source: assessmentData.referralSource || null,
      })
      .select()
      .single();

    if (error || !inserted) {
      throw new Error(`Failed to save clinical assessment: ${error?.message}`);
    }

    await supabase
      .from("leads")
      .update({ last_activity_at: new Date().toISOString() })
      .eq("id", leadId);

    await supabase.from("notifications").insert({
      type: "NEW_ASSESSMENT",
      title: "New Health Assessment Submitted",
      message: `Assessment attached to lead. Goals: ${assessmentData.primaryGoals.join(", ")}.`,
      lead_id: leadId,
    });

    await supabase.from("audit_logs").insert({
      action: "ASSESSMENT_SUBMITTED",
      entity_type: "assessment",
      entity_id: inserted.id,
      metadata: { leadId, primaryGoal: assessmentData.primaryGoals[0] },
    });

    return {
      id: inserted.id,
      leadId: inserted.lead_id,
      createdAt: inserted.created_at,
      ...assessmentData,
    };
  },

  /**
   * Add an internal note to a lead.
   */
  async addLeadNote(leadId: string, authorName: string, noteBody: string): Promise<LeadNote> {
    const supabase = createAdminClient();
    if (!supabase) {
      return crmStore.addLeadNote(leadId, authorName, noteBody);
    }

    const { data: inserted, error } = await supabase
      .from("lead_notes")
      .insert({
        lead_id: leadId,
        author_name: authorName,
        note_body: noteBody,
      })
      .select()
      .single();

    if (error || !inserted) {
      throw new Error(`Failed to add note: ${error?.message}`);
    }

    await supabase
      .from("leads")
      .update({ last_activity_at: new Date().toISOString() })
      .eq("id", leadId);

    await supabase.from("audit_logs").insert({
      actor_name: authorName,
      action: "NOTE_ADDED",
      entity_type: "note",
      entity_id: inserted.id,
      metadata: { leadId },
    });

    return {
      id: inserted.id,
      leadId: inserted.lead_id,
      authorName: inserted.author_name,
      noteBody: inserted.note_body,
      createdAt: inserted.created_at,
    };
  },

  /**
   * Get CRM high-level dashboard metrics.
   */
  async getMetrics(): Promise<DashboardMetrics> {
    const supabase = createAdminClient();
    if (!supabase) {
      return crmStore.getMetrics();
    }

    const { data: leads, error } = await supabase.from("leads").select("status");
    if (error || !leads) {
      return {
        totalLeads: 0,
        newLeads: 0,
        followUps: 0,
        consultationsBooked: 0,
        converted: 0,
        activeCustomers: 0,
      };
    }

    return {
      totalLeads: leads.length,
      newLeads: leads.filter((l) => l.status === "NEW").length,
      followUps: leads.filter((l) => l.status === "FOLLOW_UP").length,
      consultationsBooked: leads.filter((l) => l.status === "CONSULTATION_BOOKED").length,
      converted: leads.filter((l) => l.status === "CONVERTED").length,
      activeCustomers: leads.filter((l) => l.status === "ACTIVE_CUSTOMER").length,
    };
  },

  // -------------------------------------------------------------------------
  // Appointments & Consultation Booking
  // -------------------------------------------------------------------------
  async createAppointment(data: {
    leadId: string;
    startTime: string;
    endTime: string;
    meetingType?: "VIDEO_CALL" | "PHONE_CALL" | "IN_PERSON";
    notes?: string;
  }): Promise<Appointment> {
    const supabase = createAdminClient();
    if (!supabase) {
      return crmStore.createAppointment(data);
    }

    const { data: conflict } = await supabase
      .from("appointments")
      .select("id")
      .eq("start_time", data.startTime)
      .neq("status", "CANCELLED")
      .limit(1);

    if (conflict && conflict.length > 0) {
      throw new Error("This consultation slot is already booked. Please select another time.");
    }

    const { data: inserted, error } = await supabase
      .from("appointments")
      .insert({
        lead_id: data.leadId,
        start_time: data.startTime,
        end_time: data.endTime,
        timezone: "Asia/Kolkata",
        status: "REQUESTED",
        meeting_type: data.meetingType || "VIDEO_CALL",
        meeting_link: data.meetingType === "PHONE_CALL" ? null : "https://meet.google.com/vel-fit-consultation",
        notes: data.notes || null,
      })
      .select()
      .single();

    if (error || !inserted) {
      throw new Error(`Failed to create appointment: ${error?.message}`);
    }

    await this.updateLeadStatus(
      data.leadId,
      "CONSULTATION_BOOKED",
      `Consultation scheduled for ${new Date(data.startTime).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })} at ${new Date(data.startTime).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" })} IST`,
      "Client Booking Flow"
    );

    return {
      id: inserted.id,
      leadId: inserted.lead_id,
      customerId: inserted.customer_id,
      startTime: inserted.start_time,
      endTime: inserted.end_time,
      timezone: inserted.timezone,
      status: inserted.status as AppointmentStatus,
      meetingType: inserted.meeting_type,
      meetingLink: inserted.meeting_link,
      notes: inserted.notes,
      createdAt: inserted.created_at,
      updatedAt: inserted.updated_at,
    };
  },

  async getAppointmentsByLeadId(leadId: string): Promise<Appointment[]> {
    const supabase = createAdminClient();
    if (!supabase) {
      return crmStore.getAppointmentsByLeadId(leadId);
    }

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("lead_id", leadId)
      .order("start_time", { ascending: false });

    if (error || !data) return [];

    return data.map((a) => ({
      id: a.id,
      leadId: a.lead_id,
      customerId: a.customer_id,
      startTime: a.start_time,
      endTime: a.end_time,
      timezone: a.timezone,
      status: a.status as AppointmentStatus,
      meetingType: a.meeting_type,
      meetingLink: a.meeting_link,
      notes: a.notes,
      createdAt: a.created_at,
      updatedAt: a.updated_at,
    }));
  },

  async getBookedStartTimes(dateStr: string): Promise<string[]> {
    const supabase = createAdminClient();
    if (!supabase) {
      return crmStore.getBookedStartTimes(dateStr);
    }

    const startIso = `${dateStr}T00:00:00.000Z`;
    const endIso = `${dateStr}T23:59:59.999Z`;

    const { data, error } = await supabase
      .from("appointments")
      .select("start_time")
      .neq("status", "CANCELLED")
      .gte("start_time", startIso)
      .lte("start_time", endIso);

    if (error || !data) return [];
    return data.map((row) => row.start_time);
  },

  async updateAppointmentStatus(
    id: string,
    newStatus: AppointmentStatus,
    reason?: string,
    changedByName: string = "Admin"
  ): Promise<Appointment | null> {
    const supabase = createAdminClient();
    if (!supabase) {
      return crmStore.updateAppointmentStatus(id, newStatus, reason, changedByName) || null;
    }

    const { data: updated, error } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", id)
      .select()
      .single();

    if (error || !updated) return null;

    if (newStatus === "COMPLETED") {
      await this.updateLeadStatus(
        updated.lead_id,
        "CONSULTATION_COMPLETED",
        reason || "Consultation successfully conducted",
        changedByName
      );
    }

    return {
      id: updated.id,
      leadId: updated.lead_id,
      customerId: updated.customer_id,
      startTime: updated.start_time,
      endTime: updated.end_time,
      timezone: updated.timezone,
      status: updated.status as AppointmentStatus,
      meetingType: updated.meeting_type,
      meetingLink: updated.meeting_link,
      notes: updated.notes,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at,
    };
  },

  // -------------------------------------------------------------------------
  // Payments & Checkout
  // -------------------------------------------------------------------------
  async createPaymentOrder(data: {
    leadId: string;
    programTrack: "Flex" | "Grit";
    supportTier: "Prime" | "Elite";
    duration: "1-month" | "3-months";
    amount: number;
    currency?: "INR";
    gatewayOrderId: string;
    gateway?: "razorpay" | "cashfree" | "mock";
  }): Promise<PaymentRecord> {
    const supabase = createAdminClient();
    if (!supabase) {
      return crmStore.createPaymentOrder(data);
    }

    const { data: inserted, error } = await supabase
      .from("payments")
      .insert({
        lead_id: data.leadId,
        program_track: data.programTrack,
        support_tier: data.supportTier,
        duration: data.duration,
        amount: data.amount,
        currency: data.currency || "INR",
        gateway: data.gateway || "razorpay",
        gateway_order_id: data.gatewayOrderId,
        status: "CREATED",
      })
      .select()
      .single();

    if (error || !inserted) {
      throw new Error(`Failed to create payment order: ${error?.message}`);
    }

    const lead = await this.getLeadById(data.leadId);
    if (lead && lead.status !== "PAYMENT_PENDING" && lead.status !== "CONVERTED") {
      await this.updateLeadStatus(
        data.leadId,
        "PAYMENT_PENDING",
        `Initiated checkout for ${data.programTrack} (${data.supportTier} - ${data.duration}) - Order: ${data.gatewayOrderId}`,
        "System / Checkout"
      );
    }

    return {
      id: inserted.id,
      leadId: inserted.lead_id,
      customerId: inserted.customer_id,
      programTrack: inserted.program_track,
      supportTier: inserted.support_tier,
      duration: inserted.duration,
      amount: inserted.amount,
      currency: inserted.currency,
      gateway: inserted.gateway,
      gatewayOrderId: inserted.gateway_order_id,
      gatewayPaymentId: inserted.gateway_payment_id,
      gatewaySignature: inserted.gateway_signature,
      status: inserted.status as PaymentStatus,
      metadata: inserted.metadata,
      createdAt: inserted.created_at,
      updatedAt: inserted.updated_at,
    };
  },

  async getPaymentByOrderId(orderId: string): Promise<PaymentRecord | null> {
    const supabase = createAdminClient();
    if (!supabase) {
      return crmStore.getPaymentByOrderId(orderId) || null;
    }

    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("gateway_order_id", orderId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      leadId: data.lead_id,
      customerId: data.customer_id,
      programTrack: data.program_track,
      supportTier: data.support_tier,
      duration: data.duration,
      amount: data.amount,
      currency: data.currency,
      gateway: data.gateway,
      gatewayOrderId: data.gateway_order_id,
      gatewayPaymentId: data.gateway_payment_id,
      gatewaySignature: data.gateway_signature,
      status: data.status as PaymentStatus,
      metadata: data.metadata,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async getPaymentsByLeadId(leadId: string): Promise<PaymentRecord[]> {
    const supabase = createAdminClient();
    if (!supabase) {
      return crmStore.getPaymentsByLeadId(leadId);
    }

    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((p) => ({
      id: p.id,
      leadId: p.lead_id,
      customerId: p.customer_id,
      programTrack: p.program_track,
      supportTier: p.support_tier,
      duration: p.duration,
      amount: p.amount,
      currency: p.currency,
      gateway: p.gateway,
      gatewayOrderId: p.gateway_order_id,
      gatewayPaymentId: p.gateway_payment_id,
      gatewaySignature: p.gateway_signature,
      status: p.status as PaymentStatus,
      metadata: p.metadata,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    }));
  },

  async markPaymentSuccess(
    orderId: string,
    paymentId: string,
    signature: string
  ): Promise<{ payment: PaymentRecord; lead: Lead; isFirstTime: boolean }> {
    const supabase = createAdminClient();
    if (!supabase) {
      return crmStore.markPaymentSuccess(orderId, paymentId, signature);
    }

    const existing = await this.getPaymentByOrderId(orderId);
    if (!existing) {
      throw new Error(`Payment order ${orderId} not found`);
    }

    if (existing.status === "SUCCESS") {
      const lead = await this.getLeadById(existing.leadId);
      if (!lead) throw new Error(`Lead ${existing.leadId} not found`);
      return { payment: existing, lead, isFirstTime: false };
    }

    const now = new Date().toISOString();
    const { data: updated, error } = await supabase
      .from("payments")
      .update({
        status: "SUCCESS",
        gateway_payment_id: paymentId,
        gateway_signature: signature,
        updated_at: now,
      })
      .eq("gateway_order_id", orderId)
      .select()
      .single();

    if (error || !updated) {
      throw new Error(`Failed to update payment success: ${error?.message}`);
    }

    const updatedLead = await this.updateLeadStatus(
      existing.leadId,
      "CONVERTED",
      `Verified Razorpay payment ₹${existing.amount.toLocaleString("en-IN")} (${existing.programTrack} - ${existing.supportTier} ${existing.duration}). Payment ID: ${paymentId}`,
      "Razorpay Verification Engine"
    );

    if (!updatedLead) throw new Error(`Lead ${existing.leadId} not found`);

    return {
      payment: {
        id: updated.id,
        leadId: updated.lead_id,
        customerId: updated.customer_id,
        programTrack: updated.program_track,
        supportTier: updated.support_tier,
        duration: updated.duration,
        amount: updated.amount,
        currency: updated.currency,
        gateway: updated.gateway,
        gatewayOrderId: updated.gateway_order_id,
        gatewayPaymentId: updated.gateway_payment_id,
        gatewaySignature: updated.gateway_signature,
        status: updated.status as PaymentStatus,
        metadata: updated.metadata,
        createdAt: updated.created_at,
        updatedAt: updated.updated_at,
      },
      lead: updatedLead,
      isFirstTime: true,
    };
  },

  async markPaymentFailed(orderId: string, reason?: string): Promise<PaymentRecord | null> {
    const supabase = createAdminClient();
    if (!supabase) {
      return crmStore.markPaymentFailed(orderId, reason) || null;
    }

    const { data: updated, error } = await supabase
      .from("payments")
      .update({ status: "FAILED" })
      .eq("gateway_order_id", orderId)
      .select()
      .single();

    if (error || !updated) return null;

    return {
      id: updated.id,
      leadId: updated.lead_id,
      customerId: updated.customer_id,
      programTrack: updated.program_track,
      supportTier: updated.support_tier,
      duration: updated.duration,
      amount: updated.amount,
      currency: updated.currency,
      gateway: updated.gateway,
      gatewayOrderId: updated.gateway_order_id,
      gatewayPaymentId: updated.gateway_payment_id,
      gatewaySignature: updated.gateway_signature,
      status: updated.status as PaymentStatus,
      metadata: updated.metadata,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at,
    };
  },

  async markPaymentCancelled(orderId: string): Promise<PaymentRecord | null> {
    const supabase = createAdminClient();
    if (!supabase) {
      return crmStore.markPaymentCancelled(orderId) || null;
    }

    const { data: updated, error } = await supabase
      .from("payments")
      .update({ status: "CANCELLED" })
      .eq("gateway_order_id", orderId)
      .select()
      .single();

    if (error || !updated) return null;

    return {
      id: updated.id,
      leadId: updated.lead_id,
      customerId: updated.customer_id,
      programTrack: updated.program_track,
      supportTier: updated.support_tier,
      duration: updated.duration,
      amount: updated.amount,
      currency: updated.currency,
      gateway: updated.gateway,
      gatewayOrderId: updated.gateway_order_id,
      gatewayPaymentId: updated.gateway_payment_id,
      gatewaySignature: updated.gateway_signature,
      status: updated.status as PaymentStatus,
      metadata: updated.metadata,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at,
    };
  },
};
