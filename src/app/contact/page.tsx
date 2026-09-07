import { Metadata } from "next";
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
                  href={`tel:${siteConfig.contact.phoneRaw}`}
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
