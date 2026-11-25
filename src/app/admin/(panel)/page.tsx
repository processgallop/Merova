import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { ArrowRight, Boxes, Factory, FileText, Home, Image as ImageIcon, Inbox, Layers, Plus } from "lucide-react";
import { getDb, schema as t } from "@/db";
import { requireUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import { getSiteSettings } from "@/lib/content";
import { ENQUIRY_STATUS_LABEL, type EnquiryStatus } from "@/lib/admin/enquiry-status";

export const metadata = { title: "Dashboard" };

const count = async (q: Promise<{ n: number }[]>) => Number((await q)[0]?.n ?? 0);

export default async function Dashboard() {
  const user = await requireUser("dashboard.view");
  const db = await getDb();
  const n = sql<number>`count(*)::int`;
  const [products, published, segments, industries, pagesLive, pagesDraft, postsLive, enquiries, unread, recentProducts, recentEnquiries, activity, enqRows, site] = await Promise.all([
    count(db.select({ n }).from(t.products)),
    count(db.select({ n }).from(t.products).where(eq(t.products.status, "published"))),
    count(db.select({ n }).from(t.segments)),
    count(db.select({ n }).from(t.industries)),
    count(db.select({ n }).from(t.pages).where(eq(t.pages.status, "published"))),
    count(db.select({ n }).from(t.pages).where(sql`${t.pages.status} <> 'published'`)),
    count(db.select({ n }).from(t.posts).where(eq(t.posts.status, "published"))),
    count(db.select({ n }).from(t.enquiries)),
    count(db.select({ n }).from(t.enquiries).where(eq(t.enquiries.isRead, false))),
    db.select({ id: t.products.id, name: t.products.name, status: t.products.status, createdAt: t.products.createdAt }).from(t.products).orderBy(desc(t.products.createdAt)).limit(5),
    can(user.role, "enquiries.view") ? db.select().from(t.enquiries).orderBy(desc(t.enquiries.createdAt)).limit(6) : Promise.resolve([]),
    db.select().from(t.auditLogs).where(sql`${t.auditLogs.action} not in ('login','logout','login_failed')`).orderBy(desc(t.auditLogs.createdAt)).limit(8),
    can(user.role, "enquiries.view") ? db.select({ industry: t.enquiries.industry, products: t.enquiries.products }).from(t.enquiries) : Promise.resolve([]),
    getSiteSettings(),
  ]);
  const byIndustry = Object.entries(enqRows.reduce<Record<string, number>>((a, e) => { if (e.industry) a[e.industry] = (a[e.industry] ?? 0) + 1; return a; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const byProduct = Object.entries(enqRows.flatMap((e) => e.products).reduce<Record<string, number>>((a, p) => { a[p.name] = (a[p.name] ?? 0) + 1; return a; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const stats = [
    { label: "Products", value: products, sub: `${published} published`, href: "/admin/products", icon: Boxes, show: can(user.role, "catalog.view") },
    { label: "Segments", value: segments, href: "/admin/segments", icon: Layers, show: can(user.role, "catalog.view") },
    { label: "Industries", value: industries, href: "/admin/industries", icon: Factory, show: can(user.role, "catalog.view") },
    { label: "Published pages", value: pagesLive, sub: `${pagesDraft} draft / other`, href: "/admin/pages", icon: Home, show: can(user.role, "content.view") },
    { label: "Published articles", value: postsLive, href: "/admin/posts", icon: FileText, show: can(user.role, "content.view") },
    { label: "Enquiries", value: enquiries, sub: `${unread} unread`, href: "/admin/enquiries", icon: Inbox, show: can(user.role, "enquiries.view"), alert: unread > 0 },
  ].filter((s) => s.show);
  const actions = [
    { label: "Add product", href: "/admin/products/new", show: can(user.role, "catalog.edit") },
    { label: "Add industry", href: "/admin/industries/new", show: can(user.role, "catalog.edit") },
    { label: "Add segment", href: "/admin/segments/new", show: can(user.role, "catalog.edit") },
    { label: "Write article", href: "/admin/posts/new", show: can(user.role, "content.edit") },
    { label: "Edit homepage", href: "/admin/pages/home", show: can(user.role, "content.edit") },
    { label: "Manage images", href: "/admin/media", show: can(user.role, "media.edit") },
    { label: "View enquiries", href: "/admin/enquiries", show: can(user.role, "enquiries.view") },
  ].filter((a) => a.show);
  const analytics = Boolean(site.analytics.gaId || site.analytics.gtmId);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Good to see you, {user.name.split(" ")[0]}.</h1>
        <p className="mt-1 text-sm">Merova website at a glance.</p>
      </div>
      {actions.length ? <div className="flex flex-wrap gap-2">{actions.map((a) => <Link key={a.href} href={a.href} className="btn btn-outline btn-sm"><Plus className="size-4" /><span>{a.label}</span></Link>)}</div> : null}
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <li key={s.label}><Link href={s.href} className={`block rounded-[3px] border bg-white p-4 transition-colors hover:border-red ${s.alert ? "border-red" : "border-line"}`}><s.icon className="size-5 text-red" /><p className="mt-3 font-display text-3xl font-bold text-heading">{s.value}</p><p className="text-sm text-heading">{s.label}</p>{s.sub ? <p className={`text-xs ${s.alert ? "font-semibold text-red" : "text-muted"}`}>{s.sub}</p> : null}</Link></li>
        ))}
      </ul>
      <div className="grid gap-6 xl:grid-cols-3">
        {can(user.role, "enquiries.view") ? (
          <section className="rounded-[3px] border border-line bg-white p-5 xl:col-span-2">
            <div className="flex items-center justify-between"><h2 className="font-display text-lg font-bold">Latest enquiries</h2><Link href="/admin/enquiries" className="link link-red text-sm">All <ArrowRight className="size-4" /></Link></div>
            <ul className="mt-3 divide-y divide-line text-sm">
              {recentEnquiries.map((e) => <li key={e.id}><Link href={`/admin/enquiries/${e.id}`} className="flex flex-wrap items-center justify-between gap-2 py-2.5"><span className={e.isRead ? "" : "font-semibold text-heading"}>{!e.isRead ? <span className="mr-2 inline-block size-2 rounded-full bg-red" /> : null}{e.name}{e.company ? ` · ${e.company}` : ""}<span className="block text-xs text-muted">{e.products.map((p) => p.name).join(", ") || e.type} {e.industry ? `· ${e.industry}` : ""}</span></span><span className="text-xs text-muted">{ENQUIRY_STATUS_LABEL[e.status as EnquiryStatus]} · {e.createdAt.toLocaleDateString("en-GB")}</span></Link></li>)}
              {!recentEnquiries.length ? <li className="py-6 text-center text-muted">No enquiries yet. Submissions from the website appear here instantly.</li> : null}
            </ul>
          </section>
        ) : null}
        <section className="rounded-[3px] border border-line bg-white p-5">
          <h2 className="font-display text-lg font-bold">Recent changes</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {activity.map((a) => <li key={a.id}><span className="font-semibold text-heading">{a.action}</span> {a.entityType}{a.summary ? ` — ${a.summary.slice(0, 60)}` : ""}<span className="block text-xs text-muted">{a.userEmail} · {a.createdAt.toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}</span></li>)}
            {!activity.length ? <li className="text-muted">No changes yet.</li> : null}
          </ul>
        </section>
        {can(user.role, "enquiries.view") ? (
          <section className="rounded-[3px] border border-line bg-white p-5">
            <h2 className="font-display text-lg font-bold">Industries in enquiries</h2>
            <p className="text-xs text-muted">From stored enquiries — real demand, not page views.</p>
            <ul className="mt-3 space-y-2 text-sm">{byIndustry.map(([k, v]) => <li key={k} className="flex justify-between"><span>{k}</span><span className="font-semibold">{v}</span></li>)}{!byIndustry.length ? <li className="text-muted">Not enough data yet.</li> : null}</ul>
          </section>
        ) : null}
        {can(user.role, "enquiries.view") ? (
          <section className="rounded-[3px] border border-line bg-white p-5">
            <h2 className="font-display text-lg font-bold">Most requested products</h2>
            <ul className="mt-3 space-y-2 text-sm">{byProduct.map(([k, v]) => <li key={k} className="flex justify-between"><span>{k}</span><span className="font-semibold">{v}</span></li>)}{!byProduct.length ? <li className="text-muted">Not enough data yet.</li> : null}</ul>
          </section>
        ) : null}
        <section className="rounded-[3px] border border-line bg-white p-5">
          <h2 className="font-display text-lg font-bold">Recently added products</h2>
          <ul className="mt-3 space-y-2 text-sm">{recentProducts.map((p) => <li key={p.id}><Link href={`/admin/products/${p.id}`} className="hover:text-red">{p.name}</Link> <span className="text-xs text-muted">· {p.status}</span></li>)}</ul>
          <p className="mt-4 border-t border-line pt-3 text-xs text-muted"><ImageIcon className="mr-1 inline size-3.5" />Most-viewed products and industry selections need Google Analytics 4. {analytics ? "GA4/GTM is configured — view the engagement reports in Google Analytics." : "Add a GA4 ID in Settings to start collecting them."}</p>
        </section>
      </div>
    </div>
  );
}
