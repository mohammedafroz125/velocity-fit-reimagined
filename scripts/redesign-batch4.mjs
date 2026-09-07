import fs from 'fs';
import path from 'path';

const root = process.cwd();

// 1. Empty State
const emptyState = `import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
}

export function EmptyState({
  title,
  description,
  actionText = "Explore Programs",
  actionHref = "/programs",
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4 max-w-md mx-auto space-y-4">
      <div className="size-12 rounded-full bg-olive/10 text-olive-deep flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="font-display text-2xl font-medium text-ink">{title}</h3>
      <p className="text-sm text-ink-soft leading-relaxed">{description}</p>
      {actionText && (
        <div className="pt-2">
          <Button asChild size="sm">
            <Link href={actionHref}>{actionText}</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
`;

// 2. Loading State
const loadingState = `import { Loader2 } from "lucide-react";

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-ink-soft">
      <Loader2 className="w-7 h-7 animate-spin text-olive-deep" />
      <span className="font-mono text-xs uppercase tracking-wider">{message}</span>
    </div>
  );
}
`;

// 3. Not Found (404)
const notFoundPage = `import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-ivory px-5 text-ink">
      <div className="max-w-md text-center space-y-5">
        <span className="font-display text-8xl font-semibold text-olive-deep/30">404</span>
        <h1 className="font-display text-3xl font-medium text-ink">Page Not Found</h1>
        <p className="text-sm text-ink-soft leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="pt-4">
          <Button asChild size="lg">
            <Link href="/">Return to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
`;

// 4. Get Started Page
const getStartedPage = `import { Metadata } from "next";
import { Suspense } from "react";
import { generateSeoMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { AssessmentWizard } from "@/components/forms/assessment-wizard";
import { LoadingState } from "@/components/common/loading-state";
import { Lock, Stethoscope, ShieldCheck } from "lucide-react";

export const metadata: Metadata = generateSeoMetadata({
  title: "Pre-Signup Health Assessment — Get Started",
  description:
    "Complete the 5-minute VelocityFit clinical health assessment and V6 Audit™ to personalize your metabolic transformation roadmap with Dr. Lubna Fatima.",
  path: "/get-started",
});

async function AssessmentContainer({
  searchParams,
}: {
  searchParams: Promise<{ goal?: string; program?: string }>;
}) {
  const { goal } = await searchParams;
  return <AssessmentWizard initialGoal={goal} />;
}

export default function GetStartedPage({
  searchParams,
}: {
  searchParams: Promise<{ goal?: string; program?: string }>;
}) {
  return (
    <div className="flex flex-col w-full min-h-screen bg-ivory text-ink">
      {/* 1. Header Banner */}
      <section className="py-16 border-b border-ink/10">
        <div className="max-w-4xl mx-auto px-5 lg:px-10 space-y-4 text-center">
          <div className="flex justify-center">
            <Breadcrumbs items={[{ label: "Pre-Signup Assessment" }]} />
          </div>
          <div className="space-y-3">
            <p className="eyebrow">V6 Audit™ Foundation</p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink">
              Pre-Signup Health Assessment
            </h1>
            <p className="text-base text-ink-soft max-w-xl mx-auto leading-relaxed">
              Take 5 minutes to share your baseline health markers so Dr. Lubna Fatima can evaluate your case and architect your personalized clinical protocol.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-ink-soft/80">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-olive-deep" />
              <span>100% Confidential Medical Intake</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-olive-deep" />
              <span>Direct Review by Dr. Fatima</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-olive-deep" />
              <span>No Obligation Required</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Wizard */}
      <section className="py-12 md:py-16 px-5 lg:px-10">
        <Suspense fallback={<LoadingState message="Loading health assessment..." />}>
          <AssessmentContainer searchParams={searchParams} />
        </Suspense>
      </section>
    </div>
  );
}
`;

// 5. Book Consultation Page
const bookConsultationPage = `import React, { Suspense } from "react";
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
`;

// 6. Checkout Page
const checkoutPage = `import React, { Suspense } from "react";
import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { CheckoutFlow } from "@/components/forms/checkout-flow";
import { LoadingState } from "@/components/common/loading-state";

export const metadata: Metadata = generateSeoMetadata({
  title: "Enroll in Velocity Fit Program | Secure Checkout",
  description:
    "Secure enrollment checkout for Velocity Flex & Grit nutrition programs by Dr. Lubna Fatima. Verified transparent pricing, encrypted gateway.",
  path: "/checkout",
});

export default function CheckoutPage() {
  return (
    <div className="flex flex-col w-full bg-ivory text-ink">
      {/* 1. Header Banner */}
      <section className="py-16 border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 space-y-4">
          <Breadcrumbs items={[{ label: "Programs", href: "/programs" }, { label: "Checkout" }]} />
          <div className="space-y-3 max-w-3xl">
            <p className="eyebrow">Encrypted Direct Enrollment</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink leading-tight">
              Complete Your Program Enrollment
            </h1>
            <p className="text-lg text-ink-soft leading-relaxed">
              Select your preferred program track and support tier. Secure checkout with instant doctor onboarding on WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Checkout Experience */}
      <section className="bg-paper py-16 lg:py-24 border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <Suspense fallback={<LoadingState message="Loading secure checkout..." />}>
            <CheckoutFlow />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
`;

fs.writeFileSync(path.join(root, 'src/components/common/empty-state.tsx'), emptyState, 'utf8');
fs.writeFileSync(path.join(root, 'src/components/common/loading-state.tsx'), loadingState, 'utf8');
fs.writeFileSync(path.join(root, 'src/app/not-found.tsx'), notFoundPage, 'utf8');
fs.writeFileSync(path.join(root, 'src/app/get-started/page.tsx'), getStartedPage, 'utf8');
fs.writeFileSync(path.join(root, 'src/app/book-consultation/page.tsx'), bookConsultationPage, 'utf8');
fs.writeFileSync(path.join(root, 'src/app/checkout/page.tsx'), checkoutPage, 'utf8');

console.log('Batch 4A (Pages & States) written successfully!');
