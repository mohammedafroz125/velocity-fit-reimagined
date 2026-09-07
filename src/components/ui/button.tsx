import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer gap-2",
  {
    variants: {
      variant: {
        default: "bg-ink text-paper hover:bg-ink-soft shadow-subtle",
        gold: "bg-ink text-paper hover:bg-ink-soft shadow-subtle",
        goldOutline:
          "border border-ink/15 bg-transparent text-ink hover:bg-paper font-medium",
        outline:
          "border border-ink/15 bg-transparent text-ink hover:bg-paper hover:border-ink/30 font-medium",
        inverse: "bg-paper text-ink hover:bg-ivory shadow-subtle font-medium",
        glass:
          "border border-ivory/20 bg-ivory/10 text-ivory backdrop-blur hover:bg-ivory/20 font-medium",
        olive: "bg-olive text-paper hover:bg-olive-deep shadow-subtle",
        dark: "bg-ink text-paper hover:bg-ink-soft shadow-dark font-medium border border-white/10",
        darkOutline:
          "border border-ivory/20 text-ivory hover:bg-ivory/10 font-medium",
        secondary:
          "bg-paper text-ink hover:bg-mist/80 border border-ink/10 shadow-subtle font-medium",
        ghost:
          "text-ink hover:bg-paper/70 font-medium",
        ghostLight:
          "text-ivory hover:bg-ivory/10 font-medium",
        link: "text-olive-deep hover:underline p-0 h-auto font-normal",
      },
      size: {
        sm: "h-9 min-h-[36px] px-4 text-xs",
        md: "h-11 min-h-[44px] px-6 text-sm",
        lg: "h-13 min-h-[52px] px-8 text-base font-medium",
        icon: "h-11 w-11 min-h-[44px] min-w-[44px] p-0 rounded-full",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, fullWidth, className }));
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
        className: cn(classes, (children as React.ReactElement<{ className?: string }>).props.className),
        ...props,
      });
    }
    return (
      <button
        className={classes}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
