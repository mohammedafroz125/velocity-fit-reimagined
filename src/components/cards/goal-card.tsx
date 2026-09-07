import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GoalCardProps {
  id?: string;
  number?: string;
  title: string;
  description: string;
  targetHref?: string;
  icon?: "weight-loss" | "weight-management" | "nutrition" | "lifestyle" | "unsure";
}

export function GoalCard({
  number = "01",
  title,
  description,
  targetHref,
}: GoalCardProps) {
  const destination = targetHref || `/get-started?goal=${encodeURIComponent(title)}`;

  return (
    <Link
      href={destination}
      className={cn(
        "group flex min-h-52 flex-col justify-between rounded-3xl border border-ink/10 bg-paper/80 p-7 transition duration-300 hover:-translate-y-1 hover:border-olive/50 hover:bg-paper hover:shadow-card focus:outline-none"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-ink-soft/60 tracking-wider">
          {number}
        </span>
        <ArrowRight className="size-4 -translate-x-2 opacity-0 text-olive-deep transition group-hover:translate-x-0 group-hover:opacity-100" />
      </div>
      <div>
        <h3 className="font-display text-2xl font-medium text-ink group-hover:text-olive-deep transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {description}
        </p>
      </div>
    </Link>
  );
}
