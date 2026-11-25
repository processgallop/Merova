import "server-only";
import { and, asc, desc, eq, ne, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema as t } from "@/db";
import type { PostBlock, PostBlockSection } from "@/db/types";
import { authorize, AuthError } from "@/lib/auth/session";
import type { Perm } from "@/lib/auth/rbac";
import { audit, refreshSite, snapshot, type ActionResult } from "./audit";

export type EntityType = "segment" | "product" | "industry" | "page" | "post" | "resource";

const STATUS = z.enum(["draft", "pending_review", "approved", "published", "archived"]);
const str = (max = 500) => z.string().trim().max(max).default("");
const opt = (max = 500) => z.string().trim().max(max).nullish().transform((v) => (v ? v : null));
const slug = z.string().trim().toLowerCase().min(1, "Slug is required.").max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug may contain only lowercase letters, numbers and hyphens.");
const pathSlug = z.string().trim().toLowerCase().min(1).max(200).regex(/^[a-z0-9]+(?:[-/][a-z0-9]+)*$/, "Path may contain lowercase letters, numbers, hyphens and slashes.");
const list = z.array(z.string().trim().max(1000)).max(100).default([]).transform((a) => a.filter(Boolean));
const faqs = z.array(z.object({ q: str(400), a: str(3000) })).max(40).default([]).transform((a) => a.filter((f) => f.q && f.a));
const image = z.object({ url: z.string().max(1000), alt: str(300), kind: z.enum(["render", "representative", "original", "illustration"]).optional(), mediaId: z.string().optional(), caption: z.string().max(300).optional(), credit: z.string().max(300).optional() }).nullish().transform((v) => (v?.url ? v : null));
const seo = z.object({ title: str(200), description: str(400), ogTitle: str(200), ogDescription: str(400), ogImage: str(1000), canonical: str(1000), noindex: z.boolean().optional(), primary: str(200), secondary: z.array(z.string()).optional() }).partial().default({});
const date = z.string().nullish().transform((v) => (v ? new Date(v) : null)).refine((d) => d === null || !Number.isNaN(d.getTime()), "Invalid date.");
const intish = z.coerce.number().int().min(0).max(100000).default(0);

const schemas = {
  segment: z.object({
    code: z.string().trim().min(1).max(4),
    slug,
    name: z.string().trim().min(2, "Name is required.").max(160),
    navName: z.string().trim().min(1, "Short name is required.").max(60),
    headline: str(300),
    intro: str(1000),
    description: str(2000),
    technologies: z.array(z.object({ name: str(120), text: str(1000) })).max(20).default([]).transform((a) => a.filter((x) => x.name)),
    families: z.array(z.object({ code: str(10), name: str(120) })).max(20).default([]).transform((a) => a.filter((x) => x.name)),
    image,
    banner: image,
    faqs,
    seo,
    sortOrder: intish,
    status: STATUS,
  }),
  product: z.object({
    code: z.string().trim().min(2, "Product ID is required.").max(40),
    slug,
    segmentSlug: z.string().min(1, "Choose a segment."),
    family: str(120),
    name: z.string().trim().min(2, "Name is required.").max(160),
    shortName: opt(80),
    headline: str(300),
    summary: str(800),
    overview: list,
    highlights: list,
    applications: list,
    formats: list,
    materials: list,
    specs: z.array(z.object({ label: str(200), value: str(600), status: z.enum(["option", "reference", "confirm"]).default("confirm") })).max(60).default([]).transform((a) => a.filter((x) => x.label && x.value)),
    printing: list,
    customisation: list,
    quality: list,
    faqs,
    images: z.array(image).max(20).default([]).transform((a) => a.filter((x): x is NonNullable<typeof x> => Boolean(x))),
    videoUrl: opt(500),
    flyer: z.object({ url: z.string().max(1000), mediaId: z.string().optional(), updatedAt: z.string().optional() }).nullish().transform((v) => (v?.url ? v : null)),
    quoteProfile: z.enum(["corrugated", "carton", "cup", "foodservice", "film", "pouch", "custom"]),
    availability: z.enum(["offered", "manufactured", "sourced", "custom", "pending"]),
    verification: z.enum(["verified", "unverified"]),
    moq: opt(200),
    leadTime: opt(200),
    specNote: opt(1000),
    keywords: list,
    seo,
    sortOrder: intish,
    status: STATUS,
    publishedAt: date,
    industryLinks: z.array(z.object({ slug: z.string(), context: str(160), relevance: z.enum(["primary", "secondary"]).default("primary") })).max(40).default([]),
    related: z.array(z.string()).max(12).default([]),
  }),
  industry: z.object({
    slug,
    name: z.string().trim().min(2, "Name is required.").max(160),
    shortName: str(80),
    sectorSlug: z.string().default(""),
    headline: str(300),
    intro: str(1500),
    subIndustries: list,
    challenges: z.array(z.object({ title: str(160), text: str(800) })).max(12).default([]).transform((a) => a.filter((x) => x.title)),
    considerations: list,
    faqs,
    icon: str(40),
    image,
    banner: image,
    isCatchAll: z.boolean().default(false),
    seo,
    sortOrder: intish,
    status: STATUS,
    productLinks: z.array(z.object({ slug: z.string(), context: str(160), relevance: z.enum(["primary", "secondary"]).default("primary") })).max(120).default([]),
  }),
  page: z.object({
    slug: pathSlug,
    title: z.string().trim().min(1, "Title is required.").max(160),
    navLabel: opt(80),
    template: str(40),
    sections: z.array(z.object({ id: z.string().max(40), type: z.string().max(40), enabled: z.boolean(), data: z.record(z.string(), z.unknown()) })).max(60).default([]),
    seo,
    status: STATUS,
    publishedAt: date,
  }),
  post: z.object({
    slug,
    title: z.string().trim().min(2, "Title is required.").max(200),
    excerpt: str(500),
    intro: str(2000),
    categorySlug: z.string().default(""),
    tags: list,
    author: str(120),
    cover: image,
    videoUrl: opt(500),
    bodyText: z.array(z.object({ heading: str(200), text: z.string().max(30000).default("") })).max(40).default([]),
    recommendations: list,
    faqs,
    relatedProducts: z.array(z.string()).max(12).default([]),
    relatedPosts: z.array(z.string()).max(6).default([]),
    reviewStatus: z.enum(["pending", "reviewed"]),
    reviewer: opt(120),
    seo,
    status: STATUS,
    publishedAt: date,
  }),
  resource: z.object({
    slug,
    title: z.string().trim().min(2, "Title is required.").max(200),
    description: str(800),
    kind: z.enum(["catalogue", "profile", "brochure", "technical", "flyer"]),
    file: z.object({ url: z.string().min(1).max(1000), mediaId: z.string().optional(), updatedAt: z.string().optional() }, { message: "Upload or choose a PDF." }),
    sortOrder: intish,
    status: STATUS,
  }),
} as const;

const PERMS: Record<EntityType, { edit: Perm; publish: Perm }> = {
  segment: { edit: "catalog.edit", publish: "catalog.publish" },
  product: { edit: "catalog.edit", publish: "catalog.publish" },
  industry: { edit: "catalog.edit", publish: "catalog.publish" },
  page: { edit: "content.edit", publish: "content.publish" },
  post: { edit: "content.edit", publish: "content.publish" },
  resource: { edit: "content.edit", publish: "content.publish" },
};

const PUBLISHING = new Set(["approved", "published", "archived"]);

function zodFields(e: z.ZodError) {
  const out: Record<string, string> = {};
  for (const i of e.issues) out[i.path.join(".") || "form"] = `${i.path.length ? `${i.path.join(" › ")}: ` : ""}${i.message}`;
  return out;
}

/* ── Markdown ↔ post blocks (post bodies are edited as Markdown per section) ── */

export function blocksToText(blocks: PostBlock[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "p": return b.text;
        case "h3": return `### ${b.text}`;
        case "note": return `> ${b.text}`;
        case "ul": return b.items.map((x) => `- ${x}`).join("\n");
        case "ol": return b.items.map((x, i) => `${i + 1}. ${x}`).join("\n");
        case "table": return [b.caption ? `Table: ${b.caption}` : "", `| ${b.head.join(" | ")} |`, `| ${b.head.map(() => "---").join(" | ")} |`, ...b.rows.map((r) => `| ${r.join(" | ")} |`)].filter(Boolean).join("\n");
        case "image": return `![${b.image.alt}](${b.image.url})`;
      }
    })
    .join("\n\n");
}

export function textToBlocks(text: string): PostBlock[] {
  return text
    .replace(/\r/g, "")
    .split(/\n{2,}/)
    .map((chunk): PostBlock | null => {
      const lines = chunk.split("\n").filter((l) => l.trim());
      if (!lines.length) return null;
      if (lines[0].startsWith("### ")) return { type: "h3", text: lines[0].slice(4).trim() };
      if (lines.every((l) => l.startsWith("> "))) return { type: "note", text: lines.map((l) => l.slice(2)).join(" ") };
      if (lines.every((l) => /^[-*] /.test(l))) return { type: "ul", items: lines.map((l) => l.slice(2).trim()) };
      if (lines.every((l) => /^\d+\. /.test(l))) return { type: "ol", items: lines.map((l) => l.replace(/^\d+\. /, "").trim()) };
      const img = lines.length === 1 && lines[0].match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
      if (img) return { type: "image", image: { url: img[2], alt: img[1] } };
      const caption = lines[0].startsWith("Table: ") ? lines.shift()!.slice(7) : undefined;
      if (lines.length >= 2 && lines.every((l) => l.trim().startsWith("|"))) {
        const cells = (l: string) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
        const rows = lines.filter((l) => !/^\|?\s*-{3,}/.test(l.trim().replace(/^\|/, "").trim()) && !/^\|?(\s*-+\s*\|)+/.test(l.trim()));
        return { type: "table", head: cells(rows[0]), rows: rows.slice(1).map(cells), caption };
      }
      return { type: "p", text: lines.join(" ") };
    })
    .filter((b): b is PostBlock => Boolean(b));
}

/* ── Load for editing ─────────────────────────────────────────────── */

export async function loadForEdit(entity: EntityType, id: number) {
  const db = await getDb();
  switch (entity) {
    case "segment": {
      const [r] = await db.select().from(t.segments).where(eq(t.segments.id, id));
      return r ?? null;
    }
    case "product": {
      const [r] = await db.select().from(t.products).where(eq(t.products.id, id));
      if (!r) return null;
      const [seg] = await db.select().from(t.segments).where(eq(t.segments.id, r.segmentId));
      const links = await db.select({ slug: t.industries.slug, context: t.productIndustries.context, relevance: t.productIndustries.relevance }).from(t.productIndustries).innerJoin(t.industries, eq(t.industries.id, t.productIndustries.industryId)).where(eq(t.productIndustries.productId, id)).orderBy(asc(t.industries.sortOrder));
      const rel = await db.select({ slug: t.products.slug }).from(t.productRelations).innerJoin(t.products, eq(t.products.id, t.productRelations.relatedId)).where(eq(t.productRelations.productId, id)).orderBy(asc(t.productRelations.sortOrder));
      return { ...r, segmentSlug: seg?.slug ?? "", publishedAt: r.publishedAt ? toLocal(r.publishedAt) : "", industryLinks: links.map((l) => ({ slug: l.slug, context: l.context ?? "", relevance: l.relevance })), related: rel.map((x) => x.slug) };
    }
    case "industry": {
      const [r] = await db.select().from(t.industries).where(eq(t.industries.id, id));
      if (!r) return null;
      const sector = r.sectorId ? (await db.select().from(t.industrySectors).where(eq(t.industrySectors.id, r.sectorId)))[0] : null;
      const links = await db.select({ slug: t.products.slug, context: t.productIndustries.context, relevance: t.productIndustries.relevance }).from(t.productIndustries).innerJoin(t.products, eq(t.products.id, t.productIndustries.productId)).where(eq(t.productIndustries.industryId, id)).orderBy(asc(t.productIndustries.sortOrder));
      return { ...r, sectorSlug: sector?.slug ?? "", productLinks: links.map((l) => ({ slug: l.slug, context: l.context ?? "", relevance: l.relevance })) };
    }
    case "page": {
      const [r] = await db.select().from(t.pages).where(eq(t.pages.id, id));
      return r ? { ...r, publishedAt: r.publishedAt ? toLocal(r.publishedAt) : "" } : null;
    }
    case "post": {
      const [r] = await db.select().from(t.posts).where(eq(t.posts.id, id));
      if (!r) return null;
      const cat = r.categoryId ? (await db.select().from(t.postCategories).where(eq(t.postCategories.id, r.categoryId)))[0] : null;
      return { ...r, categorySlug: cat?.slug ?? "", publishedAt: r.publishedAt ? toLocal(r.publishedAt) : "", bodyText: r.body.map((s) => ({ heading: s.heading, text: blocksToText(s.blocks) })) };
    }
    case "resource": {
      const [r] = await db.select().from(t.resources).where(eq(t.resources.id, id));
      return r ? { ...r, file: { url: r.fileUrl, mediaId: r.mediaId ?? undefined } } : null;
    }
  }
}

const toLocal = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

/* ── Save ─────────────────────────────────────────────────────────── */

export async function saveEntity(entity: EntityType, id: number | null, raw: unknown, opts: { redirectOld?: boolean } = {}): Promise<ActionResult<{ id: number }>> {
  try {
    const rawObj = (raw ?? {}) as Record<string, unknown>;
    const user = await authorize(PUBLISHING.has(String(rawObj.status)) ? PERMS[entity].publish : PERMS[entity].edit);
    const parsed = schemas[entity].safeParse(raw);
    if (!parsed.success) return { ok: false, error: "Some fields need attention.", fields: zodFields(parsed.error) };
    const v = parsed.data as Record<string, unknown>;
    const db = await getDb();
    let newId = id ?? 0;
    let oldPath: string | null = null;
    let newPath: string | null = null;

    if (entity === "segment") {
      const d = v as z.infer<typeof schemas.segment>;
      if (await taken(t.segments, d.slug, id)) return { ok: false, error: "Slug already in use.", fields: { slug: "Another segment uses this slug." } };
      if (id) {
        const [old] = await db.select().from(t.segments).where(eq(t.segments.id, id));
        oldPath = old ? `/products/${old.slug}` : null;
        await db.update(t.segments).set({ ...d, updatedAt: new Date() }).where(eq(t.segments.id, id));
      } else newId = (await db.insert(t.segments).values(d).returning({ id: t.segments.id }))[0].id;
      newPath = `/products/${d.slug}`;
    }

    if (entity === "product") {
      const { segmentSlug, industryLinks, related, ...d } = v as z.infer<typeof schemas.product>;
      const [seg] = await db.select().from(t.segments).where(eq(t.segments.slug, segmentSlug));
      if (!seg) return { ok: false, error: "Choose a valid segment.", fields: { segmentSlug: "Segment not found." } };
      if (await taken(t.products, d.slug, id)) return { ok: false, error: "Slug already in use.", fields: { slug: "Another product uses this slug." } };
      const codeClash = await db.select({ id: t.products.id }).from(t.products).where(id ? and(eq(t.products.code, d.code), ne(t.products.id, id)) : eq(t.products.code, d.code));
      if (codeClash.length) return { ok: false, error: "Product ID already in use.", fields: { code: "Each product needs a unique ID." } };
      const values = { ...d, segmentId: seg.id, publishedAt: d.publishedAt ?? (d.status === "published" ? new Date() : null) };
      if (id) {
        const [old] = await db.select({ slug: t.products.slug, segmentId: t.products.segmentId }).from(t.products).where(eq(t.products.id, id));
        const [oldSeg] = old ? await db.select().from(t.segments).where(eq(t.segments.id, old.segmentId)) : [];
        oldPath = old && oldSeg ? `/products/${oldSeg.slug}/${old.slug}` : null;
        await db.update(t.products).set({ ...values, updatedAt: new Date() }).where(eq(t.products.id, id));
      } else newId = (await db.insert(t.products).values(values).returning({ id: t.products.id }))[0].id;
      newPath = `/products/${seg.slug}/${d.slug}`;
      // Industry relationships (many-to-many) and related products
      const inds = await db.select({ id: t.industries.id, slug: t.industries.slug }).from(t.industries);
      await db.delete(t.productIndustries).where(eq(t.productIndustries.productId, newId));
      const seen = new Set<number>();
      const rows = industryLinks.map((l, i) => ({ productId: newId, industryId: inds.find((x) => x.slug === l.slug)?.id ?? 0, context: l.context || null, relevance: l.relevance, sortOrder: 100 + i })).filter((r) => r.industryId && !seen.has(r.industryId) && seen.add(r.industryId));
      if (rows.length) await db.insert(t.productIndustries).values(rows);
      const prods = await db.select({ id: t.products.id, slug: t.products.slug }).from(t.products);
      await db.delete(t.productRelations).where(eq(t.productRelations.productId, newId));
      const relRows = [...new Set(related)].map((s, i) => ({ productId: newId, relatedId: prods.find((p) => p.slug === s)?.id ?? 0, sortOrder: i })).filter((r) => r.relatedId && r.relatedId !== newId);
      if (relRows.length) await db.insert(t.productRelations).values(relRows);
    }

    if (entity === "industry") {
      const { sectorSlug, productLinks, ...d } = v as z.infer<typeof schemas.industry>;
      if (await taken(t.industries, d.slug, id)) return { ok: false, error: "Slug already in use.", fields: { slug: "Another industry uses this slug." } };
      const [sector] = sectorSlug ? await db.select().from(t.industrySectors).where(eq(t.industrySectors.slug, sectorSlug)) : [];
      const values = { ...d, sectorId: sector?.id ?? null };
      if (id) {
        const [old] = await db.select({ slug: t.industries.slug }).from(t.industries).where(eq(t.industries.id, id));
        oldPath = old ? `/industries/${old.slug}` : null;
        await db.update(t.industries).set({ ...values, updatedAt: new Date() }).where(eq(t.industries.id, id));
      } else newId = (await db.insert(t.industries).values(values).returning({ id: t.industries.id }))[0].id;
      newPath = `/industries/${d.slug}`;
      const prods = await db.select({ id: t.products.id, slug: t.products.slug }).from(t.products);
      await db.delete(t.productIndustries).where(eq(t.productIndustries.industryId, newId));
      const seen = new Set<number>();
      const rows = productLinks.map((l, i) => ({ productId: prods.find((p) => p.slug === l.slug)?.id ?? 0, industryId: newId, context: l.context || null, relevance: l.relevance, sortOrder: i })).filter((r) => r.productId && !seen.has(r.productId) && seen.add(r.productId));
      if (rows.length) await db.insert(t.productIndustries).values(rows);
    }

    if (entity === "page") {
      const d = v as z.infer<typeof schemas.page>;
      if (await taken(t.pages, d.slug, id)) return { ok: false, error: "Path already in use.", fields: { slug: "Another page uses this path." } };
      const reserved = ["products", "industries", "knowledge", "resources", "contact", "request-a-quote", "custom-requirement", "admin", "api", "media", "preview", "enquiry-received"];
      if (reserved.includes(d.slug.split("/")[0]) && d.slug !== "home") return { ok: false, error: "That path is reserved by the website.", fields: { slug: `“/${d.slug.split("/")[0]}” is a system route.` } };
      const values = { ...d, sections: d.sections as never, publishedAt: d.publishedAt ?? (d.status === "published" ? new Date() : null), updatedBy: user.email };
      if (id) {
        const [old] = await db.select({ slug: t.pages.slug, system: t.pages.system }).from(t.pages).where(eq(t.pages.id, id));
        if (old?.system && old.slug !== d.slug) return { ok: false, error: "System pages keep their path.", fields: { slug: "This page's path cannot change." } };
        oldPath = old ? `/${old.slug}` : null;
        await db.update(t.pages).set({ ...values, updatedAt: new Date() }).where(eq(t.pages.id, id));
      } else newId = (await db.insert(t.pages).values(values).returning({ id: t.pages.id }))[0].id;
      newPath = d.slug === "home" ? "/" : `/${d.slug}`;
    }

    if (entity === "post") {
      const { categorySlug, bodyText, ...d } = v as z.infer<typeof schemas.post>;
      if (await taken(t.posts, d.slug, id)) return { ok: false, error: "Slug already in use.", fields: { slug: "Another article uses this slug." } };
      if (d.reviewStatus === "reviewed" && !d.reviewer) return { ok: false, error: "Name the technical reviewer.", fields: { reviewer: "A reviewed article needs a named reviewer." } };
      const [cat] = categorySlug ? await db.select().from(t.postCategories).where(eq(t.postCategories.slug, categorySlug)) : [];
      const body: PostBlockSection[] = bodyText.filter((s) => s.heading || s.text).map((s) => ({ heading: s.heading, blocks: textToBlocks(s.text) }));
      const values = { ...d, body, categoryId: cat?.id ?? null, publishedAt: d.publishedAt ?? (d.status === "published" ? new Date() : null) };
      if (id) {
        const [old] = await db.select({ slug: t.posts.slug }).from(t.posts).where(eq(t.posts.id, id));
        oldPath = old ? `/knowledge/${old.slug}` : null;
        await db.update(t.posts).set({ ...values, updatedAt: new Date() }).where(eq(t.posts.id, id));
      } else newId = (await db.insert(t.posts).values(values).returning({ id: t.posts.id }))[0].id;
      newPath = `/knowledge/${d.slug}`;
    }

    if (entity === "resource") {
      const { file, ...d } = v as z.infer<typeof schemas.resource>;
      if (await taken(t.resources, d.slug, id)) return { ok: false, error: "Slug already in use.", fields: { slug: "Another resource uses this slug." } };
      const values = { ...d, fileUrl: file.url, mediaId: file.mediaId ?? null };
      if (id) await db.update(t.resources).set({ ...values, updatedAt: new Date() }).where(eq(t.resources.id, id));
      else newId = (await db.insert(t.resources).values(values).returning({ id: t.resources.id }))[0].id;
    }

    let redirected = false;
    if (opts.redirectOld && oldPath && newPath && oldPath !== newPath) {
      await db.insert(t.redirects).values({ fromPath: oldPath, toPath: newPath, permanent: true, note: `Automatic: ${entity} URL changed by ${user.email}` }).onConflictDoUpdate({ target: t.redirects.fromPath, set: { toPath: newPath } });
      // Avoid chains: anything pointing at the old path now points at the new one.
      await db.update(t.redirects).set({ toPath: newPath }).where(eq(t.redirects.toPath, oldPath));
      await db.delete(t.redirects).where(eq(t.redirects.fromPath, newPath));
      redirected = true;
    }
    await snapshot(user, entity, newId, v, id ? undefined : "Created");
    await audit(user, id ? "update" : "create", entity, newId, `${String(v.name ?? v.title ?? v.slug)} (${String(v.status ?? "")})`);
    refreshSite();
    return { ok: true, data: { id: newId }, message: `${id ? "Saved" : "Created"}${v.status === "published" ? " and published" : ""}.${redirected ? ` Redirect created from ${oldPath}.` : ""}` };
  } catch (e) {
    if (e instanceof AuthError) return { ok: false, error: e.message };
    console.error("[admin] save failed", e);
    return { ok: false, error: "The change could not be saved. Please try again." };
  }
}

async function taken(table: typeof t.segments | typeof t.products | typeof t.industries | typeof t.pages | typeof t.posts | typeof t.resources, value: string, id: number | null) {
  const db = await getDb();
  const rows = await db.select({ id: table.id }).from(table).where(id ? and(eq(table.slug, value), ne(table.id, id)) : eq(table.slug, value));
  return rows.length > 0;
}

/* ── Delete / duplicate / reorder / revisions ─────────────────────── */

export async function deleteEntity(entity: EntityType, id: number, opts: { reassignTo?: number } = {}): Promise<ActionResult> {
  try {
    const user = await authorize(PERMS[entity].publish);
    const db = await getDb();
    if (entity === "segment") {
      const n = (await db.select({ id: t.products.id }).from(t.products).where(eq(t.products.segmentId, id))).length;
      if (n && !opts.reassignTo) return { ok: false, error: `This segment contains ${n} products. Reassign them to another segment first (Segments list → Reassign & delete), or archive the segment instead.` };
      if (n && opts.reassignTo) await db.update(t.products).set({ segmentId: opts.reassignTo }).where(eq(t.products.segmentId, id));
      await db.delete(t.segments).where(eq(t.segments.id, id));
    }
    if (entity === "product") await db.delete(t.products).where(eq(t.products.id, id));
    if (entity === "industry") await db.delete(t.industries).where(eq(t.industries.id, id));
    if (entity === "page") {
      const [p] = await db.select().from(t.pages).where(eq(t.pages.id, id));
      if (p?.system) return { ok: false, error: "System pages (homepage, legal pages) cannot be deleted. Unpublish or edit them instead." };
      await db.delete(t.pages).where(eq(t.pages.id, id));
    }
    if (entity === "post") await db.delete(t.posts).where(eq(t.posts.id, id));
    if (entity === "resource") await db.delete(t.resources).where(eq(t.resources.id, id));
    await audit(user, "delete", entity, id);
    refreshSite();
    return { ok: true, message: "Deleted." };
  } catch (e) {
    if (e instanceof AuthError) return { ok: false, error: e.message };
    console.error(e);
    return { ok: false, error: "Delete failed." };
  }
}

export async function duplicateProduct(id: number): Promise<ActionResult<{ id: number }>> {
  try {
    const user = await authorize("catalog.edit");
    const db = await getDb();
    const [p] = await db.select().from(t.products).where(eq(t.products.id, id));
    if (!p) return { ok: false, error: "Product not found." };
    const { id: _omit, createdAt: _c, updatedAt: _u, ...rest } = p;
    void _omit; void _c; void _u;
    let n = 1;
    while ((await db.select({ id: t.products.id }).from(t.products).where(eq(t.products.slug, `${p.slug}-copy${n > 1 ? `-${n}` : ""}`))).length) n++;
    const suffix = `copy${n > 1 ? `-${n}` : ""}`;
    const [row] = await db.insert(t.products).values({ ...rest, slug: `${p.slug}-${suffix}`, code: `${p.code}-${suffix.toUpperCase()}`, name: `${p.name} (copy)`, status: "draft", publishedAt: null }).returning({ id: t.products.id });
    const links = await db.select().from(t.productIndustries).where(eq(t.productIndustries.productId, id));
    if (links.length) await db.insert(t.productIndustries).values(links.map((l) => ({ ...l, productId: row.id })));
    await audit(user, "duplicate", "product", row.id, `from ${p.slug}`);
    return { ok: true, data: { id: row.id } };
  } catch (e) {
    return { ok: false, error: e instanceof AuthError ? e.message : "Duplicate failed." };
  }
}

export async function reorder(entity: "segment" | "industry" | "product" | "page" | "resource", ids: number[]): Promise<ActionResult> {
  try {
    const user = await authorize(entity === "page" || entity === "resource" ? "content.edit" : "catalog.edit");
    const db = await getDb();
    const table = { segment: t.segments, industry: t.industries, product: t.products, page: t.pages, resource: t.resources }[entity];
    for (const [i, id] of ids.entries()) await db.update(table).set({ sortOrder: i }).where(eq(table.id, id));
    await audit(user, "reorder", entity, null, `${ids.length} items`);
    refreshSite();
    return { ok: true, message: "Order saved." };
  } catch (e) {
    return { ok: false, error: e instanceof AuthError ? e.message : "Reorder failed." };
  }
}

export async function bulkStatus(entity: "product" | "post" | "page" | "industry", ids: number[], status: z.infer<typeof STATUS>): Promise<ActionResult> {
  try {
    const user = await authorize(PERMS[entity].publish);
    const db = await getDb();
    const table = { product: t.products, post: t.posts, page: t.pages, industry: t.industries }[entity];
    for (const id of ids) await db.update(table).set({ status, updatedAt: new Date() }).where(eq(table.id, id));
    if (status === "published" && (entity === "product" || entity === "post" || entity === "page")) {
      const tb = entity === "product" ? t.products : entity === "post" ? t.posts : t.pages;
      for (const id of ids) await db.update(tb).set({ publishedAt: sql`coalesce(${tb.publishedAt}, now())` }).where(eq(tb.id, id));
    }
    await audit(user, "bulk_status", entity, null, `${ids.length} → ${status}`);
    refreshSite();
    return { ok: true, message: `${ids.length} item(s) set to ${status.replace("_", " ")}.` };
  } catch (e) {
    return { ok: false, error: e instanceof AuthError ? e.message : "Bulk update failed." };
  }
}

export async function revisions(entity: EntityType, id: number): Promise<ActionResult> {
  try {
    await authorize(PERMS[entity].edit === "catalog.edit" ? "catalog.view" : "content.view");
    const db = await getDb();
    const rows = await db.select().from(t.revisions).where(and(eq(t.revisions.entityType, entity), eq(t.revisions.entityId, String(id)))).orderBy(desc(t.revisions.createdAt)).limit(30);
    return { ok: true, data: rows.map((r) => ({ id: r.id, userEmail: r.userEmail, note: r.note, createdAt: r.createdAt.toISOString(), data: r.data })) };
  } catch (e) {
    return { ok: false, error: e instanceof AuthError ? e.message : "Could not load history." };
  }
}
