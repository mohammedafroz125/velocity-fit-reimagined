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
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-xl border-b border-ink/10 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-6">
            <Link href="/admin" className="flex items-baseline space-x-2 group">
              <span className="font-display font-semibold text-2xl tracking-tight text-ink">
                Velocity
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold px-2.5 py-0.5 rounded-full bg-ink text-champagne border border-ink shadow-sm">
                CRM
              </span>
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
                        ? "bg-paper text-ink border border-ink/10 shadow-subtle"
                        : "text-ink-soft hover:text-ink hover:bg-paper/60"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Profile & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-ink-soft hover:text-olive-deep flex items-center space-x-1 font-medium transition-colors"
            >
              <span>View Website</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <div className="h-4 w-[1px] bg-ink/10" />

            <div className="flex items-center space-x-2.5 text-xs">
              <div className="w-8 h-8 rounded-full bg-olive-deep text-paper flex items-center justify-center font-bold font-mono text-xs shadow-subtle">
                {admin.fullName.charAt(0)}
              </div>
              <div className="text-left">
                <span className="block font-medium text-ink text-xs leading-none">
                  {admin.fullName}
                </span>
                <span className="text-[10px] font-mono text-olive-deep font-semibold flex items-center space-x-0.5 mt-0.5">
                  <Shield className="w-2.5 h-2.5 inline mr-0.5" />
                  {admin.role}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-ink-soft hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-paper border border-ink/10 text-ink"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-ink/10 bg-ivory px-4 pt-3 pb-5 space-y-3">
          <div className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-sm font-semibold ${
                    isActive
                      ? "bg-paper text-ink border border-ink/10"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-ink/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-olive-deep text-paper flex items-center justify-center text-xs font-bold font-mono">
                {admin.fullName.charAt(0)}
              </div>
              <span className="text-xs text-ink font-medium">{admin.fullName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center space-x-1"
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
