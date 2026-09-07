"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Appointment, AppointmentStatus } from "@/types/crm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Phone,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  Loader2,
} from "lucide-react";

interface AppointmentManagerProps {
  leadId: string;
  appointments: Appointment[];
}

export function AppointmentManager({ leadId, appointments: initialAppts }: AppointmentManagerProps) {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppts);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStatusChange = async (appointmentId: string, newStatus: AppointmentStatus) => {
    setUpdatingId(appointmentId);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/admin/appointments/${appointmentId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update appointment status");
      }

      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? { ...a, status: newStatus } : a))
      );
      router.refresh();
    } catch (err: unknown) {
      console.error("Failed to update appointment:", err);
      const msg = err instanceof Error ? err.message : "Update failed";
      setErrorMessage(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px]">Confirmed</Badge>;
      case "COMPLETED":
        return <Badge className="bg-blue-50 text-blue-800 border border-blue-200 font-mono text-[10px]">Completed</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-50 text-red-700 border border-red-200 font-mono text-[10px]">Cancelled</Badge>;
      case "NO_SHOW":
        return <Badge className="bg-amber-50 text-amber-800 border border-amber-200 font-mono text-[10px]">No Show</Badge>;
      case "REQUESTED":
      default:
        return <Badge className="bg-olive/15 text-olive-deep border border-olive/30 font-mono text-[10px]">Requested</Badge>;
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-paper border border-ink/10 space-y-5 shadow-subtle">
      <div className="flex items-center justify-between pb-3 border-b border-ink/10">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-olive/10 text-olive-deep border border-olive/20">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-display font-medium text-ink">
              Consultation Appointments
            </h3>
            <p className="text-xs text-ink-soft">
              1-on-1 Clinical evaluation sessions scheduled with Dr. Lubna Fatima
            </p>
          </div>
        </div>
        <span className="text-xs text-ink-soft font-mono">
          {appointments.length} Total
        </span>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="py-6 text-center text-ink-soft/70 border border-dashed border-ink/15 rounded-xl">
          <p className="text-xs">No consultation appointments booked yet for this lead.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => {
            const isUpdating = updatingId === appt.id;
            const formattedDate = new Date(appt.startTime).toLocaleDateString("en-IN", {
              timeZone: "Asia/Kolkata",
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            const formattedTime = new Date(appt.startTime).toLocaleTimeString("en-IN", {
              timeZone: "Asia/Kolkata",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={appt.id}
                className="p-4 rounded-xl bg-ivory border border-ink/10 space-y-3 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-olive-deep" />
                    <span className="text-sm font-semibold text-ink font-mono">
                      {formattedDate} at {formattedTime} IST
                    </span>
                  </div>
                  <div>{getStatusBadge(appt.status)}</div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2 border-t border-ink/10 text-ink-soft">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 font-medium text-ink">
                      {appt.meetingType === "VIDEO_CALL" ? (
                        <Video className="w-3.5 h-3.5 text-olive-deep" />
                      ) : (
                        <Phone className="w-3.5 h-3.5 text-olive-deep" />
                      )}
                      {appt.meetingType === "VIDEO_CALL" ? "Google Meet" : "Direct Phone Call"}
                    </span>

                    {appt.meetingLink && appt.meetingType === "VIDEO_CALL" && (
                      <a
                        href={appt.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-olive-deep hover:underline flex items-center gap-1 font-semibold"
                      >
                        Join Meeting <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Admin Quick Status Actions */}
                  <div className="flex items-center gap-1.5 pt-1 sm:pt-0">
                    {appt.status === "REQUESTED" && (
                      <Button
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(appt.id, "CONFIRMED")}
                        className="bg-ink text-paper hover:bg-ink-soft font-semibold rounded-full text-[11px] h-7 px-3 shadow-subtle cursor-pointer"
                      >
                        {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : "Confirm"}
                      </Button>
                    )}

                    {appt.status !== "COMPLETED" && appt.status !== "CANCELLED" && (
                      <Button
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(appt.id, "COMPLETED")}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-[11px] h-7 px-3 font-medium cursor-pointer"
                      >
                        Mark Completed
                      </Button>
                    )}

                    {appt.status !== "CANCELLED" && appt.status !== "COMPLETED" && (
                      <Button
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(appt.id, "CANCELLED")}
                        className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-full text-[11px] h-7 px-3 font-medium cursor-pointer"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>

                {appt.notes && (
                  <p className="text-xs text-ink-soft italic pt-1">
                    Client Notes: &ldquo;{appt.notes}&rdquo;
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
