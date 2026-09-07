import fs from 'fs';
import path from 'path';

const root = process.cwd();

// 1. Program Detail Page ([slug])
const programDetailPage = `import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProgramBySlug, programsData } from "@/data/programs";
import { siteConfig } from "@/data/site-config";
import { generateSeoMetadata } from "@/lib/seo";
import { formatINR } from "@/lib/utils";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/common/cta-section";
import { AccordionItem } from "@/components/ui/accordion";
import { Check, ShieldCheck, ArrowRight, Sparkles, MessageSquareQuote } from "lucide-react";

export async function generateStaticParams() {
  return programsData.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgramBySlug(slug);
  if (!program) return { title: "Program Not Found" };

  return generateSeoMetadata({
    title: \`\${program.title} | Pricing & Structure\`,
    description: program.shortDescription,
    path: \`/programs/\${program.slug}\`,
  });
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  const isFlex = program.track === "Flex";

  const trackFaqs = isFlex
    ? [
        {
          question: "Can I follow the Flex Track if I dine out or travel frequently?",
          answer:
            "Yes. The Flex Track is specifically architected for lifestyle integration. Rather than rigid meal containers, you are coached on plate composition, restaurant dining choices, and metabolic compensation so your weight loss continues uninterrupted.",
        },
        {
          question: "What is the difference between Prime and Elite support on Flex?",
          answer:
            "Prime provides weekly clinical progress reviews and dedicated team guidance. Elite tier adds high-touch daily food log monitoring and direct 1-on-1 mentorship with Dr. Lubna Fatima.",
        },
        {
          question: "Will I have to eliminate rice, roti, or traditional foods?",
          answer:
            "No. Dr. Lubna Fatima's clinical philosophy centers on sustainable eating. We adjust portion timing and macronutrient distribution without eliminating staple home-cooked foods.",
        },
      ]
    : [
        {
          question: "How does the Grit Track assist PCOS or Thyroid conditions?",
          answer:
            "The Grit Track integrates clinical nutritional strategies specifically targeted at hormonal resistance, insulin sensitivity, and systemic inflammation. Meal timing and micronutrient compositions are customized to your medical reports.",
        },
        {
          question: "Why is daily accountability emphasized in the Grit Track?",
          answer:
            "For stubborn metabolic cases or significant weight loss goals (>15kg), consistent daily feedback prevents metabolic slowdown, tracks hydration, and builds disciplined habits rapidly.",
        },
        {
          question: "Is clinical lab work reviewed during the Grit Track?",
          answer:
            "Yes. You can submit recent lipid profiles, HbA1c, thyroid panels, and ultrasound reports during your intake for Dr. Lubna's direct review.",
        },
      ];

  return (
    <div className="flex flex-col w-full bg-ivory text-ink">
      {/* 1. Header Banner */}
      <section className="py-16 lg:py-24 border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 space-y-4">
          <Breadcrumbs
            items={[
              { label: "Programs", href: "/programs" },
              { label: \`\${program.track} Track\` },
            ]}
          />
          <div className="space-y-4 max-w-3xl">
            <p className="eyebrow">{program.track} Transformation Track</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink leading-tight">
              {program.title}
            </h1>
            <p className="text-lg text-ink-soft leading-relaxed">
              {program.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Program Details Grid */}
      <section className="bg-paper py-20 lg:py-28 border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-10">
              <div className="space-y-4">
                <h2 className="font-display text-3xl font-medium text-ink">
                  Protocol Overview
                </h2>
                {program.fullDescription.map((paragraph, index) => (
                  <p key={index} className="text-base text-ink-soft leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Inclusions */}
              <div className="p-8 rounded-3xl bg-ivory border border-ink/10 space-y-4">
                <h3 className="font-display text-2xl font-medium text-ink">
                  Program Inclusions
                </h3>
                <ul className="space-y-2.5 text-sm text-ink-soft">
                  {program.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-olive flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Best For */}
              <div className="space-y-4">
                <h3 className="font-display text-2xl font-medium text-ink">
                  Who This Protocol Is Best For
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {program.bestFor.map((item, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-ivory border border-ink/10 flex items-start gap-2.5 text-sm text-ink-soft">
                      <Sparkles className="w-4 h-4 text-olive flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Track Specific FAQs */}
              <div className="space-y-4 pt-6 border-t border-ink/10">
                <h3 className="font-display text-2xl font-medium text-ink">
                  Track Questions Answered
                </h3>
                <div className="divide-y divide-ink/10">
                  {trackFaqs.map((faq, i) => (
                    <AccordionItem
                      key={i}
                      question={faq.question}
                      answer={faq.answer}
                      variant="editorial"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Pricing Sidebar */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 p-8 rounded-[2rem] bg-ivory border border-ink/10 shadow-elevated space-y-6">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-olive-deep font-semibold">
                    Verified Program Pricing
                  </span>
                  <h3 className="font-display text-3xl font-medium text-ink mt-1">
                    Select Commitment
                  </h3>
                  <p className="text-xs text-ink-soft mt-1">
                    Direct integration with WooCommerce Product #559.
                  </p>
                </div>

                <div className="space-y-3">
                  {program.pricing.map((option, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-paper border border-ink/10 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-0.5">
                        <span className="font-display text-lg font-medium text-ink">
                          {option.tier} · {option.durationLabel}
                        </span>
                        <p className="text-xs text-ink-soft">
                          {option.tier === "Prime" ? "Core Clinical Support" : "Direct 1-on-1 with Dr. Lubna"}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-display text-xl font-semibold text-ink">
                          {formatINR(option.salePrice)}
                        </span>
                        <Button asChild size="sm" className="mt-2 block">
                          <Link href={\`/checkout?track=\${program.track}&tier=\${option.tier}&duration=\${option.duration}\`}>
                            Enroll
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-center">
                  <p className="text-xs text-ink-soft/70">
                    Need help deciding? Connect with Dr. Lubna Fatima directly.
                  </p>
                  <Button asChild variant="outline" size="sm" fullWidth className="mt-3">
                    <a href={siteConfig.socialLinks.whatsapp} target="_blank" rel="noopener noreferrer">
                      <MessageSquareQuote className="w-4 h-4 mr-1.5" />
                      Chat on WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CTA */}
      <CTASection
        eyebrow="Personalized evaluation"
        title="Not sure if this track fits you?"
        description="Take the 5-minute health assessment and receive Dr. Lubna's direct clinical recommendation."
      />
    </div>
  );
}
`;

// 2. Results Page
const resultsPage = `import { Metadata } from "next";
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
`;

// 3. FAQ Page
const faqPage = `import { Metadata } from "next";
import Link from "next/link";
import { faqsData } from "@/data/faqs";
import { generateSeoMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { CTASection } from "@/components/common/cta-section";
import { AccordionItem } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = generateSeoMetadata({
  title: "Frequently Asked Questions — Velocity Fit",
  description:
    "Get answers to frequently asked questions about Dr. Lubna Fatima's clinical nutrition programs, V6 Audit™, Flex and Grit tracks, and pricing.",
  path: "/faq",
});

export default function FAQPage() {
  return (
    <div className="flex flex-col w-full bg-ivory text-ink">
      {/* 1. Header Banner */}
      <section className="py-16 lg:py-24 border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 space-y-4">
          <Breadcrumbs items={[{ label: "Frequently Asked Questions" }]} />
          <div className="space-y-4 max-w-3xl">
            <p className="eyebrow">Clear, Transparent Answers</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-ink-soft leading-relaxed">
              Everything you need to know about our clinical methodologies, transformation tracks, support tiers, and consultation scheduling.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FAQ Accordion Hub */}
      <section className="bg-paper py-20 lg:py-28 border-b border-ink/10">
        <div className="max-w-4xl mx-auto px-5 lg:px-10 space-y-12">
          <div className="divide-y divide-ink/10">
            {faqsData.map((faq) => (
              <AccordionItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
                variant="editorial"
              />
            ))}
          </div>

          <div className="p-8 rounded-3xl bg-ivory border border-ink/10 text-center space-y-4">
            <h3 className="font-display text-2xl font-medium text-ink">
              Have a question not covered here?
            </h3>
            <p className="text-sm text-ink-soft max-w-md mx-auto">
              Our clinical care coordination team is available on WhatsApp to answer any specific case questions.
            </p>
            <Button asChild size="lg">
              <Link href="/contact">Contact Our Team</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 3. CTA */}
      <CTASection />
    </div>
  );
}
`;

// 4. Resources Page
const resourcesPage = `import { Metadata } from "next";
import Link from "next/link";
import { resourcesData } from "@/data/resources";
import { generateSeoMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { CTASection } from "@/components/common/cta-section";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Clock } from "lucide-react";

export const metadata: Metadata = generateSeoMetadata({
  title: "Clinical Resources & Health Guides — Velocity Fit",
  description:
    "Evidence-based clinical nutrition guides, PCOS care insights, and metabolic health articles from Dr. Lubna Fatima.",
  path: "/resources",
});

export default function ResourcesPage() {
  return (
    <div className="flex flex-col w-full bg-ivory text-ink">
      {/* 1. Header */}
      <section className="py-16 lg:py-24 border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 space-y-4">
          <Breadcrumbs items={[{ label: "Clinical Resources" }]} />
          <div className="space-y-4 max-w-3xl">
            <p className="eyebrow">Evidence-Based Education</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink leading-tight">
              Clinical Health & Nutrition Guides
            </h1>
            <p className="text-lg text-ink-soft leading-relaxed">
              Explore physician-led articles on cellular hydration, circadian rhythms, PCOS nutrition, and sustainable fat loss.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Resources Directory */}
      <section className="bg-paper py-20 lg:py-28 border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resourcesData.map((guide) => (
              <Link
                key={guide.id}
                href={\`/resources/\${guide.slug}\`}
                className="group p-8 rounded-3xl bg-ivory border border-ink/10 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-olive/50 hover:shadow-card"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-olive-deep font-semibold">
                      {guide.category}
                    </span>
                    <span className="flex items-center gap-1 text-ink-soft/60">
                      <Clock className="w-3.5 h-3.5" />
                      {guide.readTime}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-medium text-ink group-hover:text-olive-deep transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-ink-soft leading-relaxed">
                    {guide.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-ink/10 flex items-center justify-between text-xs font-semibold text-olive-deep">
                  <span>Read Full Clinical Guide</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CTA */}
      <CTASection />
    </div>
  );
}
`;

fs.writeFileSync(path.join(root, 'src/app/programs/[slug]/page.tsx'), programDetailPage, 'utf8');
fs.writeFileSync(path.join(root, 'src/app/results/page.tsx'), resultsPage, 'utf8');
fs.writeFileSync(path.join(root, 'src/app/faq/page.tsx'), faqPage, 'utf8');
fs.writeFileSync(path.join(root, 'src/app/resources/page.tsx'), resourcesPage, 'utf8');

console.log('Batch 2 (ProgramDetail, Results, FAQ, Resources) updated successfully!');
