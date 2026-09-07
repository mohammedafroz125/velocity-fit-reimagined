"use client";

import * as React from "react";
import Link from "next/link";
import { Program } from "@/types";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";
import { Check, ArrowRight, Shield, Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProgramCard({ program }: { program: Program }) {
  const [selectedTier, setSelectedTier] = React.useState<"Prime" | "Elite">("Prime");
  const [selectedDuration, setSelectedDuration] = React.useState<"1-month" | "3-months">("3-months");

  // Lookup matching verified pricing option
  const activePricing =
    program.pricing.find(
      (p) => p.tier === selectedTier && p.duration === selectedDuration
    ) || program.pricing[0];

  const isFlex = program.track === "Flex";
  const isElite = selectedTier === "Elite";

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-3xl border transition-all duration-300 p-7 sm:p-9",
        isElite
          ? "bg-paper border-olive/30 shadow-card hover:border-olive/60"
          : "bg-paper/90 border-ink/10 shadow-subtle hover:border-ink/20 hover:bg-paper"
      )}
    >
      {/* Recommended Tag */}
      {selectedDuration === "3-months" && (
        <div className="absolute -top-3 right-6 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-olive text-paper text-[10px] font-mono uppercase tracking-widest font-medium shadow-sm">
            <Sparkles className="w-3 h-3" />
            <span>Recommended Value</span>
          </span>
        </div>
      )}

      {/* Card Header */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-olive-deep font-semibold">
            {program.track} Track
          </span>
          <span className="text-xs text-ink-soft/70">
            {isFlex ? "Habit & Food Freedom" : "Intensive & Metabolic Reset"}
          </span>
        </div>

        <h3 className="mt-3 font-display text-3xl font-medium text-ink">
          {program.track} Transformation
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft min-h-[44px]">
          {program.shortDescription}
        </p>

        {/* Tier Selector */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono uppercase text-[10px] tracking-wider text-ink-soft font-medium">
              Mentorship Tier:
            </span>
            <span className="text-xs text-olive-deep font-medium">
              {selectedTier === "Prime" ? "Team & Group Mentorship" : "Direct 1-on-1 with Dr. Lubna"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 p-1 bg-ivory rounded-2xl border border-ink/10">
            <button
              type="button"
              onClick={() => setSelectedTier("Prime")}
              className={cn(
                "py-2 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center space-x-1.5",
                selectedTier === "Prime"
                  ? "bg-paper text-ink shadow-sm font-semibold border border-ink/10"
                  : "text-ink-soft hover:text-ink"
              )}
            >
              <Shield className="w-3.5 h-3.5 text-olive" />
              <span>Prime</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedTier("Elite")}
              className={cn(
                "py-2 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center space-x-1.5",
                selectedTier === "Elite"
                  ? "bg-ink text-paper shadow-sm font-semibold"
                  : "text-ink-soft hover:text-ink"
              )}
            >
              <Zap className="w-3.5 h-3.5 text-champagne" />
              <span>Elite (Direct)</span>
            </button>
          </div>
        </div>

        {/* Duration Selector */}
        <div className="mt-4 space-y-2">
          <span className="block font-mono uppercase text-[10px] tracking-wider text-ink-soft font-medium">
            Program Duration:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelectedDuration("1-month")}
              className={cn(
                "p-3 rounded-2xl border text-left transition-all",
                selectedDuration === "1-month"
                  ? "border-olive bg-olive/10 text-ink"
                  : "border-ink/10 bg-paper text-ink-soft hover:border-ink/20"
              )}
            >
              <span className="block text-xs font-semibold text-ink">1 Month</span>
              <span className="block text-[11px] text-ink-soft/70">Starter phase</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedDuration("3-months")}
              className={cn(
                "p-3 rounded-2xl border text-left transition-all",
                selectedDuration === "3-months"
                  ? "border-olive bg-olive/10 text-ink"
                  : "border-ink/10 bg-paper text-ink-soft hover:border-ink/20"
              )}
            >
              <span className="block text-xs font-semibold text-ink">3 Months</span>
              <span className="block text-[11px] text-olive-deep font-medium">Full transformation</span>
            </button>
          </div>
        </div>

        {/* Verified Pricing Presentation */}
        <div className="mt-6 p-5 rounded-2xl bg-ivory/90 border border-ink/10 space-y-1">
          <div className="flex items-baseline space-x-2">
            <span className="font-display text-4xl font-semibold text-ink">
              {formatINR(activePricing.salePrice)}
            </span>
            {activePricing.regularPrice > activePricing.salePrice && (
              <span className="text-sm text-ink-soft/60 line-through">
                {formatINR(activePricing.regularPrice)}
              </span>
            )}
            <span className="text-xs text-ink-soft font-medium">
              / {selectedDuration === "1-month" ? "1 Month" : "3 Months"}
            </span>
          </div>
          <p className="text-xs text-ink-soft leading-relaxed pt-1">
            Includes {selectedTier} clinical protocol & V6 Audit™ personalization under Dr. Lubna Fatima.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="mt-6 space-y-2.5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft/70 font-semibold">
            Protocol Inclusions
          </p>
          <ul className="space-y-2 text-xs text-ink-soft">
            {program.features.slice(0, 4).map((feature) => (
              <li key={feature} className="flex items-start space-x-2">
                <Check className="w-3.5 h-3.5 text-olive flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Card Actions */}
      <div className="mt-8 pt-4 border-t border-ink/10 space-y-3">
        <Button asChild size="lg" fullWidth>
          <Link
            href={`/checkout?track=${program.track}&tier=${selectedTier}&duration=${selectedDuration}`}
            className="flex items-center justify-center gap-2 font-medium"
          >
            <span>Enroll in {program.track} ({formatINR(activePricing.salePrice)})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
        <div className="flex items-center justify-between text-xs px-1">
          <Link
            href={`/programs/${program.slug}`}
            className="text-ink-soft hover:text-ink font-medium underline-offset-4 hover:underline"
          >
            Read Track Overview
          </Link>
          <Link
            href={`/book-consultation?program=${encodeURIComponent(program.title)}`}
            className="text-olive-deep hover:text-ink font-medium flex items-center gap-1"
          >
            <span>Book Consultation</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
