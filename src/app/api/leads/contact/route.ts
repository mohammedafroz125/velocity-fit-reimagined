import { NextRequest, NextResponse } from "next/server";
import { contactSubmissionSchema, normalizePhone } from "@/lib/validations/leads";
import { crmDb } from "@/lib/supabase/db";
import { sendAdminLeadNotification } from "@/lib/notifications/email";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // 1. Abuse & Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const rateLimit = await checkRateLimit(`contact:${ip}`, 10, 60000); // 10 per minute
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please try again in a minute.",
        },
        { status: 429 }
      );
    }

    // 2. Parse & Validate Payload
    const rawBody = await req.json();
    const parseResult = contactSubmissionSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const phoneNormalized = normalizePhone(data.phone);

    // 3. Create or Update Lead with Deduplication
    const { lead, isNew } = await crmDb.createOrUpdateLead({
      fullName: data.fullName,
      phone: data.phone,
      phoneNormalized,
      email: data.email || null,
      preferredContactMethod: data.preferredContactMethod,
      sourceType: "CONTACT_FORM",
      enquiryMessage: `[Primary Goal: ${data.primaryGoal}] ${data.message || ""}`.trim(),
      utmSource: data.attribution?.utmSource || null,
      utmMedium: data.attribution?.utmMedium || null,
      utmCampaign: data.attribution?.utmCampaign || null,
      utmContent: data.attribution?.utmContent || null,
      utmTerm: data.attribution?.utmTerm || null,
      landingPage: data.attribution?.firstLandingPage || null,
      referrerUrl: data.attribution?.referrer || null,
      deviceType: data.attribution?.device || null,
    });

    // 4. Dispatch Admin Notification (Safe, Provider-Agnostic)
    await sendAdminLeadNotification({
      leadId: lead.id,
      fullName: lead.fullName,
      phone: lead.phone,
      sourceType: "Contact Form Inquiry",
      preferredContactMethod: lead.preferredContactMethod,
      primaryGoal: data.primaryGoal,
      isAssessment: false,
    });

    // 5. Safe Success Response
    return NextResponse.json({
      success: true,
      leadId: lead.id,
      isNew,
      message: "Inquiry successfully recorded in Velocity Fit CRM",
    });
  } catch (error) {
    // Return safe user error without exposing stack traces
    console.error("[API: Contact Submission Error]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to record inquiry at this moment. Please connect with us directly on WhatsApp.",
      },
      { status: 500 }
    );
  }
}
