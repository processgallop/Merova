import { desc } from "drizzle-orm";
import { getDb, schema as t } from "@/db";
import { requireUser } from "@/lib/auth/session";

export const metadata = { title: "Audit log" };

export default async function AuditPage() {
  await requireUser("audit.view");
  const db = await getDb();
  const rows = await db.select().from(t.auditLogs).orderBy(desc(t.auditLogs.createdAt)).limit(500);
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Audit log</h1>
      <p className="mt-1 text-sm">Who changed what, and when (latest 500 events). Revision history for each record is available from its editor.</p>
      <div className="mt-6 overflow-x-auto rounded-[3px] border border-line bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-line bg-[#faf7f3] text-left text-xs uppercase text-muted"><tr><th className="px-3 py-3">When</th><th className="px-3 py-3">User</th><th className="px-3 py-3">Action</th><th className="px-3 py-3">Record</th><th className="px-3 py-3">Details</th><th className="px-3 py-3">IP</th></tr></thead>
          <tbody className="divide-y divide-line">
            {rows.map((r) => <tr key={r.id}><td className="whitespace-nowrap px-3 py-2 text-xs">{r.createdAt.toLocaleString("en-GB")}</td><td className="px-3 py-2 text-xs">{r.userEmail}</td><td className="px-3 py-2"><span className="rounded bg-[#f5f1eb] px-2 py-0.5 text-xs">{r.action}</span></td><td className="px-3 py-2 text-xs">{r.entityType}{r.entityId ? ` #${r.entityId.slice(0, 12)}` : ""}</td><td className="px-3 py-2 text-xs text-muted">{r.summary}</td><td className="px-3 py-2 text-xs text-muted">{r.ip}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
