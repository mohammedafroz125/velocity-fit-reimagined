import { Metadata } from "next";
import Link from "next/link";
import { generateSeoMetadata } from "@/lib/seo";
import { siteConfig } from "@/data/site-config";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { CTASection } from "@/components/common/cta-section";
import { Button } from "@/components/ui/button";
import { ShieldCheck, MessageSquareQuote, Lock, FileCheck2, ArrowRight } from "lucide-react";

export const metadata: Metadata = generateSeoMetadata({
  title: "Client Transformations & Case Studies",
  description:
    "Information regarding Velocity Fit patient transformation case studies supervised by Dr. Lubna Fatima in Hyderabad.",
  path: "/results",
});

export default function ResultsPage() {
  const structuredCaseTracks = [
    {
      id: "case-track-01",
      title: "Metabolic Fat Loss & Inch Reduction",
      track: "Flex Track",
      protocolType: "Cellular Hydration & Meal Rebalancing Protocol",
      clinicalFocus: "Visceral fat reduction and evening craving elimination without eliminating home-cooked staples.",
      status: "Verified Consent · Dr. Lubna Supervision",
    },
    {
      id: "case-track-02",
      title: "PCOS & Hormonal Equilibrium",
      track: "Grit Track",
      protocolType: "Insulin Sensitivity & Androgen Balance Nutrition",
      clinicalFocus: "Menstrual cycle regularity, stubborn weight reversal, and sustained daytime energy.",
      status: "Verified Consent · Dr. Lubna Supervision",
    },
    {
      id: "case-track-03",
      title: "Metabolic Reset & Blood Sugar Support",
      track: "Grit Track",
      protocolType: "Circadian Nutrition & Glycemic Management",
      clinicalFocus: "HbA1c optimization and long-term metabolic health preservation through home foods.",
      status: "Verified Consent · Dr. Lubna Supervision",
    },
  ];

  return (
    <div className="flex flex-col w-full bg-ivory text-ink">
      {/* 1. Header Banner */}
      <section className="py-16 lg:py-24 border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 space-y-4">
          <Breadcrumbs items={[{ label: "Results & Stories" }]} />
          <div className="space-y-4 max-w-3xl">
            <p className="eyebrow">Clinical Evidence & Transparency</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink leading-tight">
              Client Transformations
            </h1>
            <p className="text-lg text-ink-soft leading-relaxed">
              Real stories of obesity reversal, PCOS management, and permanent habit engineering under Dr. Lubna Fatima.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Editorial Image Spotlight */}
      <section className="bg-paper py-20 lg:py-28 border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <p className="eyebrow">The Transformation Standard</p>
              <h2 className="font-display text-3xl sm:text-4xl font-medium text-ink">
                Progress Deserves to be Treated with Dignity
              </h2>
              <p className="text-base text-ink-soft leading-relaxed">
                At Velocity Fit, we do not exploit sensationalist or edited before/after images. Medical transformations require clinical integrity, patient confidentiality, and documented habit shifts.
              </p>
              <p className="text-base text-ink-soft leading-relaxed">
                Every client outcome published by Velocity Fit undergoes explicit signed consent and physician review to accurately reflect real metabolic health.
              </p>
              <div className="p-6 rounded-2xl bg-ivory border border-ink/10 space-y-2">
                <div className="flex items-center gap-2 text-olive-deep font-semibold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Clinical Case Study Policy</span>
                </div>
                <p className="text-xs text-ink-soft leading-relaxed">
                  {siteConfig.placeholders.patientCaseStudies}
                </p>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative overflow-hidden rounded-[2rem] border border-ink/10 shadow-elevated">
                <img
                  src="/assets/social-walk.jpg"
                  alt="Healthy, sustainable lifestyle transformation"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-ink/85 p-6 text-ivory backdrop-blur-md">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-champagne">
                    Real Lifestyle Shifts
                  </p>
                  <p className="font-display text-xl font-medium mt-1">
                    Sustainable health over temporary quick fixes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Focus Tracks */}
          <div className="space-y-6">
            <h3 className="font-display text-3xl font-medium text-ink">
              Clinical Areas of Transformation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {structuredCaseTracks.map((item) => (
                <div key={item.id} className="p-8 rounded-3xl bg-ivory border border-ink/10 space-y-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-olive-deep font-semibold">
                    {item.track}
                  </span>
                  <h4 className="font-display text-2xl font-medium text-ink">
                    {item.title}
                  </h4>
                  <p className="text-sm text-ink-soft leading-relaxed">
                    {item.clinicalFocus}
                  </p>
                  <div className="pt-3 border-t border-ink/10 flex items-center gap-2 text-xs text-olive-deep font-medium">
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. CTA */}
      <CTASection
        eyebrow="Your journey begins here"
        title="Ready to write your own transformation story?"
        description="Schedule an initial clinical consultation or begin with our confidential 5-minute health assessment."
      />
    </div>
  );
}
