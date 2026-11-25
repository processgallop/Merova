import type { MetadataRoute } from "next";
import { getCatalog, getPostCategories, getPosts, getPublishedPages, industryUrl, postUrl, segmentUrl } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

/** Generated from published records only — drafts, archived items and noindex pages are excluded. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ segments, cards, industries, products }, posts, pages, cats] = await Promise.all([getCatalog(), getPosts(), getPublishedPages(), getPostCategories()]);
  const now = new Date();
  const entry = (path: string, lastModified: Date = now, priority = 0.6): MetadataRoute.Sitemap[number] => ({ url: absoluteUrl(path), lastModified, priority });
  return [
    entry("/", now, 1),
    entry("/products", now, 0.9),
    entry("/industries", now, 0.9),
    entry("/request-a-quote", now, 0.8),
    entry("/custom-requirement", now, 0.7),
    entry("/contact", now, 0.7),
    entry("/resources", now, 0.6),
    entry("/resources/faqs", now, 0.5),
    entry("/knowledge", now, 0.6),
    ...segments.filter((s) => !s.seo.noindex).map((s) => entry(segmentUrl(s), s.updatedAt, 0.8)),
    ...cards.filter((c) => !products.find((p) => p.id === c.id)?.seo.noindex).map((c) => entry(c.url, products.find((p) => p.id === c.id)?.updatedAt, 0.7)),
    ...industries.filter((i) => !i.seo.noindex).map((i) => entry(industryUrl(i), i.updatedAt, 0.8)),
    ...pages.filter((p) => p.slug !== "home" && !p.seo.noindex).map((p) => entry(`/${p.slug}`, p.updatedAt, 0.5)),
    ...posts.filter((p) => p.reviewStatus === "reviewed" && !p.seo.noindex).map((p) => entry(postUrl(p), p.updatedAt, 0.5)),
    ...cats.filter((c) => posts.some((p) => p.categoryId === c.id && p.reviewStatus === "reviewed")).map((c) => entry(`/knowledge/category/${c.slug}`, now, 0.4)),
  ];
}
