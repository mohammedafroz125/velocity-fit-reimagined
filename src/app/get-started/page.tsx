import { Metadata } from "next";
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
