"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { AvailabilitySlot } from "@/types/booking";
import { siteConfig } from "@/data/site-config";
import { cn } from "@/lib/utils";

interface BookingFormProps {
  initialLeadId?: string;
  initialName?: string;
  initialPhone?: string;
  initialEmail?: string;
}

export function BookingForm({
  initialLeadId,
  initialName,
  initialPhone,
  initialEmail,
}: BookingFormProps) {
  const searchParams = useSearchParams();

  const leadId = searchParams.get("leadId") || initialLeadId || "";
  const paramName = searchParams.get("name") || initialName || "";
  const paramPhone = searchParams.get("phone") || initialPhone || "";
  const paramEmail = searchParams.get("email") || initialEmail || "";

  const [dates, setDates] = useState<{ dateStr: string; label: string; dayName: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const [fullName, setFullName] = useState(paramName);
  const [phone, setPhone] = useState(paramPhone);
  const [email, setEmail] = useState(paramEmail);
  const [meetingType, setMeetingType] = useState<"VIDEO_CALL" | "PHONE_CALL">("VIDEO_CALL");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<{
    id: string;
    startTime: string;
    meetingType: string;
    meetingLink?: string | null;
  } | null>(null);

  useEffect(() => {
    const list: { dateStr: string; label: string; dayName: string }[] = [];
    const today = new Date();
    let current = new Date(today);
    current.setDate(current.getDate() + 1);

    while (list.length < 12) {
      if (current.getDay() !== 0) {
        const dateStr = current.toISOString().split("T")[0];
        const dayName = current.toLocaleDateString("en-IN", { weekday: "short" });
        const label = current.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        });
        list.push({ dateStr, label, dayName });
      }
      current.setDate(current.getDate() + 1);
    }

    setDates(list);
    if (list.length > 0) {
      setSelectedDate(list[0].dateStr);
    }
  }, []);

  useEffect(() => {
    if (!selectedDate) return;

    let isMounted = true;
    setIsLoadingSlots(true);
    setSelectedSlot(null);
    setErrorMessage(null);

    fetch(`/api/booking/availability?date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && Array.isArray(data.slots)) {
          setSlots(data.slots);
        } else {
          setSlots([]);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Failed to load slots:", err);
        setSlots([]);
      })
      .finally(() => {
        if (isMounted) setIsLoadingSlots(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDate]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedSlot) {
      setErrorMessage("Please select an available consultation slot.");
      return;
    }
    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!phone.trim()) {
      setErrorMessage("Please enter your phone number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: leadId || undefined,
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          meetingType,
          notes: notes.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to schedule appointment.");
      }

      setBookingSuccess(json.appointment);
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong while booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingSuccess) {
    const formattedDate = new Date(bookingSuccess.startTime).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = new Date(bookingSuccess.startTime).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div className="p-8 sm:p-12 rounded-[2rem] bg-paper border border-ink/10 shadow-elevated text-center space-y-6 max-w-2xl mx-auto">
        <div className="size-16 rounded-full bg-olive/10 text-olive-deep flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <p className="eyebrow">Consultation Scheduled</p>
          <h2 className="font-display text-3xl font-medium text-ink">
            Appointment Confirmed!
          </h2>
          <p className="text-sm text-ink-soft max-w-md mx-auto leading-relaxed">
            Your 1-on-1 clinical session with Dr. Lubna Fatima has been reserved.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-ivory border border-ink/10 space-y-3 text-left">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono uppercase tracking-wider text-olive-deep font-semibold">Date & Time</span>
            <span className="font-bold text-ink">{formattedDate} at {formattedTime} (IST)</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono uppercase tracking-wider text-olive-deep font-semibold">Format</span>
            <span className="font-bold text-ink">{bookingSuccess.meetingType === "VIDEO_CALL" ? "Google Meet Video" : "Direct Phone Call"}</span>
          </div>
        </div>

        <div className="pt-2">
          <Button asChild size="lg" fullWidth>
            <a
              href={`https://wa.me/${siteConfig.contact.whatsappRaw}?text=${encodeURIComponent(
                `Hello Dr. Lubna, I just booked a consultation for ${fullName} on ${formattedDate} at ${formattedTime}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Confirm with Dr. Fatima on WhatsApp</span>
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleBookingSubmit} className="max-w-4xl mx-auto space-y-8">
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Date & Slot Picker */}
      <div className="p-8 rounded-[2rem] bg-paper border border-ink/10 shadow-elevated space-y-6">
        <div className="space-y-1">
          <p className="eyebrow">Step 01</p>
          <h3 className="font-display text-2xl font-medium text-ink">
            Select Date & Available Slot
          </h3>
          <p className="text-xs text-ink-soft">
            Indian Standard Time (IST) · Monday to Saturday
          </p>
        </div>

        {/* Date Tabs */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {dates.map((d) => {
            const isSelected = selectedDate === d.dateStr;
            return (
              <button
                key={d.dateStr}
                type="button"
                onClick={() => setSelectedDate(d.dateStr)}
                className={cn(
                  "p-3.5 rounded-2xl border text-center min-w-[85px] transition-all flex flex-col items-center",
                  isSelected
                    ? "bg-ink text-paper border-ink shadow-sm"
                    : "bg-ivory text-ink-soft border-ink/10 hover:border-ink/30"
                )}
              >
                <span className="font-mono text-[10px] uppercase">{d.dayName}</span>
                <span className="font-display text-base font-medium mt-0.5">{d.label}</span>
              </button>
            );
          })}
        </div>

        {/* Available Time Slots Grid */}
        <div className="space-y-2 pt-2">
          <span className="block font-mono text-[10px] uppercase tracking-wider text-ink-soft font-semibold">
            Available 30-Minute Slots:
          </span>
          {isLoadingSlots ? (
            <div className="py-8 text-center text-xs text-ink-soft flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-olive-deep" />
              <span>Loading slots for selected date...</span>
            </div>
          ) : slots.length === 0 ? (
            <p className="text-xs text-ink-soft py-4 italic">
              No open slots remaining on this date. Please choose another date or connect on WhatsApp.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {slots.map((s) => {
                const isSelected = selectedSlot?.startTime === s.startTime;
                return (
                  <button
                    key={s.startTime}
                    type="button"
                    disabled={!s.available}
                    onClick={() => setSelectedSlot(s)}
                    className={cn(
                      "p-3 rounded-xl border text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5",
                      !s.available
                        ? "bg-mist/30 text-ink-soft/40 border-ink/5 cursor-not-allowed line-through"
                        : isSelected
                        ? "bg-olive text-paper border-olive shadow-sm"
                        : "bg-ivory text-ink border-ink/10 hover:border-olive/50"
                    )}
                  >
                    <Clock className="w-3 h-3" />
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Patient Profile & Format */}
      <div className="p-8 rounded-[2rem] bg-paper border border-ink/10 shadow-elevated space-y-6">
        <div className="space-y-1">
          <p className="eyebrow">Step 02</p>
          <h3 className="font-display text-2xl font-medium text-ink">
            Your Information & Format
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name *"
            placeholder="e.g. Priya Sharma"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input
            label="Phone Number (WhatsApp) *"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Meeting Format Toggle */}
          <div className="space-y-1.5">
            <span className="block font-mono text-xs uppercase tracking-wider text-ink-soft">
              Consultation Format *
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMeetingType("VIDEO_CALL")}
                className={cn(
                  "p-3 rounded-2xl border text-xs font-medium transition-all flex items-center justify-center gap-1.5",
                  meetingType === "VIDEO_CALL"
                    ? "bg-ink text-paper border-ink"
                    : "bg-ivory text-ink-soft border-ink/10 hover:border-ink/30"
                )}
              >
                <Video className="w-3.5 h-3.5 text-champagne" />
                <span>Google Meet</span>
              </button>
              <button
                type="button"
                onClick={() => setMeetingType("PHONE_CALL")}
                className={cn(
                  "p-3 rounded-2xl border text-xs font-medium transition-all flex items-center justify-center gap-1.5",
                  meetingType === "PHONE_CALL"
                    ? "bg-ink text-paper border-ink"
                    : "bg-ivory text-ink-soft border-ink/10 hover:border-ink/30"
                )}
              >
                <Phone className="w-3.5 h-3.5 text-champagne" />
                <span>Direct Phone</span>
              </button>
            </div>
          </div>
        </div>

        <Textarea
          label="Health Background / Topics to Discuss (Optional)"
          placeholder="Briefly state your main goals (weight loss, PCOS, thyroid, blood sugar) or previous challenges..."
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Button type="submit" size="lg" fullWidth disabled={isSubmitting} className="flex items-center justify-center gap-2">
          <span>{isSubmitting ? "Confirming Slot..." : "Confirm & Book Consultation"}</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
