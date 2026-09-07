import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps {
  id?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label: string;
  description?: string;
  className?: string;
}

export function Checkbox({
  id,
  checked = false,
  onChange,
  label,
  description,
  className,
}: CheckboxProps) {
  const checkboxId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label
      htmlFor={checkboxId}
      className={cn(
        "flex items-start space-x-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none",
        checked
          ? "border-champagne/80 bg-champagne/10 shadow-sm"
          : "border-ink/15 bg-paper hover:bg-ivory",
        className
      )}
    >
      <input
        type="checkbox"
        id={checkboxId}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="sr-only"
      />
      <div
        className={cn(
          "w-5 h-5 rounded-md border flex items-center justify-center transition-colors flex-shrink-0 mt-0.5",
          checked
            ? "bg-olive-deep border-olive-deep text-ivory"
            : "border-ink/20 bg-ivory"
        )}
      >
        {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </div>
      <div className="space-y-0.5">
        <span className="text-sm font-medium text-ink block leading-snug">
          {label}
        </span>
        {description && (
          <span className="text-xs text-ink-soft block leading-normal">
            {description}
          </span>
        )}
      </div>
    </label>
  );
}
