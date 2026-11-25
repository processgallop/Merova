/**
 * First-run seed. Runs once, when the catalogue is empty. Converts the
 * verified content in src/db/seed/* into database records; from then on the
 * database (managed through /admin) is the single source of truth.
 */
import { randomBytes } from "node:crypto";
import { sql } from "drizzle-orm";
import type { DB } from "./index";
import * as t from "./schema";
import { DEFAULT_FOOTER, DEFAULT_NAV, DEFAULT_SEO, DEFAULT_SITE, DEFAULT_THEME } from "./defaults";
import { hashPassword } from "./password";
import type { ImageRef, PostBlockSection } from "./types";
import { industries as baseIndustries, products as baseProducts, verticals } from "./seed/catalog";
import { articles, CATEGORIES } from "./seed/blog";
import { CAPABILITY_PENDING, INDUSTRY_META, NEW_INDUSTRIES, NEW_PRODUCTS, PRODUCT_FAMILY, SECTORS, SEGMENT_FAMILIES } from "./seed/extra";
import { SEED_PAGES } from "./seed/pages";
import { STOCK } from "./seed/stock";
import type { ProductImage } from "./seed/types";

const img = (i: ProductImage): ImageRef => ({ url: i.src, alt: i.alt, kind: i.kind === "render" ? "render" : i.kind === "illustration" ? "illustration" : "representative" });
const stockRef = (key: string): ImageRef | null => {
  const s = STOCK[key];
  return s ? { url: `/assets/stock/${s.file}`, alt: s.alt, kind: "representative", credit: `${s.credit} / Unsplash` } : null;
};

export async function seedIfEmpty(db: DB, exec: (q: string) => Promise<unknown>) {
  const res = (await db.execute(sql`SELECT count(*)::int AS n FROM segments`)) as unknown;
  const list = (Array.isArray(res) ? res : (res as { rows?: unknown[] }).rows ?? []) as { n: number }[];
  const n = Number(list[0]?.n ?? 0);
  if (n > 0) {
    await ensureAdmin(db);
    return;
  }
  // Serialise concurrent first boots on real Postgres.
  if (process.env.DATABASE_URL) await exec(`SELECT pg_advisory_lock(424243)`);
  try {
    const again = (await db.select({ id: t.segments.id }).from(t.segments).limit(1)).length;
    if (again === 0) await seed(db);
  } finally {
    if (process.env.DATABASE_URL) await exec(`SELECT pg_advisory_unlock(424243)`);
  }
  await ensureAdmin(db);
}

async function ensureAdmin(db: DB) {
  const existing = await db.select({ id: t.users.id }).from(t.users).limit(1);
  if (existing.length) return;
  const email = (process.env.ADMIN_EMAIL || "admin@merova.local").toLowerCase();
  let password = process.env.ADMIN_PASSWORD;
  if (!password) {
    password = process.env.NODE_ENV === "production" ? randomBytes(12).toString("base64url") : "ChangeMe2026";
    console.warn(`[merova] Created initial super administrator ${email} with password: ${password} — change it on first sign-in.`);
  }
  await db.insert(t.users).values({
    email,
    name: "Super Administrator",
    role: "super_admin",
    passwordHash: await hashPassword(password),
    mustChangePassword: !process.env.ADMIN_PASSWORD,
  });
}

async function seed(db: DB) {
  const now = new Date();

  /* Segments */
  const segIds: Record<string, number> = {};
  for (const [i, v] of verticals.entries()) {
    const fam = SEGMENT_FAMILIES[v.id];
    const [row] = await db
      .insert(t.segments)
      .values({
        code: fam.code,
        slug: v.slug,
        name: v.name,
        navName: v.navName,
        headline: v.headline,
        intro: v.intro,
        description: v.description,
        technologies: v.technologies,
        families: fam.families,
        image: img(v.image),
        faqs: v.faqs,
        seo: { title: v.seo.title, description: v.seo.description, primary: v.seo.primary, secondary: v.seo.secondary },
        sortOrder: i,
        status: "published",
      })
      .returning({ id: t.segments.id });
    segIds[v.id] = row.id;
  }

  /* Products */
  const allProducts = [...baseProducts, ...NEW_PRODUCTS];
  const prodIds: Record<string, number> = {};
  const famCount: Record<string, number> = {};
  for (const [i, p] of allProducts.entries()) {
    const famCode = PRODUCT_FAMILY[p.slug] ?? `${SEGMENT_FAMILIES[p.vertical].code}1`;
    famCount[famCode] = (famCount[famCode] ?? 0) + 1;
    const family = SEGMENT_FAMILIES[p.vertical].families.find((f) => f.code === famCode)?.name ?? "";
    const availability = p.vertical === "custom" ? "custom" : CAPABILITY_PENDING.has(p.slug) ? "pending" : "offered";
    const [row] = await db
      .insert(t.products)
      .values({
        code: `MRV-${famCode}-${String(famCount[famCode]).padStart(2, "0")}`,
        slug: p.slug,
        segmentId: segIds[p.vertical],
        family,
        name: p.name,
        shortName: p.shortName ?? null,
        headline: p.headline,
        summary: p.summary,
        overview: p.overview,
        highlights: p.applications.slice(0, 3),
        applications: p.applications,
        formats: p.formats,
        materials: p.materials,
        specs: p.specs,
        printing: p.printing,
        customisation: p.customisation,
        quality: p.quality,
        faqs: p.faqs,
        images: [img(p.image)],
        flyer: NEW_PRODUCTS.some((n) => n.slug === p.slug) ? null : { url: `/assets/downloads/flyers/merova-${p.slug}-flyer.pdf` },
        quoteProfile: p.quoteProfile,
        availability,
        verification: "unverified",
        specNote: p.specNote ?? null,
        keywords: [p.seo.primary, ...p.seo.secondary],
        seo: { title: p.seo.title, description: p.seo.description, primary: p.seo.primary, secondary: p.seo.secondary },
        sortOrder: i,
        status: "published",
        publishedAt: now,
      })
      .returning({ id: t.products.id });
    prodIds[p.slug] = row.id;
  }
  for (const p of allProducts) {
    const rel = p.related.filter((r) => prodIds[r]).map((r, i) => ({ productId: prodIds[p.slug], relatedId: prodIds[r], sortOrder: i }));
    if (rel.length) await db.insert(t.productRelations).values(rel).onConflictDoNothing();
  }

  /* Sectors + industries */
  const sectorIds: Record<string, number> = {};
  for (const [i, s] of SECTORS.entries()) {
    const [row] = await db.insert(t.industrySectors).values({ slug: s.slug, name: s.name, sortOrder: i }).returning({ id: t.industrySectors.id });
    sectorIds[s.slug] = row.id;
  }
  const allIndustries = [...baseIndustries.map((x) => ({ ...x, isCatchAll: false })), ...NEW_INDUSTRIES];
  const indIds: Record<string, number> = {};
  for (const ind of allIndustries) {
    const meta = INDUSTRY_META[ind.id];
    const photo = stockRef(ind.id);
    const [row] = await db
      .insert(t.industries)
      .values({
        slug: ind.slug,
        name: ind.name,
        shortName: ind.shortName,
        sectorId: sectorIds[meta.sector],
        headline: ind.headline,
        intro: ind.intro,
        subIndustries: meta.sub,
        challenges: ind.challenges,
        considerations: ind.considerations,
        faqs: ind.faqs,
        icon: ind.icon,
        image: photo ?? { url: ind.image, alt: `${ind.name} packaging`, kind: "render" },
        banner: photo,
        isCatchAll: Boolean(ind.isCatchAll),
        seo: { title: ind.seo.title, description: ind.seo.description, primary: ind.seo.primary, secondary: ind.seo.secondary },
        sortOrder: meta.order,
        status: "published",
      })
      .returning({ id: t.industries.id });
    indIds[ind.id] = row.id;
  }

  /* Product ↔ industry mapping: featured order first, then tagged products */
  const links = new Map<string, { productId: number; industryId: number; relevance: string; sortOrder: number }>();
  for (const ind of allIndustries) {
    let order = 0;
    for (const slug of ind.featured) {
      if (!prodIds[slug]) continue;
      links.set(`${slug}:${ind.id}`, { productId: prodIds[slug], industryId: indIds[ind.id], relevance: "primary", sortOrder: order++ });
    }
    for (const p of allProducts) {
      if (!p.industries.includes(ind.id as never) || links.has(`${p.slug}:${ind.id}`)) continue;
      links.set(`${p.slug}:${ind.id}`, { productId: prodIds[p.slug], industryId: indIds[ind.id], relevance: "secondary", sortOrder: order++ });
    }
  }
  const linkRows = [...links.values()];
  for (let i = 0; i < linkRows.length; i += 200) await db.insert(t.productIndustries).values(linkRows.slice(i, i + 200));

  /* Knowledge centre */
  const catIds: Record<string, number> = {};
  for (const [i, [id, c]] of Object.entries(CATEGORIES).entries()) {
    const [row] = await db.insert(t.postCategories).values({ slug: c.slug, name: c.name, description: c.description, sortOrder: i }).returning({ id: t.postCategories.id });
    catIds[id] = row.id;
  }
  for (const [i, a] of articles.entries()) {
    await db.insert(t.posts).values({
      slug: a.slug,
      title: a.title,
      excerpt: a.description,
      intro: a.intro,
      categoryId: catIds[a.category],
      tags: [a.keyword],
      cover: { url: a.image, alt: a.title, kind: "render" },
      body: a.sections as PostBlockSection[],
      recommendations: a.recommendations,
      faqs: a.faqs,
      relatedProducts: a.relatedProducts,
      reviewStatus: a.review.status,
      reviewer: a.review.reviewer ?? null,
      seo: { title: `${a.title} | Merova Printpack`, description: a.description, primary: a.keyword },
      status: "published",
      publishedAt: new Date(now.getTime() - i * 86400000 * 4),
    });
  }

  /* Pages */
  for (const [i, p] of SEED_PAGES.entries()) {
    await db.insert(t.pages).values({ slug: p.slug, title: p.title, navLabel: p.navLabel ?? null, template: p.template ?? "standard", sections: p.sections, seo: p.seo, status: "published", publishedAt: now, sortOrder: i, system: Boolean(p.system), updatedBy: "seed" });
  }

  /* Resources */
  const RES = [
    { slug: "product-catalogue", title: "Merova Product Catalogue", kind: "catalogue", description: "The complete portfolio across all five segments, with formats, materials and specification guidance.", fileUrl: "/assets/downloads/merova-product-catalogue.pdf" },
    { slug: "company-profile", title: "Company Profile", kind: "profile", description: "Positioning, process, quality approach and portfolio overview.", fileUrl: "/assets/downloads/merova-company-profile.pdf" },
    { slug: "manufacturing-capabilities", title: "Manufacturing Capabilities", kind: "brochure", description: "Processes, capabilities by segment and the quality stages behind every order.", fileUrl: "/assets/downloads/merova-manufacturing-capabilities.pdf" },
    { slug: "sustainability-approach", title: "Sustainability Approach", kind: "technical", description: "Material optimisation, recyclability and how environmental claims are defined.", fileUrl: "/assets/downloads/merova-sustainability-approach.pdf" },
  ];
  for (const [i, r] of RES.entries()) await db.insert(t.resources).values({ ...r, sortOrder: i, status: "published" });

  /* Media library: register bundled static assets */
  const seen = new Map<string, { url: string; alt: string; kind?: string; credit?: string; folder: string }>();
  const add = (r: ImageRef | null | undefined, folder: string) => {
    if (r?.url && !seen.has(r.url)) seen.set(r.url, { url: r.url, alt: r.alt, kind: r.kind, credit: r.credit, folder });
  };
  for (const p of allProducts) add(img(p.image), "products");
  for (const v of verticals) add(img(v.image), "segments");
  for (const k of Object.keys(STOCK)) add(stockRef(k), "stock");
  for (const pg of SEED_PAGES) for (const sec of pg.sections) add(sec.data.image as ImageRef | undefined, "pages");
  for (const b of ["merova-logo-primary.svg", "merova-logo-reverse.svg", "merova-mark-red.svg", "merova-mark-cream.png", "merova-favicon.svg"]) add({ url: `/assets/brand/${b}`, alt: `Merova ${b.replace(/merova-|\.\w+$/g, "").replace(/-/g, " ")}`, kind: "original" }, "brand");
  for (const m of seen.values()) {
    const stock = Object.values(STOCK).find((s) => m.url.endsWith(s.file));
    await db.insert(t.media).values({
      filename: m.url.split("/").pop()!,
      mime: m.url.endsWith(".svg") ? "image/svg+xml" : m.url.endsWith(".png") ? "image/png" : "image/webp",
      path: m.url,
      folder: m.folder,
      title: m.alt,
      alt: m.alt,
      credit: m.credit ?? (m.kind === "render" ? "Merova studio visualisation" : null),
      sourceUrl: stock ? `https://unsplash.com/photos/${stock.id}` : null,
      license: stock ? "Unsplash License" : m.kind === "render" ? "Owned by Merova" : null,
      isStock: Boolean(stock) || m.kind === "representative",
    });
  }

  /* Settings */
  const settingsRows = [
    { key: "site", value: DEFAULT_SITE() },
    { key: "theme", value: DEFAULT_THEME },
    { key: "navigation", value: DEFAULT_NAV },
    { key: "footer", value: DEFAULT_FOOTER },
    { key: "seo", value: DEFAULT_SEO },
  ];
  for (const r of settingsRows) await db.insert(t.settings).values({ ...r, updatedBy: "seed" });

  /* Redirects from earlier site generations (exact paths; segment-level patterns live in next.config.ts) */
  const legacy: [string, string][] = [
    ["/company", "/about"],
    ["/company/leadership", "/about/leadership"],
    ["/company/clients", "/about/clients"],
    ["/company/careers", "/about/careers"],
    ["/company/partnerships", "/about/business-enquiries"],
    ["/company/suppliers", "/about/business-enquiries"],
    ["/company/client-service", "/about/process"],
    ["/company/case-studies", "/about/clients"],
    ["/manufacturing", "/about/manufacturing"],
    ["/manufacturing/capabilities", "/about/capabilities"],
    ["/quality", "/about/quality"],
    ["/process", "/about/process"],
    ["/sustainability", "/about/sustainability"],
    ["/blog", "/knowledge"],
    ["/resources/downloads", "/resources"],
  ];
  await db.insert(t.redirects).values(legacy.map(([fromPath, toPath]) => ({ fromPath, toPath, note: "Previous site structure" })));
}
