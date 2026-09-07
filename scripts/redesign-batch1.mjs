import fs from 'fs';
import path from 'path';

const root = process.cwd();

// 1. Breadcrumbs
const breadcrumbs = `import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumbs" className="flex items-center space-x-2 text-[11px] font-mono uppercase tracking-[0.16em] text-ink-soft/70 py-3">
      <Link href="/" className="hover:text-ink transition-colors">
        Home
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={item.label} className="flex items-center space-x-2">
            <ChevronRight className="w-3 h-3 text-ink-soft/40" />
            {isLast || !item.href ? (
              <span className="text-olive-deep font-semibold">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-ink transition-colors">
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
`;

// 2. About Page
const aboutPage = `import { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/data/site-config";
import { generateSeoMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { CTASection } from "@/components/common/cta-section";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  HeartHandshake,
  MessageSquareQuote,
} from "lucide-react";

export const metadata: Metadata = generateSeoMetadata({
  title: "About Dr. Lubna Fatima & Velocity Fit",
  description:
    "Learn about Dr. Lubna Fatima, Founder of Velocity Fit in Hyderabad, and her evidence-backed VelocityFit Formula for reversing obesity and metabolic dysfunction.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full bg-ivory text-ink">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden py-16 lg:py-24 border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 space-y-4">
          <Breadcrumbs items={[{ label: "About Founder" }]} />
          <div className="space-y-4 max-w-3xl">
            <p className="eyebrow">Founder & Clinical Practice</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink leading-tight">
              About Dr. Lubna Fatima & Velocity Fit
            </h1>
            <p className="text-lg text-ink-soft leading-relaxed">
              Pioneering physician-led clinical nutrition and sustainable metabolic obesity reversal from Hyderabad, India.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Main Narrative & Portrait */}
      <section className="bg-paper py-20 lg:py-28 border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Profile Sidebar */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 space-y-6">
                <div className="relative overflow-hidden rounded-[2rem] border border-ink/10 shadow-elevated">
                  <img
                    src="/assets/founder-editorial.jpg"
                    alt="Dr. Lubna Fatima, Founder of Velocity Fit"
                    className="aspect-[4/5] w-full object-cover"
                  />
                  <p className="absolute bottom-4 left-4 rounded-full bg-paper/90 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] backdrop-blur text-ink font-semibold border border-ink/10">
                    Dr. Lubna Fatima · Clinical Lead
                  </p>
                </div>

                <div className="p-7 rounded-3xl bg-ivory border border-ink/10 space-y-4">
                  <h3 className="font-display text-xl font-medium text-ink">
                    Practice Information
                  </h3>
                  <div className="space-y-2 text-xs text-ink-soft">
                    <p><strong>Practice:</strong> Velocity Fit</p>
                    <p><strong>Clinical Focus:</strong> Obesity Reversal, PCOS, Metabolic Reset</p>
                    <p><strong>Headquarters:</strong> Hyderabad, Telangana, India</p>
                    <p><strong>Consultations:</strong> Dedicated Online Video & Scheduled Clinical Suites</p>
                  </div>
                  <div className="pt-2">
                    <Button asChild size="sm" fullWidth>
                      <Link href="/book-consultation">Book Doctor Consultation</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Narrative Content */}
            <div className="lg:col-span-7 space-y-10">
              <div className="space-y-5">
                <h2 className="font-display text-3xl sm:text-4xl font-medium text-ink">
                  Bridging Clinical Science and Daily Life
                </h2>
                <p className="text-base sm:text-lg text-ink-soft leading-relaxed">
                  Dr. Lubna Fatima founded Velocity Fit with a clear, uncompromising mission: to free people from the exhausting cycle of crash dieting, severe hunger, and inevitable rebound weight gain.
                </p>
                <p className="text-base text-ink-soft leading-relaxed">
                  With years of clinical practice evaluating metabolic disorders in Hyderabad, Dr. Fatima recognized that standard weight-loss advice failed because it treated weight purely as a character flaw or a simple math problem of calories in versus calories out.
                </p>
                <p className="text-base text-ink-soft leading-relaxed">
                  In reality, sustainable fat oxidation is governed by cellular hydration, cortisol curves, gut microbiome health, and insulin sensitivity. By designing The VelocityFit Formula and the diagnostic V6 Audit™, she has created a doctor-guided framework that transforms bodies while protecting long-term vitality.
                </p>
              </div>

              {/* Founder Core Values */}
              <div className="p-8 rounded-3xl bg-ivory border border-ink/10 space-y-6">
                <p className="eyebrow">Our Clinical Principles</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-display text-2xl font-medium text-ink">Integrity</h4>
                    <p className="text-xs text-ink-soft leading-relaxed">
                      No dangerous shortcuts, fake appetite suppressants, or unsustainable starvation protocols.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-display text-2xl font-medium text-ink">Compassion</h4>
                    <p className="text-xs text-ink-soft leading-relaxed">
                      Listening to your daily challenges, cultural foods, and family routines without judgment.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-display text-2xl font-medium text-ink">Excellence</h4>
                    <p className="text-xs text-ink-soft leading-relaxed">
                      Evidence-backed clinical nutrition tailored specifically to your unique metabolic chemistry.
                    </p>
                  </div>
                </div>
              </div>

              {/* What Sets Us Apart */}
              <div className="space-y-4">
                <h3 className="font-display text-2xl font-medium text-ink">
                  What Sets Velocity Fit Apart
                </h3>
                <ul className="space-y-3 text-sm text-ink-soft">
                  <li className="flex items-start gap-3">
                    <Stethoscope className="w-5 h-5 text-olive flex-shrink-0 mt-0.5" />
                    <span><strong>Physician-Led Accountability:</strong> Direct clinical review of health markers, PCOS history, and thyroid parameters.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-olive flex-shrink-0 mt-0.5" />
                    <span><strong>The V6 Audit™ Protocol:</strong> Six-pillar lifestyle diagnostic assessing hydration, sleep, and gut motility.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-olive flex-shrink-0 mt-0.5" />
                    <span><strong>Cultural Food Preservation:</strong> Designed around home-cooked Indian meals without eliminating rice or roti.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link href="/get-started">Start Your Health Assessment</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/programs">View Transformation Tracks</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. High-Conversion CTA */}
      <CTASection
        eyebrow="Connect with Dr. Fatima"
        title="Ready to begin your transformation?"
        description="Schedule your personalized consultation or take the 5-minute pre-signup assessment."
      />
    </div>
  );
}
`;

// 3. How It Works Page
const howItWorksPage = `import { Metadata } from "next";
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
`;

// 4. Programs Page
const programsPage = `import { Metadata } from "next";
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
`;

fs.writeFileSync(path.join(root, 'src/components/common/breadcrumbs.tsx'), breadcrumbs, 'utf8');
fs.writeFileSync(path.join(root, 'src/app/about/page.tsx'), aboutPage, 'utf8');
fs.writeFileSync(path.join(root, 'src/app/how-it-works/page.tsx'), howItWorksPage, 'utf8');
fs.writeFileSync(path.join(root, 'src/app/programs/page.tsx'), programsPage, 'utf8');

console.log('Batch 1 (Breadcrumbs, About, How-It-Works, Programs) updated successfully!');
