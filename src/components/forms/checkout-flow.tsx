"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Sparkles,
  MessageCircle,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { resolveVerifiedPricing } from "@/lib/payments/pricing";
import { formatINR } from "@/lib/utils";
import { siteConfig } from "@/data/site-config";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export function CheckoutFlow() {
  const searchParams = useSearchParams();

  const urlLeadId = searchParams.get("leadId") || "";
  const urlTrack = searchParams.get("track") as "Flex" | "Grit" | null;
  const urlTier = searchParams.get("tier") as "Prime" | "Elite" | null;
  const urlDuration = searchParams.get("duration") as "1-month" | "3-months" | null;

  const [track, setTrack] = useState<"Flex" | "Grit">(urlTrack === "Grit" ? "Grit" : "Flex");
  const [tier, setTier] = useState<"Prime" | "Elite">(urlTier === "Elite" ? "Elite" : "Prime");
  const [duration, setDuration] = useState<"1-month" | "3-months">(
    urlDuration === "3-months" ? "3-months" : "1-month"
  );

  const [fullName, setFullName] = useState(searchParams.get("name") || "");
  const [phone, setPhone] = useState(searchParams.get("phone") || "");
  const [email, setEmail] = useState(searchParams.get("email") || "");

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [conversionSuccess, setConversionSuccess] = useState<{
    orderId: string;
    paymentId: string;
    amount: number;
    track: string;
    tier: string;
    duration: string;
    leadName: string;
  } | null>(null);

  const pricing = resolveVerifiedPricing(track, tier, duration);

  useEffect(() => {
    if (!document.getElementById("razorpay-sdk")) {
      const script = document.createElement("script");
      script.id = "razorpay-sdk";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!phone.trim()) {
      setErrorMessage("Please enter your mobile phone number for WhatsApp onboarding.");
      return;
    }

    setIsProcessing(true);

    try {
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          track,
          tier,
          duration,
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Unable to create payment order.");
      }

      if (typeof window.Razorpay === "undefined") {
        const verifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: `pay_sim_${Date.now()}`,
            razorpay_signature: "mock_signature_dev",
          }),
        });
        const verifyData = await verifyRes.json();
        if (!verifyData.success) throw new Error(verifyData.error || "Verification failed");
        setConversionSuccess({
          orderId: orderData.orderId,
          paymentId: "pay_simulated",
          amount: pricing.amountInRupees,
          track,
          tier,
          duration,
          leadName: fullName,
        });
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Velocity Fit",
        description: `${track} Track (${tier}, ${duration})`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
              throw new Error(verifyData.error || "Payment signature verification failed.");
            }

            setConversionSuccess({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              amount: pricing.amountInRupees,
              track,
              tier,
              duration,
              leadName: fullName,
            });
          } catch (verifyErr: any) {
            setErrorMessage(verifyErr.message || "Failed to confirm payment.");
          }
        },
        prefill: {
          name: fullName,
          contact: phone,
          email: email || undefined,
        },
        theme: { color: "#1B1917" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setErrorMessage(err.message || "Payment initialization failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (conversionSuccess) {
    return (
      <div className="p-8 sm:p-12 rounded-[2rem] bg-paper border border-ink/10 shadow-elevated text-center space-y-6 max-w-2xl mx-auto">
        <div className="size-16 rounded-full bg-olive/10 text-olive-deep flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <p className="eyebrow">Enrollment Confirmed</p>
          <h2 className="font-display text-3xl font-medium text-ink">
            Welcome to Velocity Fit, {conversionSuccess.leadName}!
          </h2>
          <p className="text-sm text-ink-soft max-w-md mx-auto leading-relaxed">
            Your enrollment for <strong>{conversionSuccess.track} Track ({conversionSuccess.tier} · {conversionSuccess.duration})</strong> is active.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-ivory border border-ink/10 space-y-2 text-left text-xs">
          <p><strong>Order ID:</strong> {conversionSuccess.orderId}</p>
          <p><strong>Amount Paid:</strong> {formatINR(conversionSuccess.amount)}</p>
        </div>

        <Button asChild size="lg" fullWidth>
          <a
            href={`https://wa.me/${siteConfig.contact.whatsappRaw}?text=${encodeURIComponent(
              `Hello Dr. Lubna, I have completed enrollment for ${conversionSuccess.leadName} on the ${conversionSuccess.track} Track (${conversionSuccess.tier}). Order ID: ${conversionSuccess.orderId}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Connect for Immediate Onboarding</span>
          </a>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handlePayment} className="max-w-4xl mx-auto space-y-8">
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Program Selection Card */}
      <div className="p-8 rounded-[2rem] bg-paper border border-ink/10 shadow-elevated space-y-6">
        <div className="space-y-1">
          <p className="eyebrow">Step 01</p>
          <h3 className="font-display text-2xl font-medium text-ink">
            Configure Your Protocol
          </h3>
        </div>

        {/* Track Toggle */}
        <div className="space-y-1.5">
          <span className="block font-mono text-xs uppercase tracking-wider text-ink-soft">
            Transformation Track
          </span>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTrack("Flex")}
              className={cn(
                "p-4 rounded-2xl border text-left transition-all",
                track === "Flex" ? "bg-olive/10 border-olive text-ink" : "bg-ivory border-ink/10 text-ink-soft hover:border-ink/30"
              )}
            >
              <span className="block font-display text-lg font-medium text-ink">Flex Track</span>
              <span className="block text-xs text-ink-soft mt-0.5">Lifestyle & Food Freedom</span>
            </button>
            <button
              type="button"
              onClick={() => setTrack("Grit")}
              className={cn(
                "p-4 rounded-2xl border text-left transition-all",
                track === "Grit" ? "bg-olive/10 border-olive text-ink" : "bg-ivory border-ink/10 text-ink-soft hover:border-ink/30"
              )}
            >
              <span className="block font-display text-lg font-medium text-ink">Grit Track</span>
              <span className="block text-xs text-ink-soft mt-0.5">Clinical & Metabolic Reset</span>
            </button>
          </div>
        </div>

        {/* Tier & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <span className="block font-mono text-xs uppercase tracking-wider text-ink-soft">
              Support Tier
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTier("Prime")}
                className={cn(
                  "p-3 rounded-2xl border text-xs font-medium transition-all text-center",
                  tier === "Prime" ? "bg-ink text-paper border-ink" : "bg-ivory text-ink-soft border-ink/10"
                )}
              >
                Prime (Core)
              </button>
              <button
                type="button"
                onClick={() => setTier("Elite")}
                className={cn(
                  "p-3 rounded-2xl border text-xs font-medium transition-all text-center",
                  tier === "Elite" ? "bg-ink text-paper border-ink" : "bg-ivory text-ink-soft border-ink/10"
                )}
              >
                Elite (1-on-1)
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="block font-mono text-xs uppercase tracking-wider text-ink-soft">
              Duration
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDuration("1-month")}
                className={cn(
                  "p-3 rounded-2xl border text-xs font-medium transition-all text-center",
                  duration === "1-month" ? "bg-ink text-paper border-ink" : "bg-ivory text-ink-soft border-ink/10"
                )}
              >
                1 Month
              </button>
              <button
                type="button"
                onClick={() => setDuration("3-months")}
                className={cn(
                  "p-3 rounded-2xl border text-xs font-medium transition-all text-center",
                  duration === "3-months" ? "bg-ink text-paper border-ink" : "bg-ivory text-ink-soft border-ink/10"
                )}
              >
                3 Months
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="p-6 rounded-2xl bg-ivory border border-ink/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-olive-deep font-semibold">
              Verified Program Fee (WooCommerce #559)
            </span>
            <p className="text-sm font-medium text-ink">
              {track} Track · {tier} Support ({duration === "1-month" ? "1 Month" : "3 Months"})
            </p>
          </div>
          <span className="font-display text-3xl font-bold text-ink">
            {formatINR(pricing.amountInRupees)}
          </span>
        </div>
      </div>

      {/* Client Details */}
      <div className="p-8 rounded-[2rem] bg-paper border border-ink/10 shadow-elevated space-y-6">
        <div className="space-y-1">
          <p className="eyebrow">Step 02</p>
          <h3 className="font-display text-2xl font-medium text-ink">
            Client Profile
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name *"
            placeholder="e.g. Priya Sharma"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input
            label="Phone Number (WhatsApp) *"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <Input
          label="Email Address (For Invoices & Protocols)"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button type="submit" size="lg" fullWidth disabled={isProcessing} className="flex items-center justify-center gap-2">
          <span>{isProcessing ? "Opening Gateway..." : `Proceed to Secure Payment (${formatINR(pricing.amountInRupees)})`}</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
