import "server-only";
import { cache } from "react";
import { and, asc, desc, eq, inArray, isNull, lte, or, sql } from "drizzle-orm";
import { getDb, schema as t } from "@/db";
import { DEFAULT_FOOTER, DEFAULT_NAV, DEFAULT_SEO, DEFAULT_SITE, DEFAULT_THEME } from "@/db/defaults";
import type { FooterSettings, ImageRef, NavItem, SeoSettings, SiteSettings, ThemeSettings } from "@/db/types";

export type Segment = typeof t.segments.$inferSelect;
export type Product = typeof t.products.$inferSelect;
export type Industry = typeof t.industries.$inferSelect;
export type Page = typeof t.pages.$inferSelect;
export type Post = typeof t.posts.$inferSelect;
export type Resource = typeof t.resources.$inferSelect;

import type { AnyPgColumn } from "drizzle-orm/pg-core";
const publishedNow = (col: AnyPgColumn) => or(isNull(col), lte(col, sql`now()`));

/* ── Settings ─────────────────────────────────────────────────────── */

export const getSettingsMap = cache(async () => {
  const db = await getDb();
  const rows = await db.select().from(t.settings);
  return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, unknown>;
});

export async function getSiteSettings(): Promise<SiteSettings> {
  return { ...DEFAULT_SITE(), ...((await getSettingsMap()).site as Partial<SiteSettings>) };
}
export async function getTheme(): Promise<ThemeSettings> {
  return { ...DEFAULT_THEME, ...((await getSettingsMap()).theme as Partial<ThemeSettings>) };
}
export async function getNavigation(): Promise<NavItem[]> {
  return ((await getSettingsMap()).navigation as NavItem[]) ?? DEFAULT_NAV;
}
export async function getFooter(): Promise<FooterSettings> {
  return { ...DEFAULT_FOOTER, ...((await getSettingsMap()).footer as Partial<FooterSettings>) };
}
export async function getSeoSettings(): Promise<SeoSettings> {
  return { ...DEFAULT_SEO, ...((await getSettingsMap()).seo as Partial<SeoSettings>) };
}

/* ── URLs ─────────────────────────────────────────────────────────── */

export const segmentUrl = (s: Pick<Segment, "slug">) => `/products/${s.slug}`;
export const productUrl = (segSlug: string, p: Pick<Product, "slug">) => `/products/${segSlug}/${p.slug}`;
export const industryUrl = (i: Pick<Industry, "slug">) => `/industries/${i.slug}`;
export const postUrl = (p: Pick<Post, "slug">) => `/knowledge/${p.slug}`;
/** Flyer URL, or null when no flyer has been uploaded (no link is shown rather than a broken one). */
export const flyerHref = (p: Pick<Product, "flyer">): string | null => p.flyer?.url || null;

/* ── Catalogue ────────────────────────────────────────────────────── */

export const getSegments = cache(async () => {
  const db = await getDb();
  return db.select().from(t.segments).where(eq(t.segments.status, "published")).orderBy(asc(t.segments.sortOrder), asc(t.segments.id));
});

export const getSegmentBySlug = cache(async (slug: string) => (await getSegments()).find((s) => s.slug === slug));

export const getProducts = cache(async () => {
  const db = await getDb();
  const segs = await getSegments();
  const segIds = segs.map((s) => s.id);
  if (!segIds.length) return [];
  return db
    .select()
    .from(t.products)
    .where(and(eq(t.products.status, "published"), publishedNow(t.products.publishedAt), inArray(t.products.segmentId, segIds)))
    .orderBy(asc(t.products.sortOrder), asc(t.products.id));
});

export const getIndustries = cache(async () => {
  const db = await getDb();
  return db.select().from(t.industries).where(eq(t.industries.status, "published")).orderBy(asc(t.industries.sortOrder), asc(t.industries.id));
});

export const getSectors = cache(async () => {
  const db = await getDb();
  return db.select().from(t.industrySectors).orderBy(asc(t.industrySectors.sortOrder));
});

/** All product↔industry links between published records. */
export const getLinks = cache(async () => {
  const db = await getDb();
  const [products, industries] = await Promise.all([getProducts(), getIndustries()]);
  const pIds = new Set(products.map((p) => p.id));
  const iIds = new Set(industries.map((i) => i.id));
  const rows = await db.select().from(t.productIndustries).orderBy(asc(t.productIndustries.sortOrder));
  return rows.filter((r) => pIds.has(r.productId) && iIds.has(r.industryId));
});

/** Light, serialisable product record for cards, discovery and filters. */
export interface ProductCard {
  id: number;
  code: string;
  slug: string;
  name: string;
  shortName: string;
  summary: string;
  family: string;
  segment: { id: number; slug: string; code: string; name: string; navName: string };
  materials: string[];
  applications: string[];
  formats: string[];
  image: ImageRef | null;
  url: string;
  flyer: string | null;
  availability: Product["availability"];
  industryIds: number[];
  quoteProfile: string;
}

export const getCatalog = cache(async () => {
  const [segments, products, industries, links, sectors] = await Promise.all([getSegments(), getProducts(), getIndustries(), getLinks(), getSectors()]);
  const segById = new Map(segments.map((s) => [s.id, s]));
  const byProduct = new Map<number, number[]>();
  for (const l of links) byProduct.set(l.productId, [...(byProduct.get(l.productId) ?? []), l.industryId]);
  const cards: ProductCard[] = products.map((p) => {
    const s = segById.get(p.segmentId)!;
    return {
      id: p.id,
      code: p.code,
      slug: p.slug,
      name: p.name,
      shortName: p.shortName || p.name,
      summary: p.summary,
      family: p.family,
      segment: { id: s.id, slug: s.slug, code: s.code, name: s.name, navName: s.navName },
      materials: p.materials,
      applications: p.applications,
      formats: p.formats,
      image: p.images[0] ?? null,
      url: productUrl(s.slug, p),
      flyer: flyerHref(p),
      availability: p.availability,
      industryIds: byProduct.get(p.id) ?? [],
      quoteProfile: p.quoteProfile,
    };
  });
  const linkOrder = new Map(links.map((l) => [`${l.industryId}:${l.productId}`, l]));
  return { segments, products, industries, sectors, cards, links, linkOrder };
});

export async function getProductBySlugs(segSlug: string, slug: string) {
  const seg = await getSegmentBySlug(segSlug);
  if (!seg) return null;
  const product = (await getProducts()).find((p) => p.slug === slug && p.segmentId === seg.id);
  if (!product) return null;
  const db = await getDb();
  const [{ cards, industries, links }, rel] = await Promise.all([
    getCatalog(),
    db.select().from(t.productRelations).where(eq(t.productRelations.productId, product.id)).orderBy(asc(t.productRelations.sortOrder)),
  ]);
  const related = rel.map((r) => cards.find((c) => c.id === r.relatedId)).filter((c): c is ProductCard => Boolean(c));
  const indIds = links.filter((l) => l.productId === product.id).map((l) => l.industryId);
  return { segment: seg, product, related, industries: industries.filter((i) => indIds.includes(i.id)) };
}

/** Products for an industry, in the admin-defined order (primary first). */
export async function getIndustryBySlug(slug: string) {
  const { industries, cards, links, sectors } = await getCatalog();
  const industry = industries.find((i) => i.slug === slug);
  if (!industry) return null;
  const mine = links.filter((l) => l.industryId === industry.id).sort((a, b) => (a.relevance === b.relevance ? a.sortOrder - b.sortOrder : a.relevance === "primary" ? -1 : 1));
  const products = mine.map((l) => ({ card: cards.find((c) => c.id === l.productId)!, context: l.context, relevance: l.relevance })).filter((x) => x.card);
  return { industry, products, sector: sectors.find((s) => s.id === industry.sectorId) ?? null };
}

/* ── CMS ──────────────────────────────────────────────────────────── */

export const getPage = cache(async (slug: string) => {
  const db = await getDb();
  const [page] = await db
    .select()
    .from(t.pages)
    .where(and(eq(t.pages.slug, slug), eq(t.pages.status, "published"), publishedNow(t.pages.publishedAt)))
    .limit(1);
  return page ?? null;
});

export const getPublishedPages = cache(async () => {
  const db = await getDb();
  return db.select({ slug: t.pages.slug, title: t.pages.title, updatedAt: t.pages.updatedAt, seo: t.pages.seo }).from(t.pages).where(and(eq(t.pages.status, "published"), publishedNow(t.pages.publishedAt)));
});

export const getPostCategories = cache(async () => {
  const db = await getDb();
  return db.select().from(t.postCategories).orderBy(asc(t.postCategories.sortOrder));
});

export const getPosts = cache(async () => {
  const db = await getDb();
  return db.select().from(t.posts).where(and(eq(t.posts.status, "published"), publishedNow(t.posts.publishedAt))).orderBy(desc(t.posts.publishedAt), desc(t.posts.id));
});

export const getPost = cache(async (slug: string) => (await getPosts()).find((p) => p.slug === slug) ?? null);

export const getResources = cache(async () => {
  const db = await getDb();
  return db.select().from(t.resources).where(eq(t.resources.status, "published")).orderBy(asc(t.resources.sortOrder));
});

/** Looks up a managed redirect for a path that would otherwise 404. */
export async function findRedirect(path: string) {
  const db = await getDb();
  const clean = path.replace(/\/+$/, "") || "/";
  const [row] = await db.select().from(t.redirects).where(eq(t.redirects.fromPath, clean)).limit(1);
  if (!row) return null;
  db.update(t.redirects).set({ hits: sql`${t.redirects.hits} + 1` }).where(eq(t.redirects.id, row.id)).catch(() => {});
  return row;
}

export const readingMinutes = (p: Post) => {
  const words = [p.intro, ...p.body.flatMap((s) => [s.heading, ...s.blocks.map((b) => ("text" in b ? b.text : "items" in b ? b.items.join(" ") : "rows" in b ? b.rows.flat().join(" ") : ""))])].join(" ").split(/\s+/).length;
  return Math.max(3, Math.round(words / 200));
};

