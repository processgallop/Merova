import type { MetadataRoute } from "next";
import { categories, industries, products } from "@/data/catalog";
import { articles } from "@/content/blog";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const u = (path: string, priority = 0.6): MetadataRoute.Sitemap[number] => ({ url: absoluteUrl(path), lastModified: now, priority });
  return [
    u("/", 1), u("/products/", 0.9), u("/industries/", 0.9), u("/request-a-quote/", 0.8), u("/custom-packaging/", 0.7), u("/contact/", 0.7),
    ...categories.map((c) => u(`/products/${c.slug}/`, 0.9)),
    ...products.map((p) => u(p.url, 0.8)),
    ...industries.flatMap((i) => [u(i.url, 0.8), ...i.operators.filter((o) => o.page).map((o) => u(o.url, 0.7))]),
    ...["/about/", "/about/manufacturing/", "/about/quality/", "/about/process/", "/about/client-servicing/", "/about/sustainability/", "/about/careers/", "/about/partnerships/"].map((p) => u(p, 0.5)),
    ...["/resources/", "/resources/downloads/", "/resources/technical/", "/resources/faqs/", "/insights/"].map((p) => u(p, 0.5)),
    ...articles.filter((a) => a.review.status === "reviewed").map((a) => u(a.url, 0.5)),
    u("/privacy-policy/", 0.2), u("/terms/", 0.2),
  ];
}
