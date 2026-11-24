/**
 * Product and industry catalogue. Single source: docs/stage-1/source/register.py → src/data/generated/register.json.
 * Products flagged "SUP" (India single-use plastic prohibition) are held: they are not generated, listed or mapped.
 */
import reg from "./generated/register.json";
import { PRODUCT_CONTENT, SUB_CONTENT } from "./product-content";
import { INDUSTRY_CONTENT, OPERATOR_CONTENT } from "./industry-content";

export type CategoryId = "paper" | "plastic" | "compostable" | "corrugated";

export interface Category {
  id: CategoryId;
  name: string;
  short: string;
  slug: string;
  promise: string;
  intro: string;
  accent: string;
  image: string;
}

export interface SpecRow { label: string; value: string; kind: "indicative" | "option" }
export interface Faq { q: string; a: string }

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  subId: string;
  subcategory: string;
  status: 1 | 2 | 3;
  description: string;
  headline: string;
  overview: string[];
  variants: string[];
  applications: string;
  parameters: string[];
  customisation: string[];
  materials: string[];
  specs: SpecRow[];
  quality: string[];
  faqs: Faq[];
  related: string[];
  rfqProfile: string;
  rfqFields: string[];
  flags: string;
  note: string;
  merged: string;
  url: string;
  image: string;
  imageAlt: string;
  flyer: string;
  keywords: string[];
}

export interface Operator {
  id: string;
  slug: string;
  name: string;
  page: boolean;
  industry: string;
  primary: string[];
  secondary: string[];
  url: string;
  headline: string;
  intro: string;
  points: { title: string; text: string }[];
  faqs: Faq[];
  image: string;
  note: string;
}

export interface Industry {
  id: string;
  slug: string;
  name: string;
  headline: string;
  intro: string;
  needs: { title: string; text: string }[];
  faqs: Faq[];
  operators: Operator[];
  url: string;
  image: string;
}

const ACCENT: Record<CategoryId, string> = { paper: "var(--color-kraft)", plastic: "var(--color-film)", compostable: "var(--color-fibre)", corrugated: "var(--color-liner)" };
const SHORT: Record<CategoryId, string> = { paper: "Paper", plastic: "Plastic & Films", compostable: "Compostable", corrugated: "Corrugated" };

export const categories: Category[] = (Object.entries(reg.categories) as [CategoryId, { name: string; slug: string; promise: string; intro: string }][]).map(([id, c]) => ({
  id, name: c.name, short: SHORT[id], slug: c.slug, promise: c.promise, intro: c.intro, accent: ACCENT[id], image: `/assets/renders/scenes/cat-${id}.webp`,
}));
export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c])) as Record<CategoryId, Category>;
export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);

type RawProduct = (typeof reg.products)[number];
const held = new Set(reg.products.filter((p) => p.flags === "SUP").map((p) => p.id));

function build(p: RawProduct): Product {
  const c = PRODUCT_CONTENT[p.id] ?? {};
  const sc = SUB_CONTENT[p.sub] ?? { overview: "", quality: [], materials: [] };
  const category = p.category as CategoryId;
  return {
    id: p.id, slug: p.slug, name: p.name, category, subId: p.sub, subcategory: p.subcategory, status: p.status as 1 | 2 | 3,
    description: p.desc,
    headline: c.headline ?? p.desc,
    overview: [p.desc, c.overview ?? sc.overview].filter(Boolean),
    variants: p.variants,
    applications: p.apps,
    parameters: p.params,
    customisation: p.custom.length ? p.custom : ["Custom sizes within tooling", "Brand print on request"],
    materials: c.materials ?? sc.materials,
    specs: c.specs ?? [],
    quality: c.quality ?? sc.quality,
    faqs: [...(c.faqs ?? []), ...(sc.faqs ?? [])].slice(0, 5),
    related: p.related.filter((r) => !held.has(r)),
    rfqProfile: p.rfq, rfqFields: p.rfq_fields,
    flags: p.flags, note: p.note, merged: p.merged,
    url: p.url,
    image: `/assets/renders/products/${p.slug}.webp`,
    imageAlt: `${p.name}: ${p.shot.split(";")[0].replace(/\.$/, "")}`,
    flyer: `/assets/downloads/flyers/merova-${p.slug}.pdf`,
    keywords: [p.name, p.subcategory, ...p.variants, ...(p.merged ? p.merged.split(/;\s*/) : []), ...(c.keywords ?? [])].map((s) => s.toLowerCase()),
  };
}

export const products: Product[] = reg.products.filter((p) => !held.has(p.id)).map(build);
export const heldProducts = reg.products.filter((p) => held.has(p.id)).map((p) => ({ id: p.id, name: p.name, note: p.note }));
export const productById = Object.fromEntries(products.map((p) => [p.id, p])) as Record<string, Product>;
export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const productsIn = (cat: CategoryId) => products.filter((p) => p.category === cat);
export const subcategoriesOf = (cat: CategoryId) =>
  Object.entries(reg.subcategories)
    .filter(([, s]) => s.category === cat)
    .map(([id, s]) => ({ id, name: s.name, slug: s.name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), products: products.filter((p) => p.subId === id) }))
    .filter((s) => s.products.length);

export const industries: Industry[] = reg.industries.map((i) => {
  const ic = INDUSTRY_CONTENT[i.id];
  return {
    id: i.id, slug: i.slug, name: i.name, url: `/industries/${i.slug}/`,
    headline: ic?.headline ?? i.name, intro: ic?.intro ?? "", needs: ic?.needs ?? [], faqs: ic?.faqs ?? [],
    image: `/assets/renders/scenes/ind-${i.slug}.webp`,
    operators: i.ops.map((o) => {
      const oc = OPERATOR_CONTENT[o.id];
      return {
        id: o.id, slug: o.slug, name: o.name, page: o.page, industry: i.id,
        primary: o.primary.filter((x) => !held.has(x)), secondary: o.secondary.filter((x) => !held.has(x)),
        url: o.page ? `/industries/${i.slug}/${o.slug}/` : `/industries/${i.slug}/#${o.slug}`,
        headline: oc?.headline ?? `Packaging for ${o.name.toLowerCase()}`, intro: oc?.intro ?? "", points: oc?.points ?? [], faqs: oc?.faqs ?? [],
        image: o.page ? `/assets/renders/scenes/op-${o.slug}.webp` : `/assets/renders/scenes/ind-${i.slug}.webp`, note: o.note,
      };
    }),
  };
});
export const industryBySlug = (slug: string) => industries.find((i) => i.slug === slug);
export const allOperators = industries.flatMap((i) => i.operators);
export const operatorById = Object.fromEntries(allOperators.map((o) => [o.id, o])) as Record<string, Operator>;

/** Operators that use a product, split primary/secondary. */
export function operatorsFor(productId: string) {
  const primary: Operator[] = [], secondary: Operator[] = [];
  for (const o of allOperators) { if (o.primary.includes(productId)) primary.push(o); else if (o.secondary.includes(productId)) secondary.push(o); }
  return { primary, secondary };
}
export const relatedProducts = (p: Product) => p.related.map((id) => productById[id]).filter(Boolean);
export const groupByCategory = (ids: string[]) =>
  categories.map((c) => ({ category: c, products: ids.map((id) => productById[id]).filter((p) => p && p.category === c.id) }));

export const quoteHref = (p?: Product) => (p ? `/request-a-quote/?add=${p.id}` : "/request-a-quote/");

/** Lightweight index shipped to the browser for search, basket and Mira (guided mode). */
export const clientIndex = {
  products: products.map((p) => ({ id: p.id, n: p.name, c: p.category, s: p.subcategory, u: p.url, i: p.image, d: p.description, k: p.keywords.join(" "), v: p.variants, f: p.rfqProfile })),
  operators: allOperators.map((o) => ({ id: o.id, n: o.name, u: o.url, ind: industries.find((i) => i.id === o.industry)!.name, p: o.primary, x: o.secondary })),
  categories: categories.map((c) => ({ id: c.id, n: c.name, u: `/products/${c.slug}/` })),
};
export type ClientIndex = typeof clientIndex;
export type ClientProduct = ClientIndex["products"][number];

export const counts = { products: products.length, categories: categories.length, industries: industries.length, operators: allOperators.length };
