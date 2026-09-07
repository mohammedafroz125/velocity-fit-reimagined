"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LeadStatus } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

const PIPELINE_STATUSES: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "FOLLOW_UP",
  "CONSULTATION_BOOKED",
  "CONSULTATION_COMPLETED",
  "PAYMENT_PENDING",
  "CONVERTED",
  "ACTIVE_CUSTOMER",
  "NOT_INTERESTED",
  "LOST",
];

export function LeadStatusManager({
  leadId,
  currentStatus,
}: {
  leadId: string;
  currentStatus: LeadStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = React.useState<LeadStatus>(currentStatus);
  const [reason, setReason] = React.useState("");
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const handleUpdate = async () => {
    if (status === currentStatus) return;

    setIsUpdating(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/leads/${leadId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reason: reason.trim() || undefined }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update status");
      }

      setMessage("Status updated successfully");
      setReason("");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error updating status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-paper border border-ink/10 space-y-4 shadow-subtle">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-ink font-semibold">
          Lead Status Pipeline
        </span>
        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-olive/15 text-olive-deep border border-olive/30 font-mono uppercase font-semibold">
          Current: {currentStatus.replace(/_/g, " ")}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-[11px] text-ink-soft font-medium mb-1.5">
            Transition Status To:
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as LeadStatus)}
            className="w-full h-10 px-3 rounded-xl bg-ivory border border-ink/15 text-xs text-ink focus:outline-none focus:border-olive-deep focus:ring-1 focus:ring-olive-deep transition-all shadow-sm cursor-pointer"
          >
            {PIPELINE_STATUSES.map((s) => (
              <option key={s} value={s} className="bg-paper text-ink">
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        {status !== currentStatus && (
          <div className="space-y-3 pt-1">
            <input
              type="text"
              placeholder="Reason for change (e.g. Completed initial phone call, Booked Saturday 4pm)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-ivory border border-ink/15 text-xs text-ink placeholder:text-ink/40 focus:outline-none focus:border-olive-deep focus:ring-1 focus:ring-olive-deep transition-all shadow-sm"
            />
            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="bg-ink text-paper hover:bg-ink-soft font-semibold rounded-full text-xs h-11 w-full shadow-subtle cursor-pointer"
            >
              {isUpdating ? "Saving..." : `Confirm Status Change to ${status.replace(/_/g, " ")}`}
            </Button>
          </div>
        )}

        {message && (
          <p className="text-xs text-emerald-700 flex items-center space-x-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{message}</span>
          </p>
        )}
      </div>
    </div>
  );
}
