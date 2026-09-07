import Link from "next/link";
import { siteConfig } from "@/data/site-config";
import { Phone, Mail, Instagram, MessageSquareQuote, ArrowUpRight, ShieldCheck, MapPin, Clock } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-ivory border-t border-ivory/10 relative overflow-hidden selection:bg-champagne selection:text-ink">
      {/* Background Ambience */}
      <div 
        aria-hidden="true"
        className="absolute top-0 right-1/4 w-96 h-96 bg-olive/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"
      />
      <div 
        aria-hidden="true"
        className="absolute bottom-0 left-10 w-80 h-80 bg-champagne/5 rounded-full blur-3xl pointer-events-none translate-y-1/2"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-16 lg:pt-20 pb-12 relative z-10">
        {/* 1. Header Concierge Strip */}
        <div className="pb-12 border-b border-ivory/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-baseline gap-2.5 group">
              <span className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-ivory group-hover:text-champagne transition-colors">
                Velocity
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-champagne bg-champagne/10 border border-champagne/20 px-2.5 py-0.5 rounded-full">
                Fit
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-ivory/60 font-body flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-olive-light animate-pulse" />
              <span>Physician-Led Metabolic Restoration · Dr. Lubna Fatima · Hyderabad, India</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={siteConfig.socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-olive/20 hover:bg-olive/30 border border-olive/40 text-ivory text-xs font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] shadow-sm"
              aria-label="Direct WhatsApp Consultation"
            >
              <MessageSquareQuote className="w-4 h-4 text-champagne" />
              <span>Direct WhatsApp Concierge</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-champagne/80" />
            </a>
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-champagne text-ink hover:bg-champagne-light text-xs font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] shadow-sm"
            >
              <span>Take Health Assessment</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 2. Main 4-Column Navigation & Practice Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 py-14 border-b border-ivory/10">
          {/* Column 1: Philosophy & Founder Spotlight (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-3">
              <h3 className="font-display text-lg font-medium text-ivory">
                The Clinical Standard
              </h3>
              <p className="text-sm leading-relaxed text-ivory/70 max-w-sm font-body">
                Led by <strong className="text-ivory font-medium">Dr. Lubna Fatima</strong>, Velocity Fit bridges evidence-based nutrition science, endocrine health, and sustainable habit engineering to deliver permanent obesity reversal without deprivation.
              </p>
            </div>

            <div className="space-y-2 text-xs text-ivory/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-champagne flex-shrink-0" />
                <span>The VelocityFit Formula & V6 Audit™ Protocol</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-champagne flex-shrink-0" />
                <span>Structured 1-Month & 3-Month Clinical Care Tracks</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-champagne flex-shrink-0" />
                <span>Hyderabad, Telangana, India (Pan-India Online Care)</span>
              </div>
            </div>

            {/* Social Connectivity */}
            <div className="pt-2 flex items-center space-x-3">
              <a
                href={siteConfig.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 rounded-full bg-ivory/5 hover:bg-champagne/20 border border-ivory/10 hover:border-champagne/40 flex items-center justify-center text-ivory/80 hover:text-champagne transition-all duration-300"
                aria-label="Follow Velocity Fit on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 rounded-full bg-ivory/5 hover:bg-champagne/20 border border-ivory/10 hover:border-champagne/40 flex items-center justify-center text-ivory/80 hover:text-champagne transition-all duration-300"
                aria-label="Chat with Velocity Fit on WhatsApp"
              >
                <MessageSquareQuote className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Explore & Methodology (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-champagne font-medium">
              Explore & Methodology
            </p>
            <ul className="space-y-2.5 text-sm text-ivory/70 font-body">
              <li>
                <Link href="/about" className="hover:text-champagne transition-colors flex items-center justify-between group">
                  <span>About Dr. Lubna Fatima</span>
                  <span className="text-xs text-ivory/30 group-hover:text-champagne transition-colors">01</span>
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-champagne transition-colors flex items-center justify-between group">
                  <span>The VelocityFit Formula</span>
                  <span className="text-xs text-ivory/30 group-hover:text-champagne transition-colors">02</span>
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-champagne transition-colors flex items-center justify-between group">
                  <span>V6 Metabolic Audit™</span>
                  <span className="text-xs text-ivory/30 group-hover:text-champagne transition-colors">03</span>
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-champagne transition-colors flex items-center justify-between group">
                  <span>Client Transformations</span>
                  <span className="text-xs text-ivory/30 group-hover:text-champagne transition-colors">04</span>
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-champagne transition-colors flex items-center justify-between group">
                  <span>Clinical Guides & Insights</span>
                  <span className="text-xs text-ivory/30 group-hover:text-champagne transition-colors">05</span>
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-champagne transition-colors flex items-center justify-between group">
                  <span>Frequently Asked Questions</span>
                  <span className="text-xs text-ivory/30 group-hover:text-champagne transition-colors">06</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-champagne transition-colors flex items-center justify-between group">
                  <span>Contact Clinic Concierge</span>
                  <span className="text-xs text-ivory/30 group-hover:text-champagne transition-colors">07</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Transformation Programs (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-champagne font-medium">
              Programs
            </p>
            <ul className="space-y-2.5 text-sm text-ivory/70 font-body">
              <li>
                <Link href="/programs/flex" className="hover:text-champagne transition-colors">
                  Flex Track
                </Link>
              </li>
              <li>
                <Link href="/programs/grit" className="hover:text-champagne transition-colors">
                  Grit Track
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:text-champagne transition-colors">
                  All Tracks & Pricing
                </Link>
              </li>
              <li>
                <Link href="/get-started" className="text-champagne hover:text-ivory transition-colors font-medium flex items-center gap-1 group">
                  <span>Health Assessment</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
              <li>
                <Link href="/book-consultation" className="hover:text-champagne transition-colors">
                  Book Initial Visit
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-champagne transition-colors text-xs text-ivory/50">
                  Direct Enrollment
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Practice Access (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-champagne font-medium">
              Direct Contact
            </p>
            <div className="space-y-3.5 text-sm text-ivory/70 font-body">
              {/* WhatsApp */}
              <div className="p-3.5 rounded-2xl bg-ivory/5 border border-ivory/10 space-y-1 hover:border-champagne/30 transition-colors">
                <span className="font-mono text-[10px] uppercase tracking-wider text-champagne font-semibold block">
                  WhatsApp Direct
                </span>
                <a
                  href={siteConfig.socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ivory hover:text-champagne font-medium text-xs sm:text-sm flex items-center justify-between"
                >
                  <span>{siteConfig.contact.whatsappDisplay}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-champagne" />
                </a>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-3 text-xs">
                <Phone className="w-4 h-4 text-champagne flex-shrink-0" />
                <div>
                  <span className="text-ivory/40 block text-[10px] uppercase font-mono">Clinic Line</span>
                  <a href={`tel:${siteConfig.contact.phoneRaw}`} className="text-ivory/80 hover:text-ivory transition-colors">
                    {siteConfig.contact.phoneDisplay}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3 text-xs">
                <Mail className="w-4 h-4 text-champagne flex-shrink-0" />
                <div>
                  <span className="text-ivory/40 block text-[10px] uppercase font-mono">Practice Inquiries</span>
                  <a href={`mailto:${siteConfig.contact.email}`} className="text-ivory/80 hover:text-ivory transition-colors break-all">
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-3 text-xs text-ivory/50 pt-1">
                <MapPin className="w-4 h-4 text-champagne/60 flex-shrink-0 mt-0.5" />
                <span>
                  {siteConfig.contact.location}, {siteConfig.contact.state}, {siteConfig.contact.country}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Clinical Medical Disclaimer */}
        <div className="my-8 p-5 sm:p-6 rounded-2xl bg-ivory/[0.03] border border-ivory/10 space-y-2 text-xs text-ivory/60 leading-relaxed font-body">
          <div className="flex items-center gap-2 text-champagne font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-mono text-[11px] uppercase tracking-wider">Clinical Medical Disclaimer</span>
          </div>
          <p>
            Velocity Fit provides individualized clinical lifestyle, behavioral, and nutritional guidance under the supervision of Dr. Lubna Fatima. All website resources, dietary frameworks, and online pre-assessments are designed for structured health education and metabolic optimization. They do not constitute emergency medical advice, acute disease diagnosis, or hospital interventions. Always consult your primary care physician before beginning any intensive lifestyle transformation.
          </p>
        </div>

        {/* 4. Bottom Legal & Copyright Bar */}
        <div className="pt-6 border-t border-ivory/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ivory/50 font-body">
          <p className="text-center sm:text-left">
            © {currentYear} <strong className="text-ivory/80 font-medium">Velocity Fit</strong>. All clinical rights reserved.
          </p>
          <div className="flex items-center gap-4 text-center sm:text-right font-mono text-[10px] uppercase tracking-widest text-ivory/40">
            <span>The VelocityFit Formula</span>
            <span>•</span>
            <span>V6 Audit™</span>
            <span>•</span>
            <span>Hyderabad, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
