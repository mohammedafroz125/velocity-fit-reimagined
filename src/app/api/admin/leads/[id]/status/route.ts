import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/lib/auth/admin-auth";
import { crmDb } from "@/lib/supabase/db";
import { LeadStatus } from "@/types/crm";

const VALID_STATUSES: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "FOLLOW_UP",
  "CONSULTATION_BOOKED",
  "CONSULTATION_COMPLETED",
  "PAYMENT_PENDING",
  "CONVERTED",
  "ACTIVE_CUSTOMER",
  "NOT_INTERESTED",
  "LOST",
];

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdminUser();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const { status, reason } = body;

    if (!status || !VALID_STATUSES.includes(status as LeadStatus)) {
      return NextResponse.json(
        { success: false, error: "Invalid lead status provided" },
        { status: 400 }
      );
    }

    const updated = await crmDb.updateLeadStatus(
      id,
      status as LeadStatus,
      reason,
      admin.fullName
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead: updated });
  } catch (err) {
    console.error("[API: Update Lead Status Error]", err);
    return NextResponse.json(
      { success: false, error: "Failed to update lead status" },
      { status: 500 }
    );
  }
}
