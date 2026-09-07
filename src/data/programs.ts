import { Program } from "@/types";

/**
 * SOURCE DATA RECORD:
 * Program and pricing data verified directly from WooCommerce Product ID 559
 * URL: https://velocityfit.in/product/velocityfit-transformation/
 * Product Name: "VELOCITYFIT TRANSFORMATION"
 * Attributes:
 * - Program: flex, grit
 * - Support: prime, elite
 * - Duration: 1-month, 3-months
 *
 * All pricing is preserved strictly as configured on the live store without invention.
 */

export const programsData: Program[] = [
  {
    id: "prog-flex",
    slug: "flex",
    title: "VELOCITYFIT TRANSFORMATION — Flex Track",
    track: "Flex",
    tagline: "Sustainable metabolic fat loss adapted to your daily lifestyle & food preferences.",
    shortDescription:
      "A clinical nutrition protocol designed for working professionals, parents, and individuals seeking steady fat loss without giving up social meals or cultural foods.",
    fullDescription: [
      "The Flex track is engineered to eliminate the stress of traditional restrictive dieting. Using Dr. Lubna Fatima's VelocityFit Formula, we analyze your current metabolic baseline through the V6 Audit™ and craft a personalized dietary strategy that integrates seamlessly into your daily routine.",
      "Rather than forcing you into rigid meal patterns, Flex teaches metabolic flexibility—allowing your body to optimize fat oxidation while sustaining high energy throughout the day.",
      "Weekly reviews ensure continuous fat loss while fine-tuning macronutrient balance to protect lean mass and balance hormonal markers.",
    ],
    features: [
      "Personalized Medical-Grade Nutrition Plan",
      "V6 Audit™ Lifestyle & Metabolic Baseline Evaluation",
      "Weekly Progress Assessments & Macro Adjustments",
      "Direct WhatsApp Clinical Support (Prime / Elite Tiers)",
      "Dining Out & Travel Guidelines",
      "Habit Engineering & Sustainable Maintenance Blueprint",
    ],
    bestFor: [
      "Individuals with busy work schedules or frequent travel",
      "Those who have experienced rebound weight gain from crash diets",
      "Mild to moderate weight loss goals (5kg – 15kg)",
      "Anyone desiring food freedom with clinical accountability",
    ],
    pricing: [
      {
        tier: "Prime",
        duration: "1-month",
        durationLabel: "1 Month Starter",
        regularPrice: 2000,
        salePrice: 2000,
        isPopular: false,
      },
      {
        tier: "Prime",
        duration: "3-months",
        durationLabel: "3 Months Transformation",
        regularPrice: 6000,
        salePrice: 5500,
        isPopular: true,
      },
      {
        tier: "Elite",
        duration: "1-month",
        durationLabel: "1 Month Elite Mentorship",
        regularPrice: 3000,
        salePrice: 3000,
        isPopular: false,
      },
      {
        tier: "Elite",
        duration: "3-months",
        durationLabel: "3 Months Elite Intensive",
        regularPrice: 9000,
        salePrice: 8000,
        isPopular: false,
      },
    ],
    isFeatured: true,
  },
  {
    id: "prog-grit",
    slug: "grit",
    title: "VELOCITYFIT TRANSFORMATION — Grit Track",
    track: "Grit",
    tagline: "High-accountability clinical protocol for stubborn fat, obesity reversal & metabolic reset.",
    shortDescription:
      "A focused, physician-guided protocol for clients managing metabolic conditions (PCOS, Thyroid, Insulin Resistance, Fatty Liver) or seeking aggressive, disciplined fat loss.",
    fullDescription: [
      "The Grit track is for individuals ready to make an uncompromising commitment to their health transformation under Dr. Lubna Fatima's direct supervision.",
      "Grit is designed for clinical cases where standard dieting has stalled due to underlying hormonal resistance, chronic inflammation, or metabolic slowdown.",
      "With high-touch daily accountability, targeted hydration strategies, and precision micronutrient timing, Grit creates rapid, observable momentum while safeguarding metabolic rate.",
    ],
    features: [
      "Advanced Clinical Nutrition Protocol for Metabolic Health",
      "Comprehensive V6 Audit™ Medical & Hormonal Review",
      "Frequent Bi-Weekly Clinical Check-ins & Review",
      "Daily Accountability & Food Log Tracking",
      "PCOS, Thyroid & Pre-Diabetes Nutritional Integration",
      "Priority Access to Dr. Lubna Fatima's Clinical Team",
    ],
    bestFor: [
      "Clients managing diagnosed metabolic challenges (PCOS, Thyroid, Fatty Liver)",
      "High visceral fat or significant weight to lose (>15kg)",
      "Individuals needing daily structure and disciplined accountability",
      "Those who need clinical oversight paired with nutrition science",
    ],
    pricing: [
      {
        tier: "Prime",
        duration: "1-month",
        durationLabel: "1 Month Starter",
        regularPrice: 2000,
        salePrice: 2000,
        isPopular: false,
      },
      {
        tier: "Prime",
        duration: "3-months",
        durationLabel: "3 Months Transformation",
        regularPrice: 6000,
        salePrice: 5500,
        isPopular: false,
      },
      {
        tier: "Elite",
        duration: "1-month",
        durationLabel: "1 Month Elite Mentorship",
        regularPrice: 3000,
        salePrice: 3000,
        isPopular: false,
      },
      {
        tier: "Elite",
        duration: "3-months",
        durationLabel: "3 Months Elite Intensive",
        regularPrice: 9000,
        salePrice: 8000,
        isPopular: true,
      },
    ],
    isFeatured: true,
  },
];

export function getProgramBySlug(slug: string): Program | undefined {
  return programsData.find((p) => p.slug === slug);
}
