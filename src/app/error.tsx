"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-ivory px-4 py-16">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-medium text-ink">
            Something went wrong
          </h1>
          <p className="text-sm text-ink-soft leading-relaxed">
            An unexpected error occurred while loading this page. Please try refreshing or return to the homepage.
          </p>
        </div>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Button variant="default" onClick={() => reset()}>
            Try Again
          </Button>
          <Button asChild variant="secondary">
            <Link href="/">Go to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
