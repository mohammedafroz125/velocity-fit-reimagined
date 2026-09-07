import React, { Suspense } from "react";
import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { BookingForm } from "@/components/forms/booking-form";
import { LoadingState } from "@/components/common/loading-state";

export const metadata: Metadata = generateSeoMetadata({
  title: "Book Clinical Consultation | Velocity Fit & Dr. Lubna Fatima",
  description:
    "Schedule your 1-on-1 personalized clinical nutrition and metabolic consultation with Dr. Lubna Fatima. Convenient IST slots available via Google Meet or Phone.",
  path: "/book-consultation",
});

export default function BookConsultationPage() {
  return (
    <div className="flex flex-col w-full bg-ivory text-ink">
      {/* 1. Header Banner */}
      <section className="py-16 border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 space-y-4">
          <Breadcrumbs items={[{ label: "Book Consultation" }]} />
          <div className="space-y-3 max-w-3xl">
            <p className="eyebrow">Direct Appointment Scheduling</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink leading-tight">
              Schedule Your Clinical Consultation
            </h1>
            <p className="text-lg text-ink-soft leading-relaxed">
              Reserve your 30-minute 1-on-1 session with Dr. Lubna Fatima. We will review your metabolic profile, medical history, and architect a customized nutrition roadmap.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Booking Experience */}
      <section className="bg-paper py-16 lg:py-24 border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <Suspense fallback={<LoadingState message="Loading consultation calendar..." />}>
            <BookingForm />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
