"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";

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
    <div
      className="min-h-screen text-ink flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-body"
      style={{ background: "linear-gradient(160deg, #0f2d1f 0%, #1a4731 50%, #0f2d1f 100%)" }}
    >
      {/* Islamic geometric lattice watermark */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='1'%3E%3Cpath d='M40 0l6.928 12H33.072L40 0zM40 80l-6.928-12h13.856L40 80zM0 40l12-6.928V46.928L0 40zm80 0l-12 6.928V33.072L80 40zM20 20l6.928 12H13.072L20 20zm40 0l6.928 12H53.072L60 20zM20 60l-6.928-12h13.856L20 60zm40 0l-6.928-12h13.856L60 60z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Gold radial glow behind card */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)" }}
      />

      {/* Top gold accent line */}
      <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, transparent, #d4af37, #f0d060, #d4af37, transparent)" }} />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-5 relative z-10">
        {/* Crescent icon */}
        <div
          className="inline-flex items-center justify-center size-14 rounded-2xl mx-auto shadow-lg"
          style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.4)" }}
        >
          <svg className="w-7 h-7 text-amber-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2a9.94 9.94 0 0 0-3.17.52A8 8 0 1 1 20.48 15.17 9.94 9.94 0 0 0 22 12 10 10 0 0 0 12 2z" />
            <polygon points="17,3.5 17.75,5.5 19.75,5.5 18.17,6.75 18.75,8.75 17,7.5 15.25,8.75 15.83,6.75 14.25,5.5 16.25,5.5" />
          </svg>
        </div>

        {/* Arabic greeting */}
        <div className="space-y-1">
          <p className="text-amber-300/80 text-base tracking-widest" style={{ fontFamily: "serif" }}>
            السَّلامُ عَلَيكُم
          </p>
          <span
            className="font-mono text-[11px] uppercase tracking-[0.25em] font-semibold block"
            style={{ color: "#d4af37" }}
          >
            Velocity Fit Clinical Command
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-amber-50">
            Admin Portal Access
          </h1>
          <p className="text-xs sm:text-sm" style={{ color: "rgba(187,228,187,0.7)" }}>
            Authorized medical & practice management access only.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div
          className="py-8 px-6 sm:px-10 rounded-[2rem] space-y-6"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(212,175,55,0.3)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          {error && (
            <div className="p-4 rounded-xl text-xs font-medium" style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", color: "#fca5a5" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block font-mono text-[10px] uppercase tracking-wider font-semibold" style={{ color: "#d4af37" }}>
                Staff Email
              </label>
              <input
                type="email"
                required
                placeholder="admin@velocityfit.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl text-xs focus:outline-none transition-all shadow-sm"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(212,175,55,0.3)",
                  color: "#f0ede4",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.8)"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(212,175,55,0.15)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-[10px] uppercase tracking-wider font-semibold" style={{ color: "#d4af37" }}>
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl text-xs focus:outline-none transition-all shadow-sm"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(212,175,55,0.3)",
                  color: "#f0ede4",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.8)"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(212,175,55,0.15)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 mt-2 rounded-full font-semibold text-xs tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
              style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)", color: "#0f2d1f" }}
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
          <div className="pt-4 text-center space-y-3" style={{ borderTop: "1px solid rgba(212,175,55,0.2)" }}>
            <button
              type="button"
              onClick={handleQuickFillDev}
              className="font-mono text-[11px] uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer font-medium"
              style={{ color: "#d4af37" }}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Fill Verified Admin Credentials</span>
            </button>
            <div className="block">
              <Link
                href="/"
                className="text-xs inline-flex items-center gap-1 transition-colors"
                style={{ color: "rgba(187,228,187,0.6)" }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Public Website</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bismillah */}
      <p className="text-center mt-8 text-xs select-none relative z-10" style={{ color: "rgba(212,175,55,0.4)", fontFamily: "serif", letterSpacing: "0.1em" }}>
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </p>
    </div>
  );
}
