import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-ivory px-5 text-ink">
      <div className="max-w-md text-center space-y-5">
        <span className="font-display text-8xl font-semibold text-olive-deep/30">404</span>
        <h1 className="font-display text-3xl font-medium text-ink">Page Not Found</h1>
        <p className="text-sm text-ink-soft leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="pt-4">
          <Button asChild size="lg">
            <Link href="/">Return to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
