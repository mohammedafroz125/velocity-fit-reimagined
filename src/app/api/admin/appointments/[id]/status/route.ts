import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/lib/auth/admin-auth";
import { crmDb } from "@/lib/supabase/db";
import { updateAppointmentStatusSchema } from "@/lib/validations/booking";
import { AppointmentStatus } from "@/types/crm";

export const dynamic = "force-dynamic";

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
    const parseResult = updateAppointmentStatusSchema.safeParse(body);

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

    const { status, reason } = parseResult.data;

    const updated = await crmDb.updateAppointmentStatus(
      id,
      status as AppointmentStatus,
      reason || undefined,
      admin.fullName
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, appointment: updated });
  } catch (err) {
    console.error("[API: Update Appointment Status Error]", err);
    return NextResponse.json(
      { success: false, error: "Failed to update appointment status" },
      { status: 500 }
    );
  }
}
