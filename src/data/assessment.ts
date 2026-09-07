/**
 * VelocityFit Pre-Signup Health Assessment Form Schema
 * Faithfully extracted from the verified FluentForms configuration on velocityfit.in
 */

export interface AssessmentStepConfig {
  step: number;
  title: string;
  subtitle: string;
  description: string;
}

export const ASSESSMENT_STEPS: AssessmentStepConfig[] = [
  {
    step: 1,
    title: "Personal Profile",
    subtitle: "Basic Demographics",
    description: "Tell us about yourself so we can personalize your health recommendations.",
  },
  {
    step: 2,
    title: "Body & Goals Snapshot",
    subtitle: "📏 Measurements & Objectives",
    description: "Your baseline physical metrics and what you desire to achieve.",
  },
  {
    step: 3,
    title: "Medical & Clinical Background",
    subtitle: "🧠 Health Evaluation",
    description: "Important health conditions to ensure medical-grade safety.",
  },
  {
    step: 4,
    title: "Lifestyle & Habits",
    subtitle: "🥗 V6 Audit™ Foundation",
    description: "Evaluating hydration, sleep, eating patterns, and digestive health.",
  },
  {
    step: 5,
    title: "Readiness & Commitment",
    subtitle: "💬 Taking Action",
    description: "Setting expectations for a sustainable, doctor-led transformation.",
  },
];

export const GOAL_OPTIONS = [
  "Weight loss",
  "Fat loss + inch loss",
  "Metabolic health",
  "Fertility / Hormonal balance",
  "Diabetes reversal",
  "PCOS / Thyroid",
  "Maintenance / Lifestyle reset",
];

export const MEDICAL_CONDITION_OPTIONS = [
  "None",
  "Diabetes",
  "BP (Hypertension)",
  "Thyroid",
  "PCOS",
  "Fatty liver",
  "Kidney",
  "Heart",
  "Other",
];

export const FEMALE_MARKER_OPTIONS = [
  "None",
  "PCOS",
  "Irregular periods",
  "Fertility concerns",
  "Menopause",
];

export const EATING_PATTERN_OPTIONS = [
  "Frequent snacking",
  "Emotional eating",
  "Night eating",
  "Long gaps",
  "Structured meals",
];

export const BOWEL_MOVEMENT_OPTIONS = [
  "Daily",
  "Alternate days",
  "Constipation",
  "Loose",
];

export const TIMEFRAME_OPTIONS = [
  "1 Months",
  "2 Months",
  "3 Months",
  "6 Months",
];

export const REFERRAL_SOURCES = [
  "Instagram",
  "Friend",
  "Doctor",
  "Google",
  "Event",
  "Other",
];
