"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Invalid administrative credentials");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication error occurred");
      setIsLoading(false);
    }
  };

  const handleQuickFillDev = () => {
    setEmail("admin@velocityfit.in");
    setPassword("velocity2026");
  };

  return (
    <div className="min-h-screen bg-ivory text-ink flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-body selection:bg-champagne selection:text-ink">
      {/* Background Ambience */}
      <div 
        aria-hidden="true"
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-champagne/20 rounded-full blur-3xl pointer-events-none"
      />
      <div 
        aria-hidden="true"
        className="absolute bottom-10 right-10 w-80 h-80 bg-olive/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4 relative z-10">
        <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-paper border border-ink/10 text-olive-deep shadow-subtle mx-auto">
          <Lock className="w-5 h-5" />
        </div>
        <div className="space-y-1.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-olive-deep font-semibold block">
            Velocity Fit Clinical Command
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-medium text-ink tracking-tight">
            Admin Portal Access
          </h1>
          <p className="text-xs sm:text-sm text-ink-soft">
            Authorized medical & practice management access only.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-paper py-8 px-6 sm:px-10 rounded-[2rem] border border-ink/10 shadow-elevated space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block font-mono text-[10px] uppercase tracking-wider text-ink-soft font-semibold">
                Staff Email
              </label>
              <input
                type="email"
                required
                placeholder="admin@velocityfit.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-ivory border border-ink/15 text-ink placeholder:text-ink/35 text-xs focus:outline-none focus:border-olive-deep focus:ring-1 focus:ring-olive-deep transition-all shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-[10px] uppercase tracking-wider text-ink-soft font-semibold">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-ivory border border-ink/15 text-ink placeholder:text-ink/35 text-xs focus:outline-none focus:border-olive-deep focus:ring-1 focus:ring-olive-deep transition-all shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 mt-2 rounded-full bg-ink text-paper hover:bg-ink-soft font-semibold text-xs tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-subtle disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Clinical CRM</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Dev Quick Fill Helper */}
          <div className="pt-4 border-t border-ink/10 text-center space-y-3">
            <button
              type="button"
              onClick={handleQuickFillDev}
              className="font-mono text-[11px] text-olive-deep hover:text-ink uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-olive-deep" />
              <span>Fill Verified Admin Credentials</span>
            </button>
            <div className="block">
              <Link
                href="/"
                className="text-xs text-ink-soft hover:text-ink transition-colors inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Public Website</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
