import { cookies } from "next/headers";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { AdminProfile, AdminRole } from "@/types/crm";

const ADMIN_COOKIE_NAME = "vf_admin_session";

// Development Fallback Seed Admin (Dr. Lubna Fatima & Lead Administrator)
const DEV_ADMIN_PROFILE: AdminProfile = {
  id: "admin-dr-fatima-01",
  email: "admin@velocityfit.in",
  fullName: "Dr. Lubna Fatima",
  role: "SUPER_ADMIN",
  isActive: true,
  createdAt: "2026-09-01T00:00:00.000Z",
  updatedAt: "2026-09-01T00:00:00.000Z",
};

/**
 * Get the currently authenticated admin profile.
 * Verifies Supabase Auth when configured, or inspects the secure admin cookie.
 */
export async function getCurrentAdminUser(): Promise<AdminProfile | null> {
  const cookieStore = await cookies();

  // 1. Try Supabase Auth if credentials exist
  const supabase = await createServerSupabase();
  if (supabase) {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) return null;

      const { data: profile } = await supabase
        .from("admin_profiles")
        .select("*")
        .eq("id", user.id)
        .eq("is_active", true)
        .single();

      if (!profile) return null;

      return {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        role: profile.role as AdminRole,
        isActive: profile.is_active,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      };
    } catch {
      return null;
    }
  }

  // 2. Fallback / Offline Dev Mode Check
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);
  if (sessionCookie && sessionCookie.value) {
    try {
      const parsed = JSON.parse(Buffer.from(sessionCookie.value, "base64").toString("utf-8"));
      if (parsed.email === DEV_ADMIN_PROFILE.email && parsed.isActive) {
        return DEV_ADMIN_PROFILE;
      }
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Perform Admin Login.
 */
export async function loginAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; user?: AdminProfile; error?: string }> {
  const cookieStore = await cookies();
  const normalizedEmail = email.trim().toLowerCase();

  const supabase = await createServerSupabase();
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error || !data.user) {
      return { success: false, error: error?.message || "Invalid email or password" };
    }

    const { data: profile } = await supabase
      .from("admin_profiles")
      .select("*")
      .eq("id", data.user.id)
      .eq("is_active", true)
      .single();

    if (!profile) {
      await supabase.auth.signOut();
      return { success: false, error: "Unauthorized: Not an active admin account" };
    }

    return {
      success: true,
      user: {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        role: profile.role as AdminRole,
        isActive: profile.is_active,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      },
    };
  }

  // Fallback Dev Authentication
  // Accepts admin@velocityfit.in with password 'velocity2026' or 'admin123'
  if (
    normalizedEmail === DEV_ADMIN_PROFILE.email &&
    (password === "velocity2026" || password === "admin123" || password === "admin")
  ) {
    const token = Buffer.from(JSON.stringify(DEV_ADMIN_PROFILE)).toString("base64");
    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true, user: DEV_ADMIN_PROFILE };
  }

  return { success: false, error: "Invalid administrative credentials." };
}

/**
 * Perform Admin Logout.
 */
export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  const supabase = await createServerSupabase();
  if (supabase) {
    await supabase.auth.signOut();
  }
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
