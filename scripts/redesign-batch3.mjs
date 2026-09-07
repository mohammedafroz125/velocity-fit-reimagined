import fs from 'fs';
import path from 'path';

const root = process.cwd();

// 1. Resource Detail Page ([slug])
const resourceDetailPage = `import { Metadata } from "next";
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
    title: \`\${guide.title} | Velocity Fit Guide\`,
    description: guide.description,
    path: \`/resources/\${guide.slug}\`,
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
                {guide.readTime}
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink leading-tight">
              {guide.title}
            </h1>
            <p className="text-lg text-ink-soft leading-relaxed">
              {guide.description}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Article Content */}
      <section className="bg-paper py-20 lg:py-28 border-b border-ink/10">
        <div className="max-w-3xl mx-auto px-5 lg:px-10 space-y-12">
          {guide.sections.map((section, idx) => (
            <article key={idx} className="space-y-4">
              <h2 className="font-display text-2xl sm:text-3xl font-medium text-ink">
                {section.heading}
              </h2>
              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-base text-ink-soft leading-relaxed">
                  {p}
                </p>
              ))}
            </article>
          ))}

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
`;

// 2. Contact Page
const contactPage = `import { Metadata } from "next";
import { siteConfig } from "@/data/site-config";
import { generateSeoMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { ContactForm } from "@/components/forms/contact-form";
import { CTASection } from "@/components/common/cta-section";
import { Phone, Mail, MapPin, MessageSquareQuote, Clock } from "lucide-react";

export const metadata: Metadata = generateSeoMetadata({
  title: "Contact Velocity Fit & Dr. Lubna Fatima",
  description:
    "Get in touch with Velocity Fit in Hyderabad. Call +91 99668 27968 or chat on WhatsApp +91 73373 37886 for clinical nutrition and weight loss consultation.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="flex flex-col w-full bg-ivory text-ink">
      {/* 1. Header Banner */}
      <section className="py-16 lg:py-24 border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 space-y-4">
          <Breadcrumbs items={[{ label: "Contact Us" }]} />
          <div className="space-y-4 max-w-3xl">
            <p className="eyebrow">Direct Inquiries & Care Coordination</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink leading-tight">
              Connect with Velocity Fit
            </h1>
            <p className="text-lg text-ink-soft leading-relaxed">
              Have questions regarding our clinical protocols or consultation scheduling? Reach out directly to Dr. Lubna Fatima's care team.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Main Contact Form & Details Section */}
      <section className="bg-paper py-20 lg:py-28 border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Verified Contact Details */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <p className="eyebrow">Verified Direct Channels</p>
                <h2 className="font-display text-3xl font-medium text-ink">
                  We're Here to Guide Your Transformation
                </h2>
                <p className="text-sm text-ink-soft leading-relaxed">
                  Our clinical consultations are conducted digitally for clients across India and globally, with dedicated WhatsApp mentorship.
                </p>
              </div>

              {/* Detail Items */}
              <div className="space-y-4">
                <a
                  href={siteConfig.socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-6 rounded-3xl bg-ivory border border-ink/10 flex items-start gap-4 transition-all hover:border-olive/50 hover:shadow-subtle"
                >
                  <div className="size-10 rounded-2xl bg-olive/10 text-olive-deep flex items-center justify-center flex-shrink-0">
                    <MessageSquareQuote className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-olive-deep font-semibold">
                      Fastest Direct Response
                    </span>
                    <p className="font-display text-lg font-medium text-ink">WhatsApp Care Line</p>
                    <p className="text-xs text-ink-soft">{siteConfig.contact.whatsappDisplay}</p>
                  </div>
                </a>

                <a
                  href={\`tel:\${siteConfig.contact.phoneRaw}\`}
                  className="p-6 rounded-3xl bg-ivory border border-ink/10 flex items-start gap-4 transition-all hover:border-olive/50 hover:shadow-subtle"
                >
                  <div className="size-10 rounded-2xl bg-olive/10 text-olive-deep flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-olive-deep font-semibold">
                      Direct Telephone
                    </span>
                    <p className="font-display text-lg font-medium text-ink">Clinical Suite Desk</p>
                    <p className="text-xs text-ink-soft">{siteConfig.contact.phoneDisplay}</p>
                  </div>
                </a>

                <div className="p-6 rounded-3xl bg-ivory border border-ink/10 flex items-start gap-4">
                  <div className="size-10 rounded-2xl bg-olive/10 text-olive-deep flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-olive-deep font-semibold">
                      Location
                    </span>
                    <p className="font-display text-lg font-medium text-ink">
                      {siteConfig.contact.location}, {siteConfig.contact.state}
                    </p>
                    <p className="text-xs text-ink-soft">
                      {siteConfig.contact.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-12 rounded-[2rem] bg-ivory border border-ink/10 shadow-elevated">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CTA */}
      <CTASection />
    </div>
  );
}
`;

// 3. Contact Form
const contactForm = `"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getStoredAttribution } from "@/lib/attribution";
import { trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/data/site-config";
import { CheckCircle2, MessageSquareQuote, ArrowRight } from "lucide-react";

export function ContactForm() {
  const [formData, setFormData] = React.useState({
    fullName: "",
    phone: "",
    email: "",
    primaryGoal: "",
    preferredContactMethod: "WhatsApp",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [serverError, setServerError] = React.useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = "Full Name is required";
    if (!formData.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!/^\\+?[0-9]{10,14}$/.test(formData.phone.replace(/[\\s-]/g, ""))) {
      errs.phone = "Please enter a valid 10-digit phone number";
    }
    if (formData.email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    const attribution = getStoredAttribution();

    try {
      const res = await fetch("/api/leads/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email || undefined,
          primaryGoal: formData.primaryGoal || undefined,
          message: formData.message || undefined,
          attribution,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to record inquiry");
      }

      trackEvent("contact_form_success", { goal: formData.primaryGoal });
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err: unknown) {
      setIsSubmitting(false);
      setServerError(
        err instanceof Error ? err.message : "Unable to submit inquiry at this moment."
      );
    }
  };

  if (isSuccess) {
    return (
      <div className="py-10 text-center space-y-6">
        <div className="size-16 rounded-full bg-olive/10 text-olive-deep flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="font-display text-3xl font-medium text-ink">Inquiry Received</h3>
          <p className="text-sm text-ink-soft max-w-md mx-auto leading-relaxed">
            Thank you, <strong>{formData.fullName}</strong>. Dr. Lubna Fatima&apos;s team will connect with you via {formData.preferredContactMethod} shortly.
          </p>
        </div>
        <Button asChild size="lg">
          <a
            href={\`https://wa.me/\${siteConfig.contact.whatsappRaw}?text=\${encodeURIComponent(
              \`Hello Dr. Lubna, I submitted an inquiry on the Velocity Fit website for \${formData.fullName}.\`
            )}\`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>Connect Immediately on WhatsApp</span>
          </a>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <p className="eyebrow">Send a Direct Message</p>
        <h3 className="font-display text-2xl sm:text-3xl font-medium text-ink">
          Schedule Consultation or Ask a Question
        </h3>
      </div>

      {serverError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name *"
          placeholder="e.g. Priya Sharma"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          error={errors.fullName}
        />
        <Input
          label="Mobile Phone / WhatsApp *"
          placeholder="+91 98765 43210"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          error={errors.phone}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Email Address (Optional)"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />
        <Select
          label="Primary Health Goal"
          value={formData.primaryGoal}
          onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
          options={[
            { label: "Select primary goal...", value: "" },
            { label: "Weight loss / Fat loss", value: "Weight loss" },
            { label: "PCOS / Hormonal balance", value: "PCOS" },
            { label: "Metabolic reset & Blood sugar", value: "Metabolic health" },
            { label: "General Nutrition Guidance", value: "Nutrition" },
            { label: "Other / Direct Consultation", value: "Other" },
          ]}
        />
      </div>

      <Textarea
        label="Message or Current Health Challenges (Optional)"
        placeholder="Share a brief overview of your current weight, health conditions, or questions for Dr. Fatima..."
        rows={4}
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
      />

      <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
        {isSubmitting ? "Sending Inquiry..." : "Submit Inquiry to Dr. Fatima"}
      </Button>

      <p className="text-[11px] text-center text-ink-soft/70">
        Your information is protected under physician-led clinical confidentiality.
      </p>
    </form>
  );
}
`;

fs.writeFileSync(path.join(root, 'src/app/resources/[slug]/page.tsx'), resourceDetailPage, 'utf8');
fs.writeFileSync(path.join(root, 'src/app/contact/page.tsx'), contactPage, 'utf8');
fs.writeFileSync(path.join(root, 'src/components/forms/contact-form.tsx'), contactForm, 'utf8');

console.log('Batch 3 (ResourceDetail, Contact, ContactForm) updated successfully!');
