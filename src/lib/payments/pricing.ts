import { ProgramTrack, SupportTier, DurationOption } from "@/types";
import { programsData } from "@/data/programs";

export interface VerifiedPricingResult {
  track: ProgramTrack;
  tier: SupportTier;
  duration: DurationOption;
  amountInr: number;
  amountInRupees: number;
  amountPaise: number; // For Razorpay (amount * 100)
  currency: "INR";
  programTitle: string;
  durationLabel: string;
}

/**
 * Single Source of Truth for verified Velocity Fit transformation pricing.
 * Pulls strictly from `src/data/programs.ts` (WooCommerce Product ID 559).
 * Guarantees that the server determines the amount, rejecting any browser tampering.
 */
export function resolveVerifiedPricing(
  track: ProgramTrack,
  tier: SupportTier,
  duration: DurationOption
): VerifiedPricingResult {
  const program = programsData.find((p) => p.track.toLowerCase() === track.toLowerCase());
  if (!program) {
    throw new Error(`Invalid program track: ${track}. Must be Flex or Grit.`);
  }

  const pricingOption = program.pricing.find(
    (pr) =>
      pr.tier.toLowerCase() === tier.toLowerCase() &&
      pr.duration.toLowerCase() === duration.toLowerCase()
  );

  if (!pricingOption) {
    throw new Error(
      `Invalid pricing tier combination: ${track} + ${tier} + ${duration}.`
    );
  }

  return {
    track: program.track,
    tier: pricingOption.tier,
    duration: pricingOption.duration,
    amountInr: pricingOption.salePrice,
    amountInRupees: pricingOption.salePrice,
    amountPaise: pricingOption.salePrice * 100,
    currency: "INR",
    programTitle: program.title,
    durationLabel: pricingOption.durationLabel,
  };
}

/**
 * Map of all verified prices for quick reference.
 */
export const VERIFIED_PRICES = {
  PRIME: {
    "1-month": 2000,
    "3-months": 5500,
  },
  ELITE: {
    "1-month": 3000,
    "3-months": 8000,
  },
} as const;
