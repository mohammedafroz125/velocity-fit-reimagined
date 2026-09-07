import { Loader2 } from "lucide-react";

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-ink-soft">
      <Loader2 className="w-7 h-7 animate-spin text-olive-deep" />
      <span className="font-mono text-xs uppercase tracking-wider">{message}</span>
    </div>
  );
}
