import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/lib/auth/admin-auth";
import { crmDb } from "@/lib/supabase/db";

export async function POST(
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
    const { noteBody } = body;

    if (!noteBody || typeof noteBody !== "string" || !noteBody.trim()) {
      return NextResponse.json(
        { success: false, error: "Note body cannot be empty" },
        { status: 400 }
      );
    }

    const cleanNote = noteBody.trim().slice(0, 3000);
    const note = await crmDb.addLeadNote(id, admin.fullName, cleanNote);

    return NextResponse.json({ success: true, note });
  } catch (err) {
    console.error("[API: Add Lead Note Error]", err);
    return NextResponse.json(
      { success: false, error: "Failed to add lead note" },
      { status: 500 }
    );
  }
}
