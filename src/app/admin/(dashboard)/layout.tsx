import { redirect } from "next/navigation";
import { getCurrentAdminUser } from "@/lib/auth/admin-auth";
import { AdminHeader } from "@/components/admin/admin-header";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdminUser();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div
      className="min-h-screen text-ink flex flex-col font-body"
      style={{
        background: "linear-gradient(160deg, #f8f6f0 0%, #f0ede4 40%, #eae8e0 100%)",
        // subtle geometric Islamic lattice pattern via CSS
      }}
    >
      {/* Islamic geometric background watermark */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a4731' fill-opacity='1'%3E%3Cpath d='M30 0l5.196 9H24.804L30 0zM30 60l-5.196-9h10.392L30 60zM0 30l9-5.196V35.196L0 30zm60 0l-9 5.196V24.804L60 30zM15 15l5.196 9H9.804L15 15zm30 0l5.196 9h-10.392L45 15zM15 45l-5.196-9h10.392L15 45zm30 0l-5.196-9h10.392L45 45z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      {/* Top emerald accent line */}
      <div aria-hidden="true" style={{ height: "2px", background: "linear-gradient(90deg, transparent, #1a4731 20%, #d4af37 50%, #1a4731 80%, transparent)", position: "relative", zIndex: 1 }} />
      <AdminHeader admin={admin} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {children}
      </main>
      {/* Footer accent */}
      <div
        aria-hidden="true"
        className="text-center py-3 text-xs font-mono select-none relative z-10"
        style={{ color: "#1a4731", opacity: 0.5, letterSpacing: "0.15em" }}
      >
        ۞ &nbsp; بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ &nbsp; ۞
      </div>
    </div>
  );
}
