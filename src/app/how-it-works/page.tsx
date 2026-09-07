import { Metadata } from "next";
import Link from "next/link";
import { generateSeoMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { CTASection } from "@/components/common/cta-section";
import { Button } from "@/components/ui/button";
import { ArrowRight, Droplets, Moon, Activity, Dna, Brain, Flame, Check } from "lucide-react";

export const metadata: Metadata = generateSeoMetadata({
  title: "The VelocityFit Formula — How It Works",
  description:
    "Understand the 4-stage VelocityFit methodology (Discover, Personalize, Transform, Sustain) and the V6 Audit™ Foundation developed by Dr. Lubna Fatima.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  const formulaStages = [
    {
      stage: "01",
      name: "Discover",
      badge: "The V6 Audit™",
      title: "Identifying Your True Metabolic Baseline",
      description: "Before prescribing any meal adjustments, we conduct the comprehensive V6 Audit™. We evaluate your daily water intake, sleep architecture, hormonal markers, gut motility, emotional eating triggers, and previous diet histories.",
      deliverables: ["6-Pillar Health Evaluation", "Metabolic Rate Baseline", "Hormonal & Lifestyle Assessment"],
    },
    {
      stage: "02",
      name: "Personalize",
      badge: "Protocol Engineering",
      title: "Customized Medical Nutrition Strategy",
      description: "Dr. Lubna Fatima designs a bespoke nutrition blueprint that integrates directly into your daily routine. We structure macronutrient timing around your family meals, work schedule, cultural foods, and dining out preferences.",
      deliverables: ["Custom Meal Architecture", "Dining Out & Travel Guidelines", "Targeted Hydration & Micronutrient Strategy"],
    },
    {
      stage: "03",
      name: "Transform",
      badge: "Active Mentorship",
      title: "Clinical Guidance & Continuous Accountability",
      description: "You execute the plan with weekly clinical check-ins, macro fine-tuning, and direct WhatsApp support. We adjust nutrients dynamically to prevent weight loss plateaus and safeguard your metabolic speed.",
      deliverables: ["Weekly Progress & Metric Reviews", "Dynamic Macro Adjustments", "Direct WhatsApp Support (Prime/Elite)"],
    },
    {
      stage: "04",
      name: "Sustain",
      badge: "Habit Architecture",
      title: "Permanent Autonomy & Freedom",
      description: "The final phase cements long-term metabolic flexibility. You transition from active weight loss into effortless maintenance, equipped with the knowledge to manage festive seasons, holidays, and social occasions with confidence.",
      deliverables: ["Maintenance Calorie Calibration", "Reverse Dieting Protocol", "Lifelong Metabolic Autonomy"],
    },
  ];

  return (
    <div className="flex flex-col w-full bg-ivory text-ink">
      {/* 1. Header Banner */}
      <section className="py-16 lg:py-24 border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 space-y-4">
          <Breadcrumbs items={[{ label: "How It Works" }]} />
          <div className="space-y-4 max-w-3xl">
            <p className="eyebrow">Methodology & Science</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink leading-tight">
              The VelocityFit Formula™
            </h1>
            <p className="text-lg text-ink-soft leading-relaxed">
              A systematic, four-stage clinical methodology designed to reverse metabolic resistance and build sustainable lifelong vitality.
            </p>
          </div>
        </div>
      </section>

      {/* 2. 4-Stage Formula Deep-Dive */}
      <section className="bg-paper py-20 lg:py-28 border-b border-ink/10">
        <div className="max-w-5xl mx-auto px-5 lg:px-10 space-y-16">
          {formulaStages.map((stage) => (
            <div
              key={stage.stage}
              className="p-8 sm:p-12 rounded-[2rem] bg-ivory border border-ink/10 shadow-subtle grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
            >
              <div className="md:col-span-4 space-y-2">
                <span className="font-display text-6xl font-medium text-olive-deep/30">
                  {stage.stage}
                </span>
                <h3 className="font-display text-3xl font-medium text-ink">
                  {stage.name}
                </h3>
                <span className="inline-block font-mono text-[11px] uppercase tracking-wider text-olive-deep font-semibold">
                  {stage.badge}
                </span>
              </div>

              <div className="md:col-span-8 space-y-4">
                <h4 className="font-display text-2xl font-medium text-ink">
                  {stage.title}
                </h4>
                <p className="text-base text-ink-soft leading-relaxed">
                  {stage.description}
                </p>
                <div className="pt-3 border-t border-ink/10">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft font-semibold mb-2">
                    Phase Inclusions
                  </p>
                  <ul className="space-y-1.5 text-xs text-ink-soft">
                    {stage.deliverables.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-olive flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. V6 Audit Section */}
      <section className="py-20 lg:py-28 border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 space-y-12">
          <div className="max-w-3xl space-y-4">
            <p className="eyebrow">The Diagnostic Core</p>
            <h2 className="section-title">The V6 Audit™ Protocol</h2>
            <p className="section-copy">
              Six interconnected lifestyle pillars evaluated before prescribing a single meal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { n: "01", title: "Cellular Hydration", desc: "Fluid timing and electrolytes to accelerate fat oxidation.", icon: Droplets },
              { n: "02", title: "Circadian Rhythm", desc: "Sleep architecture to regulate nighttime cortisol and cravings.", icon: Moon },
              { n: "03", title: "Gut Motility", desc: "Microbiome support to eliminate systemic bloating and fatigue.", icon: Activity },
              { n: "04", title: "Hormonal Sensitivity", desc: "Targeted macros to stabilize insulin and support PCOS/Thyroid.", icon: Dna },
              { n: "05", title: "Habit Architecture", desc: "Behavioral cues that eliminate emotional snacking triggers.", icon: Brain },
              { n: "06", title: "Metabolic Baseline", desc: "Calorie nourishment to reverse past crash-diet metabolic damage.", icon: Flame },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.n} className="p-8 rounded-3xl bg-paper border border-ink/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-olive-deep font-semibold">{p.n}</span>
                    <Icon className="w-5 h-5 text-olive-deep" />
                  </div>
                  <h3 className="font-display text-2xl font-medium text-ink">{p.title}</h3>
                  <p className="text-sm text-ink-soft leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. High-Conversion CTA */}
      <CTASection
        eyebrow="Take the first step"
        title="Ready to experience The VelocityFit Formula?"
        description="Complete your confidential 5-minute health assessment and receive Dr. Lubna Fatima's personalized roadmap."
      />
    </div>
  );
}
