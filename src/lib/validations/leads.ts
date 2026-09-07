import { z } from "zod";

/**
 * Normalizes phone numbers to standard numeric strings (removes spaces, dashes, parentheses).
 */
export function normalizePhone(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, "");
  // If Indian 10-digit number without country code, prefix with 91 for uniform matching
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

/**
 * Basic string sanitization to prevent XSS / malicious control characters.
 */
export function sanitizeText(input?: string | null): string {
  if (!input) return "";
  return input
    .trim()
    .replace(/[<>]/g, "") // Strip HTML tags
    .slice(0, 2000); // Guard maximum payload length
}

// ---------------------------------------------------------------------------
// Contact Form Schema
// ---------------------------------------------------------------------------
export const contactSubmissionSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full Name must be at least 2 characters")
    .max(100, "Full Name cannot exceed 100 characters")
    .transform((val) => sanitizeText(val)),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number is too long")
    .refine((val) => {
      const digits = val.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 15;
    }, "Please provide a valid 10-digit telephone number"),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .optional()
    .or(z.literal("")),
  primaryGoal: z
    .string()
    .min(1, "Please select or enter your primary health goal")
    .transform((val) => sanitizeText(val)),
  message: z
    .string()
    .max(1500, "Message cannot exceed 1500 characters")
    .optional()
    .transform((val) => sanitizeText(val)),
  preferredContactMethod: z
    .enum(["WhatsApp", "Phone Call", "Email"])
    .default("WhatsApp"),
  website_honey: z.string().optional(),
  attribution: z
    .object({
      utmSource: z.string().optional(),
      utmMedium: z.string().optional(),
      utmCampaign: z.string().optional(),
      utmContent: z.string().optional(),
      utmTerm: z.string().optional(),
      referrer: z.string().optional(),
      firstLandingPage: z.string().optional(),
      device: z.string().optional(),
      capturedAt: z.string().optional(),
    })
    .optional(),
});

export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;

// ---------------------------------------------------------------------------
// Assessment Form Schema
// ---------------------------------------------------------------------------
export const assessmentSubmissionSchema = z.object({
  // Step 1: Demographics
  fullName: z
    .string()
    .min(2, "Full Name must be at least 2 characters")
    .max(100, "Full Name cannot exceed 100 characters")
    .transform((val) => sanitizeText(val)),
  age: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 12 && val <= 100, "Age must be between 12 and 100"),
  gender: z.enum(["Male", "Female", "Rather not specify"]),
  city: z
    .string()
    .max(100)
    .optional()
    .transform((val) => sanitizeText(val)),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number is too long")
    .refine((val) => {
      const digits = val.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 15;
    }, "Please provide a valid 10-digit telephone number"),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address"),

  // Step 2: Body & Goals
  heightCm: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 80 && val <= 250, "Height must be between 80 and 250 cm"),
  currentWeightKg: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 25 && val <= 350, "Current weight must be between 25 and 350 kg"),
  highestWeightKg: z
    .union([z.number(), z.string()])
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  targetWeightKg: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 25 && val <= 250, "Target weight must be between 25 and 250 kg"),
  targetTimeframe: z.enum(["1 Months", "2 Months", "3 Months", "6 Months"]),
  mainGoals: z
    .array(z.string())
    .min(1, "Please select at least one primary transformation goal"),

  // Step 3: Medical Background
  medicalConditions: z.array(z.string()).default([]),
  otherConditionMedications: z
    .string()
    .optional()
    .transform((val) => sanitizeText(val)),
  isOnLongTermMedications: z.enum(["Yes", "No"]).default("No"),
  longTermMedicationsDetails: z
    .string()
    .optional()
    .transform((val) => sanitizeText(val)),
  hasPastSurgeries: z.enum(["Yes", "No"]).default("No"),
  pastSurgeriesDetails: z
    .string()
    .optional()
    .transform((val) => sanitizeText(val)),
  femaleMarkers: z.array(z.string()).optional().default([]),

  // Step 4: Lifestyle & Habits
  dailyWaterLiters: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 0.5 && val <= 12, "Daily water intake must be between 0.5 and 12 L"),
  sleepHours: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 2 && val <= 18, "Sleep hours must be between 2 and 18"),
  bowelMovement: z
    .enum(["Daily", "Alternate days", "Constipation", "Loose"])
    .optional(),
  eatingPatterns: z.array(z.string()).default([]),
  previousDietAttempts: z
    .string()
    .optional()
    .transform((val) => sanitizeText(val)),
  biggestStruggle: z
    .string()
    .optional()
    .transform((val) => sanitizeText(val)),

  // Step 5: Readiness & Attribution
  seriousnessScale: z
    .number()
    .min(1, "Seriousness rating must be at least 1")
    .max(10, "Seriousness rating cannot exceed 10"),
  lifeChangeVision: z
    .string()
    .optional()
    .transform((val) => sanitizeText(val)),
  pastRoadblocks: z
    .string()
    .optional()
    .transform((val) => sanitizeText(val)),
  readyFor60DaysCommitment: z.enum(["Yes", "No", "Not Sure"]),
  referralSource: z
    .string()
    .min(1, "Please indicate how you discovered Velocity Fit")
    .transform((val) => sanitizeText(val)),
  website_honey: z.string().optional(),
  attribution: z
    .object({
      utmSource: z.string().optional(),
      utmMedium: z.string().optional(),
      utmCampaign: z.string().optional(),
      utmContent: z.string().optional(),
      utmTerm: z.string().optional(),
      referrer: z.string().optional(),
      firstLandingPage: z.string().optional(),
      device: z.string().optional(),
      capturedAt: z.string().optional(),
    })
    .optional(),
});

export type AssessmentSubmissionInput = z.infer<typeof assessmentSubmissionSchema>;
