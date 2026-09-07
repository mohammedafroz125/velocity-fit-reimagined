import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getResourceBySlug, resourcesData } from "@/data/resources";
import { generateSeoMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { CTASection } from "@/components/common/cta-section";
import { Button } from "@/components/ui/button";
import { Clock, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

export async function generateStaticParams() {
  return resourcesData.map((r) => ({
    slug: r.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getResourceBySlug(slug);
  if (!guide) return { title: "Guide Not Found" };

  return generateSeoMetadata({
    title: `${guide.title} | Velocity Fit Guide`,
    description: guide.excerpt,
    path: `/resources/${guide.slug}`,
  });
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getResourceBySlug(slug);

  if (!guide) {
    notFound();
  }

  return (
    <div className="flex flex-col w-full bg-ivory text-ink">
      {/* 1. Header */}
      <section className="py-16 lg:py-24 border-b border-ink/10">
        <div className="max-w-4xl mx-auto px-5 lg:px-10 space-y-4">
          <Breadcrumbs
            items={[
              { label: "Clinical Resources", href: "/resources" },
              { label: guide.category },
            ]}
          />
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-wider text-olive-deep font-semibold">
                {guide.category}
              </span>
              <span className="text-ink-soft/40">•</span>
              <span className="flex items-center gap-1 font-mono text-xs text-ink-soft/70">
                <Clock className="w-3.5 h-3.5" />
                {guide.readTimeMinutes} min read
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink leading-tight">
              {guide.title}
            </h1>
            <p className="text-lg text-ink-soft leading-relaxed">
              {guide.excerpt}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Article Content */}
      <section className="bg-paper py-20 lg:py-28 border-b border-ink/10">
        <div className="max-w-3xl mx-auto px-5 lg:px-10 space-y-8">
          <div className="prose prose-lg text-ink space-y-6">
            {guide.paragraphs.map((paragraph, pIdx) => (
              <p key={pIdx} className="text-base sm:text-lg text-ink-soft leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="pt-8 border-t border-ink/10 flex items-center justify-between">
            <Button asChild variant="outline">
              <Link href="/resources" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span>All Health Guides</span>
              </Link>
            </Button>
            <Button asChild>
              <Link href="/get-started" className="flex items-center gap-2">
                <span>Start Your Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 3. CTA */}
      <CTASection />
    </div>
  );
}
