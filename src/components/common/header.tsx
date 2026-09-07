"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, MessageSquareQuote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/site-config";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: "Programs", href: "/programs" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "About Founder", href: "/about" },
    { label: "Results", href: "/results" },
    { label: "FAQ", href: "/faq" },
    { label: "Resources", href: "/resources" },
    { label: "Contact", href: "/contact" },
  ];

  const handleWhatsAppClick = () => {
    trackEvent("whatsapp_click", { location: "header" });
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        isScrolled
          ? "bg-ivory/90 backdrop-blur-xl border-ink/10 py-3 shadow-subtle"
          : "bg-ivory/80 backdrop-blur-md border-ink/5 py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 flex items-center justify-between">
        {/* Editorial Brand Logo */}
        <Link
          href="/"
          className="flex items-baseline gap-2 group focus:outline-none rounded-lg p-1"
          aria-label="Velocity Fit Home"
        >
          <span className="font-display text-2xl font-semibold tracking-tight text-ink">
            Velocity
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-olive-deep font-medium">
            Fit
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-7" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm transition-colors duration-200 py-1 font-medium",
                  isActive
                    ? "text-ink font-semibold border-b-2 border-olive"
                    : "text-ink-soft/80 hover:text-ink"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Group */}
        <div className="hidden sm:flex items-center space-x-3">
          <a
            href={siteConfig.socialLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="flex items-center space-x-1.5 text-xs text-ink-soft hover:text-ink font-medium px-3 py-2 rounded-full hover:bg-mist/50 transition-colors"
          >
            <MessageSquareQuote className="w-3.5 h-3.5 text-olive-deep" />
            <span>WhatsApp</span>
          </a>
          <Button
            asChild
            size="sm"
            onClick={() => trackEvent("cta_click", { location: "header_start_journey" })}
          >
            <Link href="/get-started">
              Start Your Journey <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-full text-ink hover:bg-mist/60 transition-colors focus:outline-none"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[65px] z-50 min-h-[calc(100dvh-65px)] bg-ivory px-6 py-8 lg:hidden flex flex-col justify-between overflow-y-auto border-t border-ink/10 animate-in fade-in duration-200">
          <nav className="flex flex-col" aria-label="Mobile Navigation">
            {navLinks.map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between border-b border-ink/10 py-4 font-display text-2xl transition-colors",
                    isActive ? "text-olive-deep font-semibold" : "text-ink hover:text-olive-deep"
                  )}
                >
                  <span>{link.label}</span>
                  <span className="font-mono text-xs text-olive">0{i + 1}</span>
                </Link>
              );
            })}
          </nav>
          <div className="pt-8 pb-4 flex flex-col space-y-3">
            <Button asChild size="lg" fullWidth onClick={() => setMobileMenuOpen(false)}>
              <Link href="/get-started">
                Start Your Journey <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <a
              href={siteConfig.socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="flex items-center justify-center space-x-2 w-full py-3 rounded-full border border-ink/15 text-sm font-medium text-ink hover:bg-paper transition-colors"
            >
              <MessageSquareQuote className="w-4 h-4 text-olive-deep" />
              <span>Connect with Dr. Lubna on WhatsApp</span>
            </a>
            <p className="text-center font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/60 pt-2">
              Clinical Nutrition · Hyderabad, India
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
