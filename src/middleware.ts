import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Edge Middleware for Admin Route Protection.
 * Guarantees unauthenticated visitors cannot access /admin or CRM routes.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login and static assets
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const adminSession = request.cookies.get("vf_admin_session");
    const hasSupabaseAuth = request.cookies
      .getAll()
      .some((c) => c.name.includes("-auth-token") || c.name.startsWith("sb-"));

    if (!adminSession?.value && !hasSupabaseAuth) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
