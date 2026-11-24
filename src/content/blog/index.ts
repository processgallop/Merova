import { articles1 } from "./articles-1";
import { articles2 } from "./articles-2";
import { articles3 } from "./articles-3";
import type { Article as RawArticle, Block, CategoryId } from "./types";
import { productById } from "@/data/catalog";

export type { Block, CategoryId };

export const CATEGORIES: Record<CategoryId, { name: string; slug: string }> = {
  corrugated: { name: "Corrugated", slug: "corrugated" },
  paper: { name: "Paper & cartons", slug: "paper" },
  foodservice: { name: "Foodservice", slug: "foodservice" },
  flexible: { name: "Plastic & films", slug: "plastic-films" },
  pharmaceutical: { name: "Pharmaceutical", slug: "pharmaceutical" },
  automotive: { name: "Automotive & industrial", slug: "industrial" },
  sustainable: { name: "Sustainability", slug: "sustainability" },
  engineering: { name: "Packaging engineering", slug: "engineering" },
  procurement: { name: "Buying guides", slug: "buying-guides" },
  innovation: { name: "Innovation", slug: "innovation" },
};

/** Products in the earlier build → register IDs (product pages were consolidated in Stage 1). */
const OLD: Record<string, string> = {
  "3-ply-boxes": "CR-01", "5-ply-boxes": "CR-02", "7-ply-boxes": "CR-03", "rsc-boxes": "CR-01", "beverage-cups": "PA-07", "bopp-rolls": "PL-01", "compostable-bags": "CO-01",
  "compostable-cling-film": "CO-09", "compostable-shrink-film": "CO-08", "corrugated-trays": "CR-10", "cup-sleeves": "PA-18", "custom-pouches": "PL-11", "custom-qsr-packaging": "PA-13",
  "die-cut-boxes": "CR-04", "display-packaging": "CR-11", "e-commerce-boxes": "CR-06", "export-cartons": "CR-05", "folding-cartons": "PA-01", "food-cartons": "PA-01", "food-trays": "PA-15",
  "french-fries-trays": "PA-12", "heavy-duty-cartons": "CR-05", "ice-cream-cups": "PA-08", "ldpe-film": "PL-09", "ldpe-pouches": "PL-09", "mono-cartons": "PA-02", "nachos-trays": "PA-11",
  "partitions-inserts": "CR-09", "pharmaceutical-cartons": "PA-02", "pof-shrink-film": "PL-03", "popcorn-cones": "PA-10", "popcorn-tubs": "PA-09", "printed-paper-packaging": "PA-20",
  "protective-packaging": "CR-07", "pvc-cling-film": "PL-07", "retail-ready-packaging": "CR-11", "sustainable-alternatives": "CO-10", "takeaway-boxes": "PA-17", "window-cartons": "PA-01",
};
const IND: Record<string, string> = {
  "automotive-packaging": "automotive-industrial", "cinema-multiplex-packaging": "food-beverage/multiplex-cinema", "ecommerce-packaging": "ecommerce-logistics",
  "food-packaging": "food-beverage", "pharmaceutical-packaging": "pharmaceuticals-healthcare", "retail-packaging": "retail-consumer-goods",
};
const IMG: Record<CategoryId, string> = {
  corrugated: "5-ply-corrugated-boxes", paper: "folding-cartons", foodservice: "popcorn-tubs", flexible: "bopp-hst-rolls", pharmaceutical: "mono-cartons",
  automotive: "heavy-duty-export-cartons", sustainable: "compostable-food-containers", engineering: "corrugated-inserts-pads", procurement: "brochures-catalogues", innovation: "die-cut-corrugated-boxes",
};

function mapHref(href: string) {
  if (href.startsWith("/custom-requirement")) return "/custom-packaging/";
  const q = href.match(/^\/request-a-quote\?product=(.+)$/);
  if (q) return OLD[q[1]] ? `/request-a-quote/?add=${OLD[q[1]]}` : "/request-a-quote/";
  const i = href.match(/^\/industries\/(.+)$/);
  if (i) return `/industries/${IND[i[1]] ?? ""}/`.replace(/\/\/$/, "/");
  return href === "/request-a-quote" ? "/request-a-quote/" : href;
}

export interface Article extends Omit<RawArticle, "relatedProducts"> { relatedProducts: string[]; url: string }

export const articles: Article[] = [...articles1, ...articles2, ...articles3].map((a) => ({
  ...a,
  url: `/insights/${a.slug}/`,
  image: `/assets/renders/products/${IMG[a.category]}.webp`,
  relatedProducts: [...new Set(a.relatedProducts.map((s) => OLD[s]).filter((id) => id && productById[id]))],
  cta: { ...a.cta, href: mapHref(a.cta.href) },
}));

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
export const latestArticles = (n: number) => articles.slice(0, n);

export function readingMinutes(a: Article) {
  const text = [a.intro, ...a.sections.flatMap((s) => s.blocks.map(blockText)), ...a.recommendations, ...a.faqs.flatMap((f) => [f.q, f.a])].join(" ");
  return Math.max(3, Math.round(text.split(/\s+/).length / 200));
}
function blockText(b: Block): string {
  switch (b.type) { case "p": case "h3": case "note": return b.text; case "ul": case "ol": return b.items.join(" "); case "table": return [...b.head, ...b.rows.flat()].join(" "); }
}
export const relatedArticles = (a: Article, n = 3) => [...articles.filter((x) => x.slug !== a.slug && x.category === a.category), ...articles.filter((x) => x.slug !== a.slug && x.category !== a.category)].slice(0, n);
export const articlesForProduct = (id: string, n = 2) => articles.filter((a) => a.relatedProducts.includes(id)).slice(0, n);
