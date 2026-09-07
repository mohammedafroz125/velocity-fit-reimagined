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
    <div className="min-h-screen bg-ivory text-ink flex flex-col font-body selection:bg-champagne selection:text-ink">
      <AdminHeader admin={admin} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
