import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "bg-ink text-paper",
        gold: "bg-champagne/25 text-ink border border-champagne/40",
        goldSolid: "bg-champagne text-ink font-semibold",
        olive: "bg-olive/15 text-olive-deep border border-olive/30",
        oliveSolid: "bg-olive text-paper font-semibold",
        dark: "bg-ink text-paper border border-white/10",
        subtle: "bg-mist text-ink-soft",
        success: "bg-green-100 text-green-800 border border-green-200",
      },
    },
    defaultVariants: {
      variant: "gold",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
