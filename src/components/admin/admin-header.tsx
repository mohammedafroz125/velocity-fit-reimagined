"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AdminProfile } from "@/types/crm";
import {
  LayoutDashboard,
  Users,
  ExternalLink,
  LogOut,
  Shield,
  Menu,
  X,
} from "lucide-react";

/** Islamic crescent + star SVG mark */
function CrescentStar({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2a9.94 9.94 0 0 0-3.17.52A8 8 0 1 1 20.48 15.17 9.94 9.94 0 0 0 22 12 10 10 0 0 0 12 2z" />
      <polygon points="17,3.5 17.75,5.5 19.75,5.5 18.17,6.75 18.75,8.75 17,7.5 15.25,8.75 15.83,6.75 14.25,5.5 16.25,5.5" />
    </svg>
  );
}

export function AdminHeader({ admin }: { admin: AdminProfile }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  const navLinks = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Leads & CRM", href: "/admin/leads", icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 font-body" style={{ background: "linear-gradient(135deg, #0f2d1f 0%, #1a4731 60%, #0f2d1f 100%)", borderBottom: "1px solid rgba(212,175,55,0.3)" }}>
      {/* Geometric Arabic-inspired top accent line */}
      <div aria-hidden="true" style={{ height: "3px", background: "linear-gradient(90deg, transparent, #d4af37, #f0d060, #d4af37, transparent)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-6">
            <Link href="/admin" className="flex items-center space-x-2.5 group">
              <CrescentStar className="w-6 h-6 text-amber-300 group-hover:text-amber-200 transition-colors" />
              <div className="flex items-baseline space-x-2">
                <span className="font-display font-semibold text-2xl tracking-tight text-amber-50">
                  Velocity
                </span>
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold px-2.5 py-0.5 rounded-full border shadow-sm"
                  style={{ background: "rgba(212,175,55,0.2)", color: "#f0d060", borderColor: "rgba(212,175,55,0.5)" }}
                >
                  CRM
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1.5">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "text-amber-200 border"
                        : "text-green-200/70 hover:text-amber-200 hover:bg-white/5"
                    }`}
                    style={isActive ? { background: "rgba(212,175,55,0.15)", borderColor: "rgba(212,175,55,0.4)" } : {}}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bismillah centre badge — desktop only */}
          <div className="hidden lg:flex flex-col items-center select-none" aria-label="Bismillah">
            <span className="text-amber-300/70 text-[11px] font-semibold tracking-widest" style={{ fontFamily: "serif", letterSpacing: "0.15em" }}>
              بِسْمِ اللَّه
            </span>
          </div>

          {/* User Profile & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-200/60 hover:text-amber-300 flex items-center space-x-1 font-medium transition-colors"
            >
              <span>View Website</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <div className="h-4 w-[1px]" style={{ background: "rgba(212,175,55,0.3)" }} />

            <div className="flex items-center space-x-2.5 text-xs">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold font-mono text-xs shadow-subtle"
                style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)", color: "#0f2d1f" }}
              >
                {admin.fullName.charAt(0)}
              </div>
              <div className="text-left">
                <span className="block font-medium text-amber-50 text-xs leading-none">
                  {admin.fullName}
                </span>
                <span className="text-[10px] font-mono font-semibold flex items-center space-x-0.5 mt-0.5" style={{ color: "#d4af37" }}>
                  <Shield className="w-2.5 h-2.5 inline mr-0.5" />
                  {admin.role}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl transition-colors text-green-200/60 hover:text-red-300 hover:bg-red-900/20"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border text-amber-200"
              style={{ background: "rgba(212,175,55,0.1)", borderColor: "rgba(212,175,55,0.3)" }}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="md:hidden px-4 pt-3 pb-5 space-y-3"
          style={{ background: "#0f2d1f", borderTop: "1px solid rgba(212,175,55,0.2)" }}
        >
          <div className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "text-amber-200 border"
                      : "text-green-200/70 hover:text-amber-200"
                  }`}
                  style={isActive ? { background: "rgba(212,175,55,0.15)", borderColor: "rgba(212,175,55,0.4)" } : {}}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 flex items-center justify-between" style={{ borderTop: "1px solid rgba(212,175,55,0.2)" }}>
            <div className="flex items-center space-x-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono"
                style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)", color: "#0f2d1f" }}
              >
                {admin.fullName.charAt(0)}
              </div>
              <span className="text-xs font-medium text-amber-100">{admin.fullName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-medium flex items-center space-x-1 text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
