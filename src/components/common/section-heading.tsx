import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  variant?: "light" | "dark" | "warm";
  className?: string;
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  align = "left",
  variant = "light",
  className,
}: SectionHeadingProps) {
  const isDark = variant === "dark";
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "space-y-3 max-w-3xl",
        isCenter ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {badge && (
        <p className={cn("eyebrow", isDark && "text-champagne")}>
          {badge}
        </p>
      )}
      <h2
        className={cn(
          "font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight leading-[1.12]",
          isDark ? "text-ivory" : "text-ink"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "text-base sm:text-lg leading-relaxed pt-1",
            isDark ? "text-ivory/70" : "text-ink-soft"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
