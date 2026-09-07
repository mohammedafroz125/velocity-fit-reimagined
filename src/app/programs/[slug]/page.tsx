import { Metadata } from "next";
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
    title: `${program.title} | Pricing & Structure`,
    description: program.shortDescription,
    path: `/programs/${program.slug}`,
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
              { label: `${program.track} Track` },
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
                          <Link href={`/checkout?track=${program.track}&tier=${option.tier}&duration=${option.duration}`}>
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
