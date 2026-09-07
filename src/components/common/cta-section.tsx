import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/site-config";
import { ArrowRight, Phone, MessageSquareQuote } from "lucide-react";

export interface CTASectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  showPhone?: boolean;
}

export function CTASection({
  eyebrow = "Ready when you are",
  title = "Begin with one intentional step.",
  description = "Tell us where you are today. We'll help you find the right clinical nutrition path forward.",
  primaryCtaText = "Start your assessment",
  primaryCtaHref = "/get-started",
  showPhone = true,
}: CTASectionProps) {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-ivory lg:py-32 border-t border-ivory/10">
      <div className="mx-auto max-w-4xl px-5 text-center lg:px-10">
        <p className="eyebrow text-champagne">{eyebrow}</p>
        <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl text-ivory">
          {title}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-ivory/70 leading-relaxed">
          {description}
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="inverse" size="lg">
            <Link href={primaryCtaHref} className="flex items-center justify-center gap-2">
              <span>{primaryCtaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          {showPhone && (
            <Button asChild variant="glass" size="lg">
              <a href={`tel:${siteConfig.contact.phoneRaw}`} className="flex items-center justify-center gap-2">
                <Phone className="w-4 h-4 text-champagne" />
                <span>Call {siteConfig.contact.phoneDisplay}</span>
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
