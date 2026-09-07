import { NextRequest, NextResponse } from "next/server";
import { assessmentSubmissionSchema, normalizePhone } from "@/lib/validations/leads";
import { crmDb } from "@/lib/supabase/db";
import { sendAdminLeadNotification } from "@/lib/notifications/email";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // 1. Abuse & Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const rateLimit = await checkRateLimit(`assessment:${ip}`, 8, 60000); // 8 per minute
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many submissions. Please wait a moment before trying again.",
        },
        { status: 429 }
      );
    }

    // 2. Parse & Validate Payload
    const rawBody = await req.json();
    const parseResult = assessmentSubmissionSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Assessment validation failed",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const phoneNormalized = normalizePhone(data.phone);

    // 3. Server-Side BMI Calculation
    const heightM = data.heightCm / 100;
    const calculatedBmi =
      heightM > 0 && data.currentWeightKg > 0
        ? Number((data.currentWeightKg / (heightM * heightM)).toFixed(1))
        : null;

    // 4. Create or Update Lead with Deduplication
    const { lead, isNew } = await crmDb.createOrUpdateLead({
      fullName: data.fullName,
      phone: data.phone,
      phoneNormalized,
      email: data.email,
      age: data.age,
      gender: data.gender,
      city: data.city || null,
      sourceType: "ASSESSMENT_WIZARD",
      preferredProgram: data.mainGoals[0] || null,
      enquiryMessage: `V6 Audit Intake: Target ${data.targetWeightKg}kg in ${data.targetTimeframe}. Goals: ${data.mainGoals.join(", ")}`,
      utmSource: data.attribution?.utmSource || null,
      utmMedium: data.attribution?.utmMedium || null,
      utmCampaign: data.attribution?.utmCampaign || null,
      utmContent: data.attribution?.utmContent || null,
      utmTerm: data.attribution?.utmTerm || null,
      landingPage: data.attribution?.firstLandingPage || null,
      referrerUrl: data.attribution?.referrer || null,
      deviceType: data.attribution?.device || null,
    });

    // 5. Store Clinical Assessment Securely (Protected by RLS)
    const assessment = await crmDb.createAssessment(lead.id, {
      heightCm: data.heightCm,
      currentWeightKg: data.currentWeightKg,
      highestWeightKg: data.highestWeightKg,
      targetWeightKg: data.targetWeightKg,
      calculatedBmi,
      targetTimeframe: data.targetTimeframe,
      primaryGoals: data.mainGoals,
      medicalConditions: data.medicalConditions,
      medications: data.isOnLongTermMedications === "Yes" ? data.longTermMedicationsDetails : null,
      surgeries: data.hasPastSurgeries === "Yes" ? data.pastSurgeriesDetails : null,
      femaleMarkers: data.femaleMarkers,
      dailyWaterLiters: data.dailyWaterLiters,
      sleepHours: data.sleepHours,
      bowelMovement: data.bowelMovement,
      eatingPatterns: data.eatingPatterns,
      dietStruggles: data.biggestStruggle || data.previousDietAttempts,
      seriousnessScale: data.seriousnessScale,
      lifeChangeVision: data.lifeChangeVision,
      pastRoadblocks: data.pastRoadblocks,
      readyFor60Days: data.readyFor60DaysCommitment,
      referralSource: data.referralSource,
    });

    // 6. Dispatch Admin Notification (Safe, ZERO MEDICAL DETAILS)
    await sendAdminLeadNotification({
      leadId: lead.id,
      fullName: lead.fullName,
      phone: lead.phone,
      sourceType: "5-Stage Clinical Assessment",
      preferredContactMethod: lead.preferredContactMethod || "WhatsApp",
      primaryGoal: data.mainGoals[0],
      isAssessment: true,
    });

    // 7. Safe Success Response
    return NextResponse.json({
      success: true,
      leadId: lead.id,
      assessmentId: assessment.id,
      calculatedBmi,
      isNew,
      message: "Health assessment recorded securely in Velocity Fit CRM",
    });
  } catch (error) {
    console.error("[API: Assessment Submission Error]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to complete assessment submission. Please connect with Dr. Fatima directly on WhatsApp.",
      },
      { status: 500 }
    );
  }
}
