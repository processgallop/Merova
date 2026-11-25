import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { dbMode } from "@/db";
import { requireUser } from "@/lib/auth/session";
import { ROLE_LABEL, ROLE_PERMS } from "@/lib/auth/rbac";
import { AdminNav } from "@/components/admin/AdminNav";
import { Toaster } from "@/components/admin/Toast";

export const metadata = { title: { default: "Dashboard", template: "%s — Merova Admin" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("dashboard.view");
  const mode = dbMode();
  return (
    <div className="admin min-h-svh bg-[#f5f1eb] text-[15px]">
      <AdminNav user={{ name: user.name, email: user.email, role: ROLE_LABEL[user.role] }} perms={ROLE_PERMS[user.role]} />
      <div className="lg:pl-64">
        {mode === "pglite-memory" ? (
          <div className="flex items-start gap-3 border-b border-amber-300 bg-amber-50 px-6 py-3 text-sm text-amber-900" role="status">
            <AlertTriangle className="mt-0.5 size-4 flex-none" />
            <p><strong>Demonstration database.</strong> This deployment has no <code>DATABASE_URL</code>, so it runs on a temporary in-memory database: changes work but are not permanent and are not shared between server instances. Connect PostgreSQL to make the dashboard production-ready (see docs/CONFIGURATION.md).</p>
          </div>
        ) : null}
        {user.mustChangePassword ? (
          <div className="flex items-center justify-between gap-3 border-b border-red/30 bg-red-tint px-6 py-3 text-sm text-heading" role="alert">
            <p><strong>You are using a temporary password.</strong> Change it before making changes.</p>
            <Link href="/admin/account" className="btn btn-sm"><span>Change password</span></Link>
          </div>
        ) : null}
        <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
