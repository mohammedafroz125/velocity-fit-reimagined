import { NextRequest, NextResponse } from "next/server";
import { loginAdmin } from "@/lib/auth/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await loginAdmin(email, password);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: result.user,
    });
  } catch (err) {
    console.error("[Admin Auth Login Error]", err);
    return NextResponse.json(
      { success: false, error: "Authentication service error" },
      { status: 500 }
    );
  }
}
