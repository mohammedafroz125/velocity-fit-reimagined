import Link from "next/link";
import { crmDb } from "@/lib/supabase/db";
import { LeadsFilters } from "@/components/admin/leads-filters";
import { Button } from "@/components/ui/button";
import {
  Users,
  Clock,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Shield,
} from "lucide-react";
import { LeadStatus } from "@/types/crm";

function getStatusBadge(status: LeadStatus) {
  switch (status) {
    case "NEW":
      return "bg-blue-50 text-blue-800 border-blue-200 font-mono";
    case "CONTACTED":
      return "bg-sky-50 text-sky-800 border-sky-200 font-mono";
    case "QUALIFIED":
      return "bg-emerald-50 text-emerald-800 border-emerald-200 font-mono";
    case "FOLLOW_UP":
      return "bg-amber-50 text-amber-800 border-amber-200 font-mono";
    case "CONSULTATION_BOOKED":
      return "bg-purple-50 text-purple-800 border-purple-200 font-mono";
    case "CONSULTATION_COMPLETED":
      return "bg-indigo-50 text-indigo-800 border-indigo-200 font-mono";
    case "PAYMENT_PENDING":
      return "bg-orange-50 text-orange-800 border-orange-200 font-mono";
    case "CONVERTED":
      return "bg-olive-deep text-paper border-olive-deep font-mono font-semibold";
    case "ACTIVE_CUSTOMER":
      return "bg-champagne/30 text-ink border-champagne font-mono font-semibold";
    case "NOT_INTERESTED":
      return "bg-stone-100 text-stone-600 border-stone-200 font-mono";
    case "LOST":
      return "bg-red-50 text-red-700 border-red-200 font-mono";
    default:
      return "bg-stone-50 text-stone-700 border-stone-200 font-mono";
  }
}

export default async function LeadsManagementPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    source?: string;
  }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const pageSize = 15;
  const search = params.search || "";
  const status = (params.status || "ALL") as LeadStatus | "ALL";
  const source = params.source || "ALL";

  const { leads, total } = await crmDb.getAllLeads({
    page,
    pageSize,
    search,
    status,
    source,
  });

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6 font-body">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ink/10">
        <div className="space-y-1">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-olive-deep block">
            CRM Leads Pipeline
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-medium text-ink tracking-tight">
            Inbound Prospective Clients
          </h1>
          <p className="text-xs sm:text-sm text-ink-soft">
            Total recorded leads: <strong className="text-ink font-semibold">{total}</strong>
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <LeadsFilters />

      {/* Leads Table */}
      {leads.length === 0 ? (
        <div className="p-16 rounded-3xl bg-paper border border-ink/10 text-center space-y-4 shadow-subtle">
          <div className="w-12 h-12 rounded-2xl bg-ivory border border-ink/10 flex items-center justify-center mx-auto text-ink-soft">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-ink">
              No Leads Found
            </h3>
            <p className="text-xs text-ink-soft max-w-md mx-auto leading-relaxed">
              No lead records match your current search and status filters. Try clearing your filters or testing the intake form.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-paper border border-ink/10 overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory/80 border-b border-ink/10 text-ink-soft font-mono uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3.5 font-semibold">Client Name</th>
                  <th className="px-4 py-3.5 font-semibold">Phone</th>
                  <th className="px-4 py-3.5 font-semibold">Source / Campaign</th>
                  <th className="px-4 py-3.5 font-semibold">Status</th>
                  <th className="px-4 py-3.5 font-semibold">Submitted</th>
                  <th className="px-4 py-3.5 font-semibold">Assigned To</th>
                  <th className="px-4 py-3.5 font-semibold">Last Activity</th>
                  <th className="px-4 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5 text-ink">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-ivory/60 transition-colors group"
                  >
                    <td className="px-4 py-4">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="font-semibold text-ink group-hover:text-olive-deep transition-colors block text-sm"
                      >
                        {lead.fullName}
                      </Link>
                      <div className="text-[11px] text-ink-soft flex items-center gap-1.5 mt-0.5">
                        {lead.city && <span>{lead.city}</span>}
                        {lead.city && lead.age && <span>•</span>}
                        {lead.age && <span>{lead.age} yrs</span>}
                      </div>
                    </td>

                    <td className="px-4 py-4 font-mono text-[11px] text-ink">
                      {lead.phone}
                    </td>

                    <td className="px-4 py-4">
                      <span className="px-2 py-0.5 rounded-md bg-ivory border border-ink/10 text-[10px] font-mono text-olive-deep font-semibold block max-w-max">
                        {lead.utmSource || (lead.sourceType === "ASSESSMENT_WIZARD" ? "Assessment" : "Contact")}
                      </span>
                      {lead.utmCampaign && (
                        <span className="text-[9px] text-ink-soft block mt-0.5">
                          {lead.utmCampaign}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                          lead.status
                        )}`}
                      >
                        {lead.status.replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-ink-soft text-[11px] font-mono">
                      {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-4 py-4 text-[11px] text-ink">
                      {lead.assignedAdminName || (
                        <span className="text-ink-soft/40 text-[10px] italic">Unassigned</span>
                      )}
                    </td>

                    <td className="px-4 py-4 text-ink-soft text-[11px]">
                      <span className="flex items-center space-x-1 font-mono">
                        <Clock className="w-3 h-3 text-ink-soft/70" />
                        <span>
                          {new Date(lead.lastActivityAt || lead.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-olive-deep hover:underline transition-colors py-1 px-2.5 rounded-lg"
                      >
                        <span>Open Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 bg-ivory/50 border-t border-ink/10 flex items-center justify-between text-xs text-ink-soft">
              <span className="font-mono">
                Page {page} of {totalPages} ({total} leads)
              </span>

              <div className="flex items-center space-x-2">
                {page > 1 ? (
                  <Link
                    href={`/admin/leads?page=${page - 1}&search=${encodeURIComponent(
                      search
                    )}&status=${status}&source=${source}`}
                    className="px-3 py-1.5 rounded-lg bg-paper border border-ink/10 hover:bg-ivory text-ink text-xs font-medium flex items-center transition-colors shadow-sm"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                    <span>Previous</span>
                  </Link>
                ) : (
                  <span className="px-3 py-1.5 rounded-lg bg-paper/50 border border-ink/5 text-ink-soft/40 text-xs font-medium flex items-center cursor-not-allowed">
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                    <span>Previous</span>
                  </span>
                )}

                {page < totalPages ? (
                  <Link
                    href={`/admin/leads?page=${page + 1}&search=${encodeURIComponent(
                      search
                    )}&status=${status}&source=${source}`}
                    className="px-3 py-1.5 rounded-lg bg-paper border border-ink/10 hover:bg-ivory text-ink text-xs font-medium flex items-center transition-colors shadow-sm"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                ) : (
                  <span className="px-3 py-1.5 rounded-lg bg-paper/50 border border-ink/5 text-ink-soft/40 text-xs font-medium flex items-center cursor-not-allowed">
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
