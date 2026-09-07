import { Metadata } from "next";
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
