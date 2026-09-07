import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
}

export function EmptyState({
  title,
  description,
  actionText = "Explore Programs",
  actionHref = "/programs",
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4 max-w-md mx-auto space-y-4">
      <div className="size-12 rounded-full bg-olive/10 text-olive-deep flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="font-display text-2xl font-medium text-ink">{title}</h3>
      <p className="text-sm text-ink-soft leading-relaxed">{description}</p>
      {actionText && (
        <div className="pt-2">
          <Button asChild size="sm">
            <Link href={actionHref}>{actionText}</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
