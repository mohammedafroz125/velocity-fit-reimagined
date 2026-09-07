import { Metadata } from "next";
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
                href={`/resources/${guide.slug}`}
                className="group p-8 rounded-3xl bg-ivory border border-ink/10 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-olive/50 hover:shadow-card"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-olive-deep font-semibold">
                      {guide.category}
                    </span>
                    <span className="flex items-center gap-1 text-ink-soft/60">
                      <Clock className="w-3.5 h-3.5" />
                      {guide.readTimeMinutes} min
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-medium text-ink group-hover:text-olive-deep transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-ink-soft leading-relaxed">
                    {guide.excerpt}
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
