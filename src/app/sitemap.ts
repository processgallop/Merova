import type { MetadataRoute } from "next";
import { industries, productUrl, products, verticals } from "@/data/catalog";
import { articles, CATEGORIES } from "@/data/blog";
import { absoluteUrl } from "@/lib/site";

/** Indexable pages only. Noindex pages (confirmation, unreviewed articles, case studies placeholder) are excluded. */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths: [string, number][] = [
    ["/", 1], ["/products", 0.9], ["/industries", 0.9], ["/request-a-quote", 0.9], ["/custom-requirement", 0.8],
    ["/manufacturing", 0.7], ["/manufacturing/capabilities", 0.6], ["/quality", 0.7], ["/process", 0.6], ["/sustainability", 0.7],
    ["/company", 0.7], ["/company/leadership", 0.4], ["/company/clients", 0.4], ["/company/client-service", 0.5],
    ["/company/careers", 0.5], ["/company/partnerships", 0.4], ["/company/suppliers", 0.4],
    ["/resources", 0.6], ["/resources/downloads", 0.7], ["/resources/faqs", 0.6], ["/blog", 0.7], ["/contact", 0.8],
    ["/privacy-policy", 0.2], ["/terms", 0.2],
  ];
  const usedCats = Object.entries(CATEGORIES).filter(([id]) => articles.some((a) => a.category === id && a.review.status === "reviewed"));
  return [
    ...staticPaths.map(([p, priority]) => ({ url: absoluteUrl(p), priority })),
    ...verticals.map((v) => ({ url: absoluteUrl(`/${v.slug}`), priority: 0.9 })),
    ...products.map((p) => ({ url: absoluteUrl(productUrl(p)), priority: 0.8 })),
    ...industries.map((i) => ({ url: absoluteUrl(`/industries/${i.slug}`), priority: 0.9 })),
    ...articles.filter((a) => a.review.status === "reviewed").map((a) => ({ url: absoluteUrl(`/blog/${a.slug}`), priority: 0.6 })),
    ...usedCats.map(([, c]) => ({ url: absoluteUrl(`/blog/category/${c.slug}`), priority: 0.4 })),
  ];
}
