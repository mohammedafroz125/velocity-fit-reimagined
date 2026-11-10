import Link from "next/link";
import { crmDb } from "@/lib/supabase/db";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserPlus,
  PhoneCall,
  CalendarCheck,
  Award,
  Sparkles,
  ArrowRight,
  Clock,
  ExternalLink,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const metrics = await crmDb.getMetrics();
  const { leads: recentLeads } = await crmDb.getAllLeads({ page: 1, pageSize: 5 });

  const statCards = [
    {
      label: "New Leads",
      value: metrics.newLeads,
      icon: UserPlus,
      color: "text-emerald-800 bg-emerald-50 border-emerald-200",
      description: "Awaiting initial contact",
    },
    {
      label: "Follow-Ups",
      value: metrics.followUps,
      icon: PhoneCall,
      color: "text-amber-800 bg-amber-50 border-amber-200",
      description: "Scheduled for touchpoints",
    },
    {
      label: "Consultations Booked",
      value: metrics.consultationsBooked,
      icon: CalendarCheck,
      color: "text-green-800 bg-green-50 border-green-200",
      description: "Confirmed with Dr. Fatima",
    },
    {
      label: "Converted",
      value: metrics.converted,
      icon: Award,
      color: "text-yellow-800 bg-yellow-50 border-yellow-200",
      description: "Paid transformation enrollments",
    },
    {
      label: "Active Customers",
      value: metrics.activeCustomers,
      icon: Sparkles,
      color: "text-teal-800 bg-teal-50 border-teal-200",
      description: "Currently in Flex or Grit tracks",
    },
  ];

  return (
    <div className="space-y-8 font-body">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ink/10">
        <div className="space-y-1">
          {/* Islamic greeting strip */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-2"
            style={{ background: "rgba(26,71,49,0.08)", border: "1px solid rgba(26,71,49,0.15)" }}
          >
            <span className="text-sm" style={{ fontFamily: "serif", color: "#1a4731" }}>☽</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: "#1a4731" }}>
              بِسْمِ اللَّه &nbsp;·&nbsp; Practice Overview
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-medium text-ink tracking-tight">
            Clinical Command Center
          </h1>
          <p className="text-xs sm:text-sm text-ink-soft">
            Real-time pipeline of incoming consultations, health audits, and practice conversion metrics.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all shadow-subtle"
            style={{ background: "#1a4731", color: "#f0d060" }}
          >
            <Users className="w-4 h-4" />
            <span>Open Lead Pipeline</span>
          </Link>
        </div>
      </div>

      {/* High-Level Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-5 rounded-2xl bg-paper border border-ink/10 shadow-subtle flex flex-col justify-between space-y-3 hover:border-ink/20 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-ink-soft">
                  {stat.label}
                </span>
                <div className={`p-2 rounded-xl border ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="font-display text-2xl sm:text-3xl font-semibold text-ink block">
                  {stat.value}
                </span>
                <span className="text-[11px] text-ink-soft/80 leading-tight mt-0.5 block font-body">
                  {stat.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity & Leads Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-medium text-ink">
              Recent Inbound Leads
            </h2>
            <p className="text-xs text-ink-soft">
              Latest prospects captured from public forms and health assessments.
            </p>
          </div>
          <Link
            href="/admin/leads"
            className="text-xs font-mono text-olive-deep hover:underline transition-colors flex items-center space-x-1 uppercase tracking-wider font-semibold"
          >
            <span>View All Leads ({metrics.totalLeads})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <div className="p-12 rounded-3xl bg-paper border border-ink/10 text-center space-y-4 shadow-subtle">
            <div className="w-12 h-12 rounded-2xl bg-ivory border border-ink/10 flex items-center justify-center mx-auto text-ink-soft">
              <Users className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-ink">
                No Leads in Database Yet
              </h3>
              <p className="text-xs text-ink-soft max-w-sm mx-auto leading-relaxed">
                When visitors submit the Contact Form or complete the 5-Stage Health Assessment, their verified profile will appear here immediately.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/get-started"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-ink text-paper hover:bg-ink-soft text-xs font-semibold transition-all shadow-subtle"
              >
                <span>Test Intake Form</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-paper border border-ink/10 overflow-hidden shadow-subtle">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-ivory/80 border-b border-ink/10 text-ink-soft font-mono uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Lead Name</th>
                    <th className="px-5 py-3.5 font-semibold">Phone</th>
                    <th className="px-5 py-3.5 font-semibold">Channel</th>
                    <th className="px-5 py-3.5 font-semibold">Status</th>
                    <th className="px-5 py-3.5 font-semibold">Submitted</th>
                    <th className="px-5 py-3.5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5 text-ink">
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-ivory/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-ink block">
                          {lead.fullName}
                        </span>
                        {lead.city && (
                          <span className="text-[10px] text-ink-soft">{lead.city}</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-ink">
                        {lead.phone}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-ivory border border-ink/10 text-[10px] font-mono text-olive-deep font-semibold">
                          {lead.sourceType === "ASSESSMENT_WIZARD"
                            ? "V6 Assessment"
                            : "Contact Form"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-olive/10 text-olive-deep border border-olive/25">
                          {lead.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-ink-soft text-[11px]">
                        <span className="flex items-center space-x-1 font-mono">
                          <Clock className="w-3 h-3 text-ink-soft/70" />
                          <span>{new Date(lead.createdAt).toLocaleDateString("en-IN")}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="text-xs font-semibold text-olive-deep hover:underline transition-colors"
                        >
                          View Lead →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
