/**
 * Velocity Fit - Unified TypeScript Data Models
 */

export type ProgramTrack = "Flex" | "Grit";
export type SupportTier = "Prime" | "Elite";
export type DurationOption = "1-month" | "3-months";

export interface PricingTier {
  tier: SupportTier;
  duration: DurationOption;
  durationLabel: string;
  regularPrice: number;
  salePrice: number;
  isPopular?: boolean;
}

export interface Program {
  id: string;
  slug: string;
  title: string;
  track: ProgramTrack;
  tagline: string;
  shortDescription: string;
  fullDescription: string[];
  features: string[];
  bestFor: string[];
  pricing: PricingTier[];
  isFeatured?: boolean;
}

export interface FAQItem {
  id: string;
  category: "Clinical" | "Programs" | "Diet & Lifestyle" | "Logistics & Consultation";
  question: string;
  answer: string;
}

export interface GoalChoice {
  id: string;
  title: string;
  description: string;
  recommendedProgramSlug?: string;
  iconName?: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  location: string;
  programEnrolled: string;
  durationWeeks?: number;
  quote: string;
  storySnippet?: string;
  isVerified: boolean;
  isPlaceholder?: boolean;
}

export interface LeadAttribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrer?: string;
  firstLandingPage?: string;
  device?: string;
  capturedAt: string;
}

export interface AssessmentSubmission {
  // Step 1: Demographics
  fullName: string;
  age: number | string;
  gender: "Male" | "Female" | "Rather not specify";
  city?: string;
  phone: string;
  email: string;

  // Step 2: Body & Goals
  heightCm: number | string;
  currentWeightKg: number | string;
  highestWeightKg?: number | string;
  targetWeightKg: number | string;
  targetTimeframe: "1 Months" | "2 Months" | "3 Months" | "6 Months";
  mainGoals: string[];

  // Step 3: Medical Background
  medicalConditions: string[];
  otherConditionMedications?: string;
  isOnLongTermMedications: "Yes" | "No";
  longTermMedicationsDetails?: string;
  hasPastSurgeries: "Yes" | "No";
  pastSurgeriesDetails?: string;
  femaleMarkers?: string[];

  // Step 4: Lifestyle & Habits (V6 Audit™ Foundation)
  dailyWaterLiters: number | string;
  sleepHours: number | string;
  bowelMovement?: "Daily" | "Alternate days" | "Constipation" | "Loose";
  eatingPatterns: string[];
  previousDietAttempts?: string;
  biggestStruggle?: string;

  // Step 5: Readiness & Attribution
  seriousnessScale: number; // 1-10
  lifeChangeVision?: string;
  pastRoadblocks?: string;
  readyFor60DaysCommitment: "Yes" | "No" | "Not Sure";
  referralSource: string;

  // Metadata
  attribution?: LeadAttribution;
}

export interface ContactSubmission {
  fullName: string;
  phone: string;
  email: string;
  primaryGoal: string;
  message?: string;
  preferredContactMethod: "WhatsApp" | "Phone Call" | "Email";
  attribution?: LeadAttribution;
}

export interface SiteConfig {
  brandName: string;
  tagline: string;
  missionStatement: string;
  founder: {
    name: string;
    title: string;
    bio: string;
    credentialsPlaceholder: string;
    knownWording: string[];
  };
  contact: {
    phoneDisplay: string;
    phoneRaw: string;
    whatsappDisplay: string;
    whatsappRaw: string;
    whatsappGreeting: string;
    email: string;
    location: string;
    state: string;
    country: string;
    physicalAddressPlaceholder: string;
  };
  socialLinks: {
    instagram: string;
    whatsapp: string;
  };
  placeholders: {
    clinicalCredentials: string;
    physicalClinicAddress: string;
    patientCaseStudies: string;
    merchantPaymentGateway: string;
  };
}

export * from "./crm";

