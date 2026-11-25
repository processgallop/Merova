import Link from "next/link";
import { desc } from "drizzle-orm";
import { Download } from "lucide-react";
import { getDb, schema as t } from "@/db";
import { requireUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import { ENQUIRY_STATUS_LABEL, type EnquiryStatus } from "@/lib/admin/enquiry-status";
import { ENQUIRY_TYPES } from "@/lib/quote";

export const metadata = { title: "Enquiries" };

type SP = Promise<{ q?: string; status?: string; type?: string; industry?: string; product?: string; from?: string; to?: string; assigned?: string }>;

export default async function EnquiriesPage({ searchParams }: { searchParams: SP }) {
  const user = await requireUser("enquiries.view");
  const sp = await searchParams;
  const db = await getDb();
  const [all, users] = await Promise.all([db.select().from(t.enquiries).orderBy(desc(t.enquiries.createdAt)).limit(2000), db.select({ id: t.users.id, name: t.users.name }).from(t.users)]);
  const q = (sp.q ?? "").toLowerCase();
  const from = sp.from ? new Date(sp.from) : null;
  const to = sp.to ? new Date(`${sp.to}T23:59:59`) : null;
  const rows = all.filter((e) =>
    (!q || `${e.reference} ${e.name} ${e.company ?? ""} ${e.email} ${e.message ?? ""}`.toLowerCase().includes(q)) &&
    (!sp.status || e.status === sp.status) &&
    (!sp.type || e.type === sp.type) &&
    (!sp.industry || e.industry === sp.industry) &&
    (!sp.product || e.products.some((p) => p.slug === sp.product)) &&
    (!sp.assigned || (sp.assigned === "none" ? !e.assignedTo : e.assignedTo === sp.assigned)) &&
    (!from || e.createdAt >= from) && (!to || e.createdAt <= to),
  );
  const industries = [...new Set(all.map((e) => e.industry).filter(Boolean))] as string[];
  const products = [...new Map(all.flatMap((e) => e.products.map((p) => [p.slug, p.name] as const))).entries()];
  const qs = new URLSearchParams(Object.entries(sp).filter(([, v]) => v) as [string, string][]).toString();
  const counts = Object.fromEntries(Object.keys(ENQUIRY_STATUS_LABEL).map((s) => [s, all.filter((e) => e.status === s).length]));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Enquiries</h1>
          <p className="mt-1 text-sm">Every quote, custom-requirement and contact submission is stored here with its files, notes and status history.</p>
        </div>
        {can(user.role, "enquiries.export") ? <a href={`/api/admin/enquiries/export?${qs}`} className="btn btn-outline btn-sm"><Download className="size-4" /><span>Export CSV ({rows.length})</span></a> : null}
      </div>
      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        <Link href="/admin/enquiries" className={`chip !min-h-8 ${!sp.status ? "is-active" : ""}`}>All <span className="count">{all.length}</span></Link>
        {Object.entries(ENQUIRY_STATUS_LABEL).map(([k, v]) => <Link key={k} href={`/admin/enquiries?status=${k}`} className={`chip !min-h-8 ${sp.status === k ? "is-active" : ""}`}>{v} <span className="count">{counts[k]}</span></Link>)}
      </div>
      <form className="mb-4 grid gap-2 rounded-[3px] border border-line bg-white p-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8" method="get">
        <input name="q" defaultValue={sp.q} placeholder="Search name, company, email, ref…" className="field !min-h-10 text-sm xl:col-span-2" aria-label="Search" />
        <select name="type" defaultValue={sp.type ?? ""} className="field !min-h-10 text-sm" aria-label="Type"><option value="">All types</option>{Object.entries(ENQUIRY_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <select name="industry" defaultValue={sp.industry ?? ""} className="field !min-h-10 text-sm" aria-label="Industry"><option value="">All industries</option>{industries.map((i) => <option key={i}>{i}</option>)}</select>
        <select name="product" defaultValue={sp.product ?? ""} className="field !min-h-10 text-sm" aria-label="Product"><option value="">All products</option>{products.map(([s, n]) => <option key={s} value={s}>{n}</option>)}</select>
        <select name="assigned" defaultValue={sp.assigned ?? ""} className="field !min-h-10 text-sm" aria-label="Assigned"><option value="">Anyone</option><option value="none">Unassigned</option>{users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select>
        <input type="date" name="from" defaultValue={sp.from} className="field !min-h-10 text-sm" aria-label="From date" />
        <input type="date" name="to" defaultValue={sp.to} className="field !min-h-10 text-sm" aria-label="To date" />
        {sp.status ? <input type="hidden" name="status" value={sp.status} /> : null}
        <button type="submit" className="btn btn-dark btn-sm"><span>Filter</span></button>
      </form>
      <div className="overflow-x-auto rounded-[3px] border border-line bg-white">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b border-line bg-[#faf7f3] text-left text-xs uppercase tracking-wide text-muted">
            <tr><th className="px-3 py-3">Received</th><th className="px-3 py-3">Contact</th><th className="px-3 py-3">Requirement</th><th className="px-3 py-3">Industry</th><th className="px-3 py-3">Assigned</th><th className="px-3 py-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((e) => (
              <tr key={e.id} className={`hover:bg-[#fbf9f6] ${e.isRead ? "" : "font-semibold"}`}>
                <td className="px-3 py-2.5 whitespace-nowrap"><Link href={`/admin/enquiries/${e.id}`} className="flex items-center gap-2 text-heading hover:text-red">{!e.isRead ? <span className="size-2 rounded-full bg-red" aria-label="Unread" /> : null}{e.createdAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</Link><span className="block text-xs font-normal text-muted">{e.reference}</span></td>
                <td className="px-3 py-2.5"><Link href={`/admin/enquiries/${e.id}`} className="text-heading hover:text-red">{e.name}</Link><span className="block text-xs font-normal text-muted">{e.company ?? e.email}</span></td>
                <td className="px-3 py-2.5 font-normal">{ENQUIRY_TYPES[e.type as keyof typeof ENQUIRY_TYPES] ?? e.type}{e.products.length ? <span className="block text-xs text-muted">{e.products.map((p) => p.name).join(", ").slice(0, 80)}</span> : null}</td>
                <td className="px-3 py-2.5 font-normal">{e.industry ?? "—"}</td>
                <td className="px-3 py-2.5 font-normal">{users.find((u) => u.id === e.assignedTo)?.name ?? "—"}</td>
                <td className="px-3 py-2.5 font-normal"><span className="rounded-full border border-line px-2 py-0.5 text-xs">{ENQUIRY_STATUS_LABEL[e.status as EnquiryStatus]}</span></td>
              </tr>
            ))}
            {!rows.length ? <tr><td colSpan={6} className="px-3 py-10 text-center text-muted">No enquiries match these filters.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
