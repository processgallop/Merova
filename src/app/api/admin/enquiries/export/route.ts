import { desc } from "drizzle-orm";
import { getDb, schema as t } from "@/db";
import { currentUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import { audit } from "@/lib/admin/audit";
import { ENQUIRY_STATUS_LABEL, type EnquiryStatus } from "@/lib/admin/enquiry-status";

const cell = (v: unknown) => {
  let s = String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // neutralise spreadsheet formula injection
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET(req: Request) {
  const user = await currentUser();
  if (!user || !can(user.role, "enquiries.export")) return new Response("Forbidden", { status: 403 });
  const sp = new URL(req.url).searchParams;
  const db = await getDb();
  const all = await db.select().from(t.enquiries).orderBy(desc(t.enquiries.createdAt));
  const q = (sp.get("q") ?? "").toLowerCase();
  const rows = all.filter((e) => (!q || `${e.reference} ${e.name} ${e.company ?? ""} ${e.email}`.toLowerCase().includes(q)) && (!sp.get("status") || e.status === sp.get("status")) && (!sp.get("type") || e.type === sp.get("type")) && (!sp.get("industry") || e.industry === sp.get("industry")) && (!sp.get("product") || e.products.some((p) => p.slug === sp.get("product"))) && (!sp.get("from") || e.createdAt >= new Date(sp.get("from")!)) && (!sp.get("to") || e.createdAt <= new Date(`${sp.get("to")}T23:59:59`)));
  const head = ["Reference", "Received", "Status", "Type", "Name", "Company", "Email", "Phone", "Location", "Industry", "Products", "Quantity", "Delivery", "Timeline", "Message", "Team", "Source page"];
  const lines = rows.map((e) => [e.reference, e.createdAt.toISOString(), ENQUIRY_STATUS_LABEL[e.status as EnquiryStatus], e.type, e.name, e.company, e.email, e.phone, e.location, e.industry, e.products.map((p) => `${p.name}${p.specs && Object.keys(p.specs).length ? ` (${Object.entries(p.specs).map(([k, v]) => `${k}: ${v}`).join("; ")})` : ""}`).join(" | "), e.quantity, e.delivery, e.timeline, e.message, e.team, e.source.page].map(cell).join(","));
  await audit(user, "export", "enquiry", null, `${rows.length} rows`);
  return new Response("﻿" + [head.map(cell).join(","), ...lines].join("\r\n"), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="merova-enquiries-${new Date().toISOString().slice(0, 10)}.csv"`, "Cache-Control": "no-store" },
  });
}
