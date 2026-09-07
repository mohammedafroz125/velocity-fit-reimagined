"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, Filter, RotateCcw } from "lucide-react";
import { LeadStatus } from "@/types/crm";

const ALL_STATUSES: { label: string; value: LeadStatus | "ALL" }[] = [
  { label: "All Statuses", value: "ALL" },
  { label: "NEW", value: "NEW" },
  { label: "CONTACTED", value: "CONTACTED" },
  { label: "QUALIFIED", value: "QUALIFIED" },
  { label: "FOLLOW UP", value: "FOLLOW_UP" },
  { label: "CONSULTATION BOOKED", value: "CONSULTATION_BOOKED" },
  { label: "CONSULTATION COMPLETED", value: "CONSULTATION_COMPLETED" },
  { label: "PAYMENT PENDING", value: "PAYMENT_PENDING" },
  { label: "CONVERTED", value: "CONVERTED" },
  { label: "ACTIVE CUSTOMER", value: "ACTIVE_CUSTOMER" },
  { label: "NOT INTERESTED", value: "NOT_INTERESTED" },
  { label: "LOST", value: "LOST" },
];

const CHANNELS = [
  { label: "All Sources", value: "ALL" },
  { label: "Instagram", value: "instagram" },
  { label: "Google Organic", value: "google" },
  { label: "Direct", value: "direct" },
  { label: "Assessment Wizard", value: "ASSESSMENT_WIZARD" },
  { label: "Contact Form", value: "CONTACT_FORM" },
];

export function LeadsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentStatus = searchParams.get("status") || "ALL";
  const currentSource = searchParams.get("source") || "ALL";

  const [searchTerm, setSearchTerm] = React.useState(currentSearch);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Reset to first page on filter change
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters("search", searchTerm);
  };

  const handleReset = () => {
    setSearchTerm("");
    router.push(pathname);
  };

  return (
    <div className="bg-paper p-4 sm:p-5 rounded-2xl border border-ink/10 space-y-3 font-body shadow-subtle">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone, email, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-ivory border border-ink/15 text-xs text-ink placeholder:text-ink/40 focus:outline-none focus:border-olive-deep focus:ring-1 focus:ring-olive-deep transition-all shadow-sm"
          />
        </form>

        {/* Status Dropdown */}
        <div className="md:col-span-3">
          <select
            value={currentStatus}
            onChange={(e) => updateFilters("status", e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-ivory border border-ink/15 text-xs text-ink focus:outline-none focus:border-olive-deep focus:ring-1 focus:ring-olive-deep transition-all shadow-sm cursor-pointer"
          >
            {ALL_STATUSES.map((s) => (
              <option key={s.value} value={s.value} className="bg-paper text-ink">
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Source Dropdown */}
        <div className="md:col-span-3 flex items-center gap-2">
          <select
            value={currentSource}
            onChange={(e) => updateFilters("source", e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-ivory border border-ink/15 text-xs text-ink focus:outline-none focus:border-olive-deep focus:ring-1 focus:ring-olive-deep transition-all shadow-sm cursor-pointer"
          >
            {CHANNELS.map((c) => (
              <option key={c.value} value={c.value} className="bg-paper text-ink">
                {c.label}
              </option>
            ))}
          </select>

          {(currentSearch || currentStatus !== "ALL" || currentSource !== "ALL") && (
            <button
              onClick={handleReset}
              className="h-10 px-3 rounded-xl bg-ivory border border-ink/15 text-ink-soft hover:text-ink hover:bg-paper transition-colors text-xs flex items-center space-x-1 flex-shrink-0 cursor-pointer"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
