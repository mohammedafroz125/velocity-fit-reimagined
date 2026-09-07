import { Metadata } from "next";
import Link from "next/link";
import { programsData } from "@/data/programs";
import { generateSeoMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { ProgramCard } from "@/components/cards/program-card";
import { CTASection } from "@/components/common/cta-section";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, Zap } from "lucide-react";

export const metadata: Metadata = generateSeoMetadata({
  title: "Transformation Programs & Pricing",
  description:
    "Explore Velocity Fit's clinical transformation tracks: Flex Transformation and Grit Transformation, with Prime and Elite accountability tiers led by Dr. Lubna Fatima.",
  path: "/programs",
});

export default function ProgramsPage() {
  return (
    <div className="flex flex-col w-full bg-ivory text-ink">
      {/* 1. Header Banner */}
      <section className="py-16 lg:py-24 border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 space-y-4">
          <Breadcrumbs items={[{ label: "Programs" }]} />
          <div className="space-y-4 max-w-3xl">
            <p className="eyebrow">VELOCITYFIT TRANSFORMATION</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink leading-tight">
              Evidence-Based Transformation Programs
            </h1>
            <p className="text-lg text-ink-soft leading-relaxed">
              Transparent, doctor-guided clinical nutrition tracks. Select the protocol and support tier that matches your metabolic health and lifestyle.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Program Cards Grid */}
      <section className="bg-paper py-20 lg:py-28 border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 space-y-16">
          <div className="max-w-3xl space-y-3">
            <p className="eyebrow">Track Selection</p>
            <h2 className="section-title">Choose Your Transformation Track</h2>
            <p className="section-copy">
              Both tracks operate under The VelocityFit Formula and V6 Audit™. Toggle between Prime and Elite support tiers, or select your commitment duration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {programsData.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>

          {/* Decision Matrix */}
          <div className="p-8 sm:p-12 rounded-[2rem] bg-ivory border border-ink/10 space-y-8 max-w-5xl mx-auto">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h3 className="font-display text-3xl font-medium text-ink">
                How to Choose Between Flex and Grit
              </h3>
              <p className="text-sm text-ink-soft">
                Our tracks are calibrated for different levels of metabolic resistance and lifestyle flexibility.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-7 rounded-3xl bg-paper border border-ink/10 space-y-4">
                <span className="font-mono text-xs uppercase tracking-widest text-olive-deep font-semibold">
                  FLEX TRACK
                </span>
                <h4 className="font-display text-2xl font-medium text-ink">Lifestyle & Food Freedom</h4>
                <p className="text-sm text-ink-soft leading-relaxed">
                  Best for working professionals, parents, and frequent travelers. Teaches metabolic flexibility and portion control without eliminating social meals.
                </p>
                <ul className="space-y-2 text-xs text-ink-soft pt-2">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-olive" /> Mild to moderate weight loss (5kg – 15kg)</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-olive" /> Rebound weight prevention</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-olive" /> Dining out and travel frameworks</li>
                </ul>
              </div>

              <div className="p-7 rounded-3xl bg-paper border border-ink/10 space-y-4">
                <span className="font-mono text-xs uppercase tracking-widest text-olive-deep font-semibold">
                  GRIT TRACK
                </span>
                <h4 className="font-display text-2xl font-medium text-ink">Clinical & Metabolic Reset</h4>
                <p className="text-sm text-ink-soft leading-relaxed">
                  Best for stubborn fat loss and diagnosed clinical cases including PCOS, Thyroid, Pre-Diabetes, and Fatty Liver requiring high-touch accountability.
                </p>
                <ul className="space-y-2 text-xs text-ink-soft pt-2">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-olive" /> Significant weight loss (&gt;15kg)</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-olive" /> Hormonal regulation & insulin resistance</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-olive" /> Daily food log tracking & physician review</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. High-Conversion CTA */}
      <CTASection
        eyebrow="Ready to begin?"
        title="Start your transformation journey today."
        description="Choose your program or take our pre-signup assessment to receive clinical guidance."
      />
    </div>
  );
}
