import { corrugatedProducts } from "./products/corrugated";
import { paperProducts } from "./products/paper";
import { foodserviceProducts } from "./products/foodservice";
import { flexibleProducts } from "./products/flexible";
import { customProducts } from "./products/custom";
import { industries, industryById, industryBySlug } from "./industries";
import { verticalById, verticalBySlug, verticals } from "./verticals";
import type { IndustryId, Product, VerticalId } from "./types";

export const products: Product[] = [
  ...corrugatedProducts,
  ...paperProducts,
  ...foodserviceProducts,
  ...flexibleProducts,
  ...customProducts,
];

const bySlug = new Map(products.map((p) => [p.slug, p]));

export const getProduct = (slug: string) => bySlug.get(slug);

export const productsInVertical = (id: VerticalId) => products.filter((p) => p.vertical === id);

export const productUrl = (p: Product) => `/${verticalById[p.vertical].slug}/${p.slug}`;
export const flyerUrl = (p: Product) => `/assets/downloads/flyers/merova-${p.slug}-flyer.pdf`;
export const quoteUrl = (p?: Product, industry?: IndustryId) => {
  const params = new URLSearchParams();
  if (p) params.set("product", p.slug);
  if (industry) params.set("industry", industry);
  const qs = params.toString();
  return `/request-a-quote${qs ? `?${qs}` : ""}`;
};
export const industryUrl = (id: IndustryId) => `/industries/${industryById[id].slug}`;

/** Industry-to-product mapping: featured products first, then any other product tagged with the industry. */
export function productsForIndustry(id: IndustryId): Product[] {
  const ind = industryById[id];
  const featured = ind.featured.map((s) => bySlug.get(s)).filter((p): p is Product => Boolean(p));
  const tagged = products.filter((p) => p.industries.includes(id) && !ind.featured.includes(p.slug));
  return [...featured, ...tagged];
}

export const relatedProducts = (p: Product) =>
  p.related.map((s) => bySlug.get(s)).filter((x): x is Product => Boolean(x));

export const DOWNLOADS = {
  catalogue: "/assets/downloads/merova-product-catalogue.pdf",
  profile: "/assets/downloads/merova-company-profile.pdf",
  capabilities: "/assets/downloads/merova-manufacturing-capabilities.pdf",
  sustainability: "/assets/downloads/merova-sustainability-approach.pdf",
} as const;

/**
 * Integrity check, run in tests and at build time via scripts/validate-data.ts:
 * every cross-reference must resolve so no card or link points nowhere.
 */
export function validateCatalog(): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const p of products) {
    if (seen.has(p.slug)) errors.push(`duplicate product slug ${p.slug}`);
    seen.add(p.slug);
    for (const r of p.related) if (!bySlug.has(r)) errors.push(`${p.slug}: related '${r}' missing`);
    for (const i of p.industries) if (!industryById[i]) errors.push(`${p.slug}: industry '${i}' missing`);
    if (p.faqs.length < 2) errors.push(`${p.slug}: needs at least 2 FAQs`);
    if (p.specs.length < 2) errors.push(`${p.slug}: needs a specification table`);
  }
  for (const ind of industries) {
    for (const s of ind.featured) {
      const p = bySlug.get(s);
      if (!p) errors.push(`industry ${ind.id}: featured '${s}' missing`);
      else if (!p.industries.includes(ind.id)) errors.push(`industry ${ind.id}: featured '${s}' is not tagged with the industry`);
    }
    if (productsForIndustry(ind.id).length < 5) errors.push(`industry ${ind.id}: fewer than 5 products`);
  }
  for (const v of verticals) if (productsInVertical(v.id).length === 0) errors.push(`vertical ${v.id} empty`);
  return errors;
}

export { industries, verticals, industryById, verticalById, industryBySlug, verticalBySlug };
