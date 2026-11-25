import Link from "next/link";
import { desc } from "drizzle-orm";
import { getDb, schema as t } from "@/db";
import { requireUser } from "@/lib/auth/session";
import { getSeoSettings } from "@/lib/content";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { RedirectManager } from "@/components/admin/RedirectManager";
import type { FieldDef } from "@/components/admin/types";

export const metadata = { title: "SEO & redirects" };

export default async function SeoPage() {
  await requireUser("seo.edit");
  const db = await getDb();
  const [seo, redirects, products, industries, pages, posts, segments, media] = await Promise.all([
    getSeoSettings(),
    db.select().from(t.redirects).orderBy(desc(t.redirects.createdAt)),
    db.select({ id: t.products.id, name: t.products.name, seo: t.products.seo, summary: t.products.summary, images: t.products.images, status: t.products.status }).from(t.products),
    db.select({ id: t.industries.id, name: t.industries.name, seo: t.industries.seo, status: t.industries.status }).from(t.industries),
    db.select({ id: t.pages.id, name: t.pages.title, seo: t.pages.seo, status: t.pages.status }).from(t.pages),
    db.select({ id: t.posts.id, name: t.posts.title, seo: t.posts.seo, status: t.posts.status, reviewStatus: t.posts.reviewStatus }).from(t.posts),
    db.select({ id: t.segments.id, name: t.segments.name, seo: t.segments.seo }).from(t.segments),
    db.select({ id: t.media.id, filename: t.media.filename, alt: t.media.alt, mime: t.media.mime, isPrivate: t.media.isPrivate }).from(t.media),
  ]);
  const warnings: { label: string; href: string; issue: string }[] = [];
  const titles = new Map<string, string[]>();
  const check = (kind: string, href: string, name: string, s: { title?: string; description?: string }, fallbackDesc?: string) => {
    if (!s.description && !fallbackDesc) warnings.push({ label: `${kind}: ${name}`, href, issue: "Missing meta description" });
    else if (s.description && (s.description.length < 70 || s.description.length > 165)) warnings.push({ label: `${kind}: ${name}`, href, issue: `Meta description is ${s.description.length} characters (aim for 70–160)` });
    if (s.title && s.title.length > 70) warnings.push({ label: `${kind}: ${name}`, href, issue: `SEO title is ${s.title.length} characters (aim for ≤60)` });
    const key = (s.title || name).toLowerCase();
    titles.set(key, [...(titles.get(key) ?? []), `${kind}: ${name}`]);
  };
  products.filter((p) => p.status === "published").forEach((p) => { check("Product", `/admin/products/${p.id}`, p.name, p.seo, p.summary); p.images.forEach((im) => { if (!im.alt) warnings.push({ label: `Product: ${p.name}`, href: `/admin/products/${p.id}`, issue: "Image without alt text" }); }); });
  industries.filter((i) => i.status === "published").forEach((i) => check("Industry", `/admin/industries/${i.id}`, i.name, i.seo));
  pages.filter((p) => p.status === "published").forEach((p) => check("Page", `/admin/pages/${p.id}`, p.name, p.seo));
  segments.forEach((s) => check("Segment", `/admin/segments/${s.id}`, s.name, s.seo));
  posts.filter((p) => p.status === "published").forEach((p) => { check("Article", `/admin/posts/${p.id}`, p.name, p.seo); if (p.reviewStatus !== "reviewed") warnings.push({ label: `Article: ${p.name}`, href: `/admin/posts/${p.id}`, issue: "Awaiting technical review — not indexed" }); });
  media.filter((m) => !m.isPrivate && m.mime.startsWith("image/") && !m.alt).forEach((m) => warnings.push({ label: `Media: ${m.filename}`, href: "/admin/media", issue: "Missing alt text" }));
  for (const [k, v] of titles) if (v.length > 1) warnings.push({ label: v.join(", "), href: "#", issue: `Duplicate title “${k}”` });

  const fields: FieldDef[] = [
    { key: "defaultTitle", label: "Default site title", type: "text" },
    { key: "titleTemplate", label: "Title template", type: "text", hint: "%s is replaced with the page title." },
    { key: "defaultDescription", label: "Default meta description", type: "textarea" },
    { key: "ogImage", label: "Default social share image URL", type: "text" },
    { key: "allowIndexing", label: "Allow search engines to index the website", type: "checkbox", hint: "Turn off only for staging. Drafts are never indexed." },
    { key: "robotsDisallow", label: "Additional robots.txt disallow paths", type: "list" },
  ];
  return (
    <div className="space-y-10">
      <SettingsForm settingKey="seo" title="SEO & redirects" intro="Global search settings. The XML sitemap, robots.txt, canonical URLs, breadcrumbs and structured data are generated automatically from published content." fields={fields} initial={JSON.parse(JSON.stringify(seo))} />
      <div className="flex flex-wrap gap-3 text-sm"><a href="/sitemap.xml" target="_blank" className="btn btn-outline btn-sm"><span>View sitemap.xml</span></a><a href="/robots.txt" target="_blank" className="btn btn-outline btn-sm"><span>View robots.txt</span></a></div>
      <RedirectManager redirects={redirects.map((r) => ({ id: r.id, fromPath: r.fromPath, toPath: r.toPath, permanent: r.permanent, hits: r.hits, note: r.note }))} />
      <section className="rounded-[3px] border border-line bg-white p-5">
        <h2 className="font-display text-lg font-bold">SEO health ({warnings.length})</h2>
        <p className="mt-1 text-sm">Issues on published content. Fixing them improves how pages appear in search results.</p>
        <ul className="mt-4 divide-y divide-line text-sm">
          {warnings.slice(0, 150).map((w, i) => <li key={i} className="flex flex-wrap justify-between gap-2 py-2"><Link href={w.href} className="font-semibold text-heading hover:text-red">{w.label}</Link><span className="text-amber-700">{w.issue}</span></li>)}
          {!warnings.length ? <li className="py-2 text-emerald-700">No issues found.</li> : null}
        </ul>
      </section>
    </div>
  );
}
