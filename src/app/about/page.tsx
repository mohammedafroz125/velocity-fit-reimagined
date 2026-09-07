import { Metadata } from "next";
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
