"use client";

import * as React from "react";
import { ChevronDown, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
  variant?: "light" | "dark" | "warm" | "editorial";
}

export function AccordionItem({
  question,
  answer,
  isOpen = false,
  onToggle,
  className,
  variant = "editorial",
}: AccordionItemProps) {
  if (variant === "editorial") {
    return (
      <div className={cn("border-b border-ink/10 transition-colors py-1", className)}>
        <button
          type="button"
          onClick={onToggle}
          className="w-full text-left py-5 flex items-center justify-between gap-4 font-display text-xl md:text-2xl font-medium text-ink transition-colors hover:text-olive-deep focus:outline-none"
          aria-expanded={isOpen}
        >
          <span>{question}</span>
          <span className="flex-shrink-0 size-8 rounded-full border border-ink/15 flex items-center justify-center text-ink-soft transition-transform">
            {isOpen ? <Minus className="size-4 text-olive-deep" /> : <Plus className="size-4" />}
          </span>
        </button>
        {isOpen && (
          <div className="pb-6 pr-8 text-base md:text-lg leading-relaxed text-ink-soft animate-in fade-in slide-in-from-top-1 duration-200">
            {answer}
          </div>
        )}
      </div>
    );
  }

  const isDark = variant === "dark";
  const isWarm = variant === "warm";

  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-200 overflow-hidden",
        isDark
          ? "bg-ink text-paper border-white/10"
          : isWarm
          ? "bg-paper border-ink/10 shadow-subtle"
          : "bg-paper border-ink/10 shadow-subtle",
        isOpen && (isDark ? "border-champagne/40" : "border-olive/40 shadow-card"),
        className
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "w-full text-left p-6 flex items-center justify-between gap-4 font-display text-lg md:text-xl transition-colors focus:outline-none",
          isDark ? "text-ivory" : "text-ink"
        )}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <ChevronDown
          className={cn(
            "w-5 h-5 flex-shrink-0 text-olive transition-transform duration-200",
            isOpen && "transform rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div
          className={cn(
            "px-6 pb-6 pt-1 text-sm md:text-base leading-relaxed border-t",
            isDark
              ? "text-ivory/70 border-white/10"
              : "text-ink-soft border-ink/10"
          )}
        >
          {answer}
        </div>
      )}
    </div>
  );
}
