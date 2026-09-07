import Link from "next/link";
import { notFound } from "next/navigation";
import { crmDb } from "@/lib/supabase/db";
import { LeadStatusManager } from "@/components/admin/lead-status-manager";
import { LeadNotesManager } from "@/components/admin/lead-notes-manager";
import { AppointmentManager } from "@/components/admin/appointment-manager";
import { LeadPaymentsView } from "@/components/admin/lead-payments-view";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageSquareQuote,
  Clock,
  ShieldAlert,
  Activity,
  HeartPulse,
  Flame,
  Scale,
  Compass,
  FileText,
  UserCheck,
} from "lucide-react";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await crmDb.getLeadById(id);

  if (!lead) {
    notFound();
  }

  const assessment = lead.assessment;
  const notes = lead.notes || [];
  const history = lead.statusHistory || [];
  const appointments = lead.appointments || [];
  const payments = lead.payments || [];

  // Safe pre-populated WhatsApp message for Dr. Fatima (NO SENSITIVE MEDICAL DATA)
  const whatsappGreeting = encodeURIComponent(
    `Hello ${lead.fullName}, this is Dr. Lubna Fatima from Velocity Fit. I have reviewed your inquiry regarding ${
      lead.preferredProgram || "our clinical transformation programs"
    } and would like to coordinate your initial consultation. Are you available for a brief conversation?`
  );

  return (
    <div className="space-y-8 font-body">
      {/* Back to Pipeline */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/leads"
          className="text-xs text-ink-soft hover:text-olive-deep transition-colors flex items-center space-x-1.5 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Leads</span>
        </Link>
        <span className="text-[11px] font-mono text-ink-soft/60">ID: {lead.id}</span>
      </div>

      {/* Hero Header & Quick Action Buttons */}
      <div className="p-6 sm:p-8 rounded-3xl bg-paper border border-ink/10 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-olive-deep">
              {lead.sourceType === "ASSESSMENT_WIZARD"
                ? "5-Stage Clinical Intake"
                : "General Lead Inquiry"}
            </span>
            <span className="text-ink/30 text-xs">•</span>
            <span className="text-xs text-ink-soft">
              Captured {new Date(lead.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-medium text-ink tracking-tight">
            {lead.fullName}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-ink-soft pt-1">
            <span className="font-mono text-ink font-semibold">{lead.phone}</span>
            {lead.email && <span>{lead.email}</span>}
            {lead.city && <span>{lead.city}</span>}
            {lead.age && <span>{lead.age} yrs ({lead.gender || "Not specified"})</span>}
          </div>
        </div>

        {/* 1-Click Communications Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href={`https://wa.me/${lead.phoneNormalized}?text=${whatsappGreeting}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-ink text-paper hover:bg-ink-soft text-xs font-semibold tracking-wide transition-all shadow-subtle cursor-pointer"
          >
            <MessageSquareQuote className="w-4 h-4 text-champagne" />
            <span>WhatsApp Consultation</span>
          </a>

          <a
            href={`tel:${lead.phone}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-ivory hover:bg-paper text-ink border border-ink/15 text-xs font-semibold transition-colors shadow-sm"
          >
            <Phone className="w-3.5 h-3.5 text-olive-deep" />
            <span>Call Client</span>
          </a>

          {lead.email && (
            <a
              href={`mailto:${lead.email}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-ivory hover:bg-paper text-ink border border-ink/15 text-xs font-semibold transition-colors shadow-sm"
            >
              <Mail className="w-3.5 h-3.5 text-olive-deep" />
              <span>Email</span>
            </a>
          )}
        </div>
      </div>

      {/* Main Grid: Clinical Assessment / Inquiries vs. Sidebar Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Assessment & Primary Details (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Clinical Assessment Section */}
          {assessment ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-paper border border-ink/10 space-y-6 shadow-subtle">
              <div className="flex items-center justify-between pb-4 border-b border-ink/10">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-olive/10 text-olive-deep border border-olive/20">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-medium text-ink">
                      Protected Clinical Assessment
                    </h2>
                    <p className="text-xs text-ink-soft">
                      Physician-only metabolic intake & V6 Audit™ markers.
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-olive/15 text-olive-deep border border-olive/30">
                  Verified Intake
                </span>
              </div>

              {/* Vital Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-ivory border border-ink/10 space-y-1">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-soft block">
                    Height
                  </span>
                  <span className="text-base font-semibold text-ink">
                    {assessment.heightCm} cm
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-ivory border border-ink/10 space-y-1">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-soft block">
                    Current Weight
                  </span>
                  <span className="text-base font-semibold text-ink">
                    {assessment.currentWeightKg} kg
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-ivory border border-ink/10 space-y-1">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-soft block">
                    Target Weight
                  </span>
                  <span className="text-base font-semibold text-olive-deep font-mono">
                    {assessment.targetWeightKg} kg
                  </span>
                  <span className="text-[10px] text-ink-soft block font-mono">
                    in {assessment.targetTimeframe}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-ivory border border-ink/10 space-y-1">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-soft block">
                    Calculated BMI
                  </span>
                  <span className="text-base font-semibold text-ink font-mono">
                    {assessment.calculatedBmi ? `BMI ${assessment.calculatedBmi}` : "—"}
                  </span>
                </div>
              </div>

              {/* Primary Goals */}
              <div className="space-y-2">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-soft block">
                  Primary Transformation Goals
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {assessment.primaryGoals.map((g) => (
                    <span
                      key={g}
                      className="px-3 py-1 rounded-full bg-ivory text-ink border border-ink/10 text-xs font-medium shadow-sm"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Medical & Clinical Background */}
              <div className="space-y-3 pt-3 border-t border-ink/10">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-soft block">
                  Medical Background & Markers
                </span>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-ink">Diagnosed Conditions: </span>
                    <span className="text-ink-soft">
                      {assessment.medicalConditions.length > 0
                        ? assessment.medicalConditions.join(", ")
                        : "None reported"}
                    </span>
                  </div>
                  {assessment.medications && (
                    <div>
                      <span className="font-semibold text-ink">Current Medications: </span>
                      <span className="text-ink-soft">{assessment.medications}</span>
                    </div>
                  )}
                  {assessment.surgeries && (
                    <div>
                      <span className="font-semibold text-ink">Past Surgeries: </span>
                      <span className="text-ink-soft">{assessment.surgeries}</span>
                    </div>
                  )}
                  {assessment.femaleMarkers && assessment.femaleMarkers.length > 0 && (
                    <div>
                      <span className="font-semibold text-ink">Female Health Indicators: </span>
                      <span className="text-ink-soft">
                        {assessment.femaleMarkers.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Habits & V6 Audit™ Markers */}
              <div className="space-y-3 pt-3 border-t border-ink/10">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-soft block">
                  V6 Audit™ Habit Baseline
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-ivory border border-ink/10">
                    <span className="text-[10px] text-ink-soft block font-mono">Water Intake</span>
                    <span className="font-semibold text-ink">
                      {assessment.dailyWaterLiters} L / day
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-ivory border border-ink/10">
                    <span className="text-[10px] text-ink-soft block font-mono">Sleep Duration</span>
                    <span className="font-semibold text-ink">
                      {assessment.sleepHours} hrs / night
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-ivory border border-ink/10">
                    <span className="text-[10px] text-ink-soft block font-mono">Bowel Regularity</span>
                    <span className="font-semibold text-ink">
                      {assessment.bowelMovement || "Normal"}
                    </span>
                  </div>
                </div>

                {assessment.eatingPatterns && assessment.eatingPatterns.length > 0 && (
                  <div className="text-xs">
                    <span className="font-semibold text-ink">Eating Tendencies: </span>
                    <span className="text-ink-soft">
                      {assessment.eatingPatterns.join(", ")}
                    </span>
                  </div>
                )}

                {assessment.dietStruggles && (
                  <div className="text-xs">
                    <span className="font-semibold text-ink">Reported Struggles: </span>
                    <span className="text-ink-soft">{assessment.dietStruggles}</span>
                  </div>
                )}
              </div>

              {/* Readiness & Motivation */}
              <div className="space-y-2 pt-3 border-t border-ink/10 text-xs">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-soft block">
                  Commitment & Readiness
                </span>
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-ink-soft">Seriousness Rating: </span>
                    <span className="font-bold text-olive-deep text-sm font-mono">
                      {assessment.seriousnessScale} / 10
                    </span>
                  </div>
                  <div>
                    <span className="text-ink-soft">60-Day Commitment: </span>
                    <span className="font-semibold text-ink">
                      {assessment.readyFor60Days}
                    </span>
                  </div>
                </div>
                {assessment.lifeChangeVision && (
                  <p className="text-ink italic bg-ivory p-3.5 rounded-xl border border-ink/10 mt-2">
                    &ldquo;{assessment.lifeChangeVision}&rdquo;
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-paper border border-ink/10 space-y-4 shadow-subtle">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-olive-deep" />
                <h2 className="font-display text-base font-medium text-ink">
                  Enquiry Message
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-ink leading-relaxed whitespace-pre-wrap bg-ivory p-4 rounded-2xl border border-ink/10">
                {lead.enquiryMessage || "No additional text provided."}
              </p>
            </div>
          )}

          {/* Consultation Appointments Manager */}
          <AppointmentManager leadId={lead.id} appointments={appointments} />

          {/* Lead Notes Manager */}
          <LeadNotesManager leadId={lead.id} notes={notes} />
        </div>

        {/* Right Column: Status Pipeline, Attribution & Audit (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Status Pipeline Component */}
          <LeadStatusManager leadId={lead.id} currentStatus={lead.status} />

          {/* Payment & Enrollment Records */}
          <LeadPaymentsView payments={payments} />

          {/* Marketing Attribution Card */}
          <div className="p-5 rounded-2xl bg-paper border border-ink/10 space-y-4 shadow-subtle">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-olive-deep" />
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-ink">
                Marketing & Campaign Attribution
              </h3>
            </div>

            <div className="space-y-2 text-xs font-body">
              <div className="flex justify-between py-1 border-b border-ink/5">
                <span className="text-ink-soft">Acquisition Source:</span>
                <span className="font-semibold text-ink">{lead.utmSource || "direct"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-ink/5">
                <span className="text-ink-soft">Medium:</span>
                <span className="text-ink">{lead.utmMedium || "—"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-ink/5">
                <span className="text-ink-soft">Campaign:</span>
                <span className="text-ink">{lead.utmCampaign || "—"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-ink/5">
                <span className="text-ink-soft">Landing Page:</span>
                <span className="text-ink truncate max-w-[200px]" title={lead.landingPage || ""}>
                  {lead.landingPage || "—"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-ink/5">
                <span className="text-ink-soft">Device:</span>
                <span className="text-ink capitalize">{lead.deviceType || "unknown"}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-ink-soft">Preferred Contact:</span>
                <span className="font-semibold text-olive-deep">{lead.preferredContactMethod || "WhatsApp"}</span>
              </div>
            </div>
          </div>

          {/* Status History Timeline */}
          <div className="p-5 rounded-2xl bg-paper border border-ink/10 space-y-4 shadow-subtle">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-olive-deep" />
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-ink">
                Pipeline History Timeline
              </h3>
            </div>

            <div className="space-y-3 font-body">
              {history.length === 0 ? (
                <p className="text-xs text-ink-soft italic">No status changes recorded yet.</p>
              ) : (
                history.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="relative pl-5 pb-3 border-l border-ink/15 last:border-0 last:pb-0 text-xs space-y-0.5"
                  >
                    <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-olive-deep" />
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-ink">
                        {item.newStatus.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] text-ink-soft font-mono">
                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {item.reason && (
                      <p className="text-[11px] text-ink-soft">{item.reason}</p>
                    )}
                    <span className="text-[10px] text-ink-soft/70 block font-mono">
                      By {item.changedByName || "System"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
