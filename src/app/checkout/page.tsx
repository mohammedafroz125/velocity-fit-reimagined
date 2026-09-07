import React, { Suspense } from "react";
import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { CheckoutFlow } from "@/components/forms/checkout-flow";
import { LoadingState } from "@/components/common/loading-state";

export const metadata: Metadata = generateSeoMetadata({
  title: "Enroll in Velocity Fit Program | Secure Checkout",
  description:
    "Secure enrollment checkout for Velocity Flex & Grit nutrition programs by Dr. Lubna Fatima. Verified transparent pricing, encrypted gateway.",
  path: "/checkout",
});

export default function CheckoutPage() {
  return (
    <div className="flex flex-col w-full bg-ivory text-ink">
      {/* 1. Header Banner */}
      <section className="py-16 border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 space-y-4">
          <Breadcrumbs items={[{ label: "Programs", href: "/programs" }, { label: "Checkout" }]} />
          <div className="space-y-3 max-w-3xl">
            <p className="eyebrow">Encrypted Direct Enrollment</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink leading-tight">
              Complete Your Program Enrollment
            </h1>
            <p className="text-lg text-ink-soft leading-relaxed">
              Select your preferred program track and support tier. Secure checkout with instant doctor onboarding on WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Checkout Experience */}
      <section className="bg-paper py-16 lg:py-24 border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <Suspense fallback={<LoadingState message="Loading secure checkout..." />}>
            <CheckoutFlow />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
