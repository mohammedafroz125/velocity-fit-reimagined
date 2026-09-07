import Link from "next/link";
import { siteConfig } from "@/data/site-config";
import { programsData } from "@/data/programs";
import { faqsData } from "@/data/faqs";
import { Button } from "@/components/ui/button";
import { ProgramCard } from "@/components/cards/program-card";
import { GoalCard } from "@/components/cards/goal-card";
import { CTASection } from "@/components/common/cta-section";
import { AccordionItem } from "@/components/ui/accordion";
import {
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  CheckCircle2,
  Instagram,
  Droplets,
  Moon,
  Activity,
  Dna,
  Brain,
  Flame,
  MessageSquareQuote,
} from "lucide-react";

export default function HomePage() {
  const homepageFaqs = faqsData.slice(0, 5);

  const formulaSteps = [
    {
      number: "01",
      title: "Discover",
      subtitle: "V6 Audit™ Evaluation",
      text: "We evaluate your cellular hydration, sleep architecture, hormonal markers, and eating triggers before prescribing a single meal.",
    },
    {
      number: "02",
      title: "Personalize",
      subtitle: "Metabolic Blueprint",
      text: "Dr. Lubna crafts a personalized nutrition strategy around your home staples, family routines, and dining-out lifestyle.",
    },
    {
      number: "03",
      title: "Transform",
      subtitle: "Clinical Mentorship",
      text: "Weekly macro adjustments and dedicated WhatsApp accountability keep your fat loss steady without metabolic adaptation.",
    },
    {
      number: "04",
      title: "Sustain",
      subtitle: "Permanent Freedom",
      text: "Solidify metabolic resilience and permanent healthy habits so you maintain your ideal physique effortlessly for life.",
    },
  ];

  const v6Pillars = [
    {
      number: "01",
      title: "Cellular Hydration",
      description: "Optimizing fluid timing and electrolyte delivery to accelerate fat oxidation and prevent fatigue.",
      icon: Droplets,
    },
    {
      number: "02",
      title: "Circadian Recovery",
      description: "Restorative sleep architecture to modulate nighttime cortisol and prevent sugar cravings.",
      icon: Moon,
    },
    {
      number: "03",
      title: "Gut Motility & Digestion",
      description: "Enhancing digestive motility and microbiome balance to reduce systemic bloating and inflammation.",
      icon: Activity,
    },
    {
      number: "04",
      title: "Hormonal Sensitivity",
      description: "Macronutrient timing to stabilize insulin sensitivity, support thyroid health, and assist PCOS care.",
      icon: Dna,
    },
    {
      number: "05",
      title: "Habit Architecture",
      description: "Engineering resilient behavioral cues that eliminate emotional snacking and late-night triggers.",
      icon: Brain,
    },
    {
      number: "06",
      title: "Metabolic Baseline",
      description: "Rebuilding basal metabolic rate through nutritional nourishment, reversing damage from crash dieting.",
      icon: Flame,
    },
  ];

  const goals = [
    {
      number: "01",
      title: "Weight loss",
      description: "Targeted fat reduction and inch loss while protecting metabolic rate and muscle tone.",
      href: "/get-started?goal=Weight%20loss",
    },
    {
      number: "02",
      title: "Fat loss & transformation",
      description: "Structured medical nutrition, accountability and physician-led fat-loss protocols.",
      href: "/programs/grit",
    },
    {
      number: "03",
      title: "Better nutrition & PCOS",
      description: "Build practical, wholesome habits for hormonal balance, thyroid health, and vitality.",
      href: "/programs/flex",
    },
    {
      number: "04",
      title: "Not sure where to start",
      description: "Begin with our clinical V6 Audit™ assessment and find the right path for your body.",
      href: "/get-started",
    },
  ];

  return (
    <div className="flex flex-col w-full bg-ivory text-ink overflow-x-hidden">
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(circle_at_70%_20%,var(--color-champagne),transparent_60%)] opacity-20" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-12 lg:px-10">
          <div className="lg:col-span-6 space-y-7 animate-reveal-up">
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-olive animate-pulse" />
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-olive-deep font-semibold">
                Personalized transformation · Hyderabad
              </p>
            </div>

            <h1 className="font-display text-5xl font-semibold leading-[1.04] sm:text-6xl lg:text-7xl text-ink">
              Your health journey, shaped around you.
            </h1>

            <p className="max-w-[44ch] text-lg leading-relaxed text-ink-soft">
              Doctor-led clinical nutrition and sustainable fat-loss guidance founded by{" "}
              <strong className="text-ink font-medium">Dr. Lubna Fatima</strong>. Root-cause metabolic reset—with the structure and support to keep moving forward.
            </p>

            <div className="pt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg">
                <Link href="/get-started" className="flex items-center gap-2">
                  <span>Start your journey</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#formula">See the method</a>
              </Button>
            </div>

            <div className="pt-6 border-t border-ink/10 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 text-xs text-ink-soft">
                <Stethoscope className="w-4 h-4 text-olive-deep flex-shrink-0" />
                <span>Physician-Guided Care</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-ink-soft">
                <ShieldCheck className="w-4 h-4 text-olive-deep flex-shrink-0" />
                <span>V6 Audit™ Protocol</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-ink-soft">
                <CheckCircle2 className="w-4 h-4 text-olive-deep flex-shrink-0" />
                <span>Zero Crash Diets</span>
              </div>
            </div>
          </div>

          <div className="relative lg:col-span-6">
            <div className="relative overflow-hidden rounded-[2rem] shadow-elevated border border-ink/10">
              <img
                src="/assets/velocity-hero.jpg"
                alt="Personalized transformation and strength training in warm wellness studio"
                className="aspect-[4/5] w-full object-cover"
                loading="eager"
              />
            </div>

            <div className="absolute -bottom-6 left-4 max-w-64 rounded-2xl border border-ink/10 bg-paper/90 p-5 shadow-elevated backdrop-blur-md sm:-left-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-olive-deep font-semibold">
                Velocity Fit
              </p>
              <p className="mt-1.5 font-display text-lg leading-snug font-medium text-ink">
                Reverse obesity. Reinvent yourself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CHOOSE YOUR PATH */}
      <section id="journey" className="mx-auto max-w-7xl px-5 py-24 lg:px-10 lg:py-32 border-t border-ink/10">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          <div className="lg:col-span-4 space-y-4">
            <p className="eyebrow">Choose your path</p>
            <h2 className="section-title">Where would you like to begin?</h2>
            <p className="section-copy">
              Choose what feels closest to your personal health goal. Your exact nutrition and lifestyle plan is tailored following your clinical assessment.
            </p>
            <div className="pt-4 hidden lg:block">
              <Button asChild variant="outline">
                <Link href="/get-started" className="flex items-center gap-2">
                  <span>Take Full Health Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {goals.map((goal) => (
              <GoalCard
                key={goal.number}
                number={goal.number}
                title={goal.title}
                description={goal.description}
                targetHref={goal.href}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. TRANSFORMATION PROGRAMS SHOWCASE */}
      <section id="programs" className="bg-mist/50 py-24 lg:py-32 border-y border-ink/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 space-y-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="eyebrow">VelocityFit Transformation</p>
              <h2 className="section-title max-w-xl">
                A program you can shape to your journey.
              </h2>
            </div>
            <p className="section-copy max-w-md">
              Choose a dietary track, level of clinical support, and duration based on your lifestyle and health baseline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programsData.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>

          <div className="p-8 rounded-3xl bg-paper border border-ink/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="font-display text-2xl font-medium text-ink">
                Not sure which track fits your health condition?
              </h4>
              <p className="text-sm text-ink-soft">
                Our team will analyze your metabolic markers and recommend either Flex or Grit track.
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/book-consultation" className="flex items-center gap-2 flex-shrink-0">
                <span>Book Initial Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 4. THE VELOCITYFIT FORMULA */}
      <section id="formula" className="relative overflow-hidden bg-ink py-24 text-ivory lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <p className="eyebrow text-champagne">The Velocity Fit Formula</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl text-ivory">
            A clear progression from baseline understanding to sustainable change.
          </h2>

          <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {formulaSteps.map((step) => (
              <div key={step.number} className="border-t border-ivory/20 pt-6 space-y-3">
                <span className="font-display text-5xl font-medium text-champagne">
                  {step.number}
                </span>
                <h3 className="font-display text-2xl font-medium text-ivory">
                  {step.title}
                </h3>
                <p className="font-mono text-[11px] uppercase tracking-wider text-champagne/80">
                  {step.subtitle}
                </p>
                <p className="text-sm leading-relaxed text-ivory/70 pt-1">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. V6 AUDIT™ PILLARS */}
      <section className="bg-paper py-24 lg:py-32 border-b border-ink/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 space-y-14">
          <div className="max-w-3xl space-y-4">
            <p className="eyebrow">Diagnostic Foundation</p>
            <h2 className="section-title">
              The 6 Pillars of the V6 Audit™
            </h2>
            <p className="section-copy">
              Before giving you a diet, we evaluate the six biological levers that dictate metabolic speed, hormonal sensitivity, and permanent fat loss.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {v6Pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.number}
                  className="p-8 rounded-3xl bg-ivory border border-ink/10 space-y-4 transition-all duration-300 hover:-translate-y-1 hover:border-olive/50 hover:shadow-subtle"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-olive-deep font-semibold tracking-wider">
                      {pillar.number}
                    </span>
                    <div className="size-10 rounded-2xl bg-olive/10 flex items-center justify-center text-olive-deep">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-display text-2xl font-medium text-ink">
                    {pillar.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-soft">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. TRANSFORMATION STORIES TEASER */}
      <section id="stories" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 space-y-5">
              <p className="eyebrow">Transformation stories</p>
              <h2 className="section-title">
                Progress deserves to be seen honestly.
              </h2>
              <p className="section-copy">
                We believe in genuine health transformations rooted in sustainable lifestyle shifts. We only feature real client journeys when they are verified and shared with explicit consent.
              </p>
              <div className="pt-3">
                <Button asChild variant="outline" size="lg">
                  <Link href="/results" className="flex items-center gap-2">
                    <span>View Client Transformations</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative min-h-96 overflow-hidden rounded-[2rem] border border-ink/10 shadow-elevated">
                <img
                  src="/assets/social-walk.jpg"
                  alt="A confident client morning walk representing healthy lifestyle change"
                  className="aspect-[16/10] w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-ink/85 p-8 text-ivory backdrop-blur-md">
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-champagne font-semibold">
                    The Velocity Fit Journey
                  </p>
                  <p className="mt-2 font-display text-2xl sm:text-3xl font-medium text-ivory">
                    Your transformation begins with one decision.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOUNDER SECTION: DR. LUBNA FATIMA */}
      <section id="founder" className="bg-paper py-24 lg:py-32 border-y border-ink/10">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-12 lg:px-10">
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-[2rem] border border-ink/10 shadow-elevated">
              <img
                src="/assets/founder-editorial.jpg"
                alt="Dr. Lubna Fatima, Founder of Velocity Fit Hyderabad"
                className="aspect-[4/5] w-full object-cover"
                loading="lazy"
              />
              <p className="absolute bottom-4 left-4 rounded-full bg-paper/90 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] backdrop-blur-md text-ink font-semibold border border-ink/10">
                Dr. Lubna Fatima · Founder
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <p className="eyebrow">The human behind Velocity Fit</p>
            <h2 className="font-display text-4xl font-medium leading-tight sm:text-5xl text-ink">
              Personal guidance begins with listening.
            </h2>
            <p className="text-lg leading-relaxed text-ink-soft">
              Dr. Lubna Fatima founded Velocity Fit in Hyderabad to empower individuals through clinical nutrition protocols, customized obesity reversal plans, and compassionate accountability.
            </p>
            <div className="border-l-2 border-champagne pl-5 space-y-1 py-1">
              <p className="font-display text-2xl font-medium text-ink">
                Integrity. Compassion. Clinical Excellence.
              </p>
              <p className="text-sm text-ink-soft">
                The core medical values guiding every client transformation.
              </p>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" variant="outline">
                <Link href="/about" className="flex items-center gap-2">
                  <span>Read the founder story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <a
                  href={siteConfig.socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-olive-deep"
                >
                  <MessageSquareQuote className="w-4 h-4" />
                  <span>Connect on WhatsApp</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. COMMUNITY & INSTAGRAM INSPIRATION */}
      <section id="community" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <p className="eyebrow">From the community</p>
              <h2 className="section-title">Wellness, in real life.</h2>
            </div>
            <Button asChild variant="outline">
              <a
                href={siteConfig.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2"
              >
                <Instagram className="w-4 h-4 text-olive" />
                <span>Follow @velocityfit.official</span>
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            <a
              href={siteConfig.socialLinks.instagram}
              target="_blank"
              rel="noreferrer"
              className="group col-span-2 row-span-2 overflow-hidden rounded-3xl border border-ink/10 relative"
            >
              <img
                src="/assets/social-meal.jpg"
                alt="Nutritious balanced Indian meal inspiration"
                className="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent p-6 text-ivory">
                <span className="font-mono text-[10px] uppercase tracking-widest text-champagne">
                  Nutrition Science
                </span>
                <p className="font-display text-xl font-medium mt-1">
                  Balanced Indian meal inspiration
                </p>
              </div>
            </a>

            <a
              href={siteConfig.socialLinks.instagram}
              target="_blank"
              rel="noreferrer"
              className="group overflow-hidden rounded-3xl border border-ink/10 relative"
            >
              <img
                src="/assets/social-journal.jpg"
                alt="Writing daily wellness goals and habit logs"
                className="aspect-square size-full object-cover transition duration-500 group-hover:scale-[1.04]"
                loading="lazy"
              />
            </a>

            <a
              href={siteConfig.socialLinks.instagram}
              target="_blank"
              rel="noreferrer"
              className="group overflow-hidden rounded-3xl border border-ink/10 relative"
            >
              <img
                src="/assets/social-studio.jpg"
                alt="Wellness studio essentials and dumbbell training"
                className="aspect-square size-full object-cover transition duration-500 group-hover:scale-[1.04]"
                loading="lazy"
              />
            </a>

            <a
              href={siteConfig.socialLinks.instagram}
              target="_blank"
              rel="noreferrer"
              className="group col-span-2 overflow-hidden rounded-3xl border border-ink/10 relative"
            >
              <img
                src="/assets/social-walk.jpg"
                alt="Morning routine and active walking habits"
                className="aspect-[2/1] size-full object-cover transition duration-500 group-hover:scale-[1.04]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-ivory">
                <span className="font-mono text-xs uppercase tracking-widest bg-ink/80 px-4 py-2 rounded-full backdrop-blur">
                  View on Instagram →
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="border-t border-ink/10 bg-paper py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-12 lg:px-10">
          <div className="lg:col-span-4 space-y-4">
            <p className="eyebrow">Before you begin</p>
            <h2 className="section-title">Questions, answered.</h2>
            <p className="section-copy">
              Clear answers regarding clinical intakes, program durations, dietary tracks, and support levels.
            </p>
            <div className="pt-4">
              <Button asChild variant="outline">
                <Link href="/faq" className="flex items-center gap-2">
                  <span>View All FAQs</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-8 divide-y divide-ink/10">
            {homepageFaqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
                variant="editorial"
              />
            ))}
          </div>
        </div>
      </section>

      {/* 10. FINAL EDITORIAL CALL TO ACTION */}
      <CTASection
        eyebrow="Ready when you are"
        title="Begin with one intentional step."
        description="Tell us where you are today. We'll help you find the right clinical nutrition path forward."
        primaryCtaText="Start your assessment"
        primaryCtaHref="/get-started"
        showPhone={true}
      />
    </div>
  );
}
