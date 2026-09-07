"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getStoredAttribution } from "@/lib/attribution";
import { trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/data/site-config";
import { CheckCircle2, MessageSquareQuote, ArrowRight } from "lucide-react";

export function ContactForm() {
  const [formData, setFormData] = React.useState({
    fullName: "",
    phone: "",
    email: "",
    primaryGoal: "",
    preferredContactMethod: "WhatsApp",
    message: "",
    website_honey: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [serverError, setServerError] = React.useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = "Full Name is required";
    if (!formData.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!/^\+?[0-9]{10,14}$/.test(formData.phone.replace(/[\s-]/g, ""))) {
      errs.phone = "Please enter a valid 10-digit phone number";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    const attribution = getStoredAttribution();

    try {
      const res = await fetch("/api/leads/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email || undefined,
          primaryGoal: formData.primaryGoal || undefined,
          message: formData.message || undefined,
          website_honey: formData.website_honey || undefined,
          attribution,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to record inquiry");
      }

      trackEvent("contact_form_success", { goal: formData.primaryGoal });
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err: unknown) {
      setIsSubmitting(false);
      setServerError(
        err instanceof Error ? err.message : "Unable to submit inquiry at this moment."
      );
    }
  };

  if (isSuccess) {
    return (
      <div className="py-10 text-center space-y-6">
        <div className="size-16 rounded-full bg-olive/10 text-olive-deep flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="font-display text-3xl font-medium text-ink">Inquiry Received</h3>
          <p className="text-sm text-ink-soft max-w-md mx-auto leading-relaxed">
            Thank you, <strong>{formData.fullName}</strong>. Dr. Lubna Fatima&apos;s team will connect with you via {formData.preferredContactMethod} shortly.
          </p>
        </div>
        <Button asChild size="lg" className="shadow-subtle">
          <a
            href={`https://wa.me/${siteConfig.contact.whatsappRaw}?text=${encodeURIComponent(
              `Hello Dr. Lubna, I just submitted an inquiry on the Velocity Fit website for ${formData.fullName} regarding ${formData.primaryGoal || "transformation programs"}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>Connect Immediately on WhatsApp</span>
          </a>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Invisible Anti-Spam Honeypot */}
      <input
        type="text"
        name="website_honey"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={formData.website_honey}
        onChange={(e) => setFormData({ ...formData, website_honey: e.target.value })}
        className="opacity-0 absolute -z-10 select-none pointer-events-none w-0 h-0 overflow-hidden"
      />

      <div className="space-y-2">
        <p className="eyebrow">Send a Direct Message</p>
        <h3 className="font-display text-2xl sm:text-3xl font-medium text-ink">
          Schedule Consultation or Ask a Question
        </h3>
      </div>

      {serverError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name *"
          placeholder="e.g. Priya Sharma"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          error={errors.fullName}
        />
        <Input
          label="Mobile Phone / WhatsApp *"
          placeholder="+91 98765 43210"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          error={errors.phone}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Email Address (Optional)"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />
        <Select
          label="Primary Health Goal"
          value={formData.primaryGoal}
          onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
          options={[
            { label: "Select primary goal...", value: "" },
            { label: "Weight loss / Fat loss", value: "Weight loss" },
            { label: "PCOS / Hormonal balance", value: "PCOS" },
            { label: "Metabolic reset & Blood sugar", value: "Metabolic health" },
            { label: "General Nutrition Guidance", value: "Nutrition" },
            { label: "Other / Direct Consultation", value: "Other" },
          ]}
        />
      </div>

      <Textarea
        label="Message or Current Health Challenges (Optional)"
        placeholder="Share a brief overview of your current weight, health conditions, or questions for Dr. Fatima..."
        rows={4}
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
      />

      <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
        {isSubmitting ? "Sending Inquiry..." : "Submit Inquiry to Dr. Fatima"}
      </Button>

      <p className="text-[11px] text-center text-ink-soft/70">
        Your information is protected under physician-led clinical confidentiality.
      </p>
    </form>
  );
}
