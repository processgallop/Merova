import type { Metadata } from "next";
import type { SeoMeta } from "@/db/types";
import { absoluteUrl } from "./site";

/** Builds page metadata with canonical URL and Open Graph from CMS SEO fields. */
export function meta(opts: { title: string; description?: string; path: string; seo?: SeoMeta; image?: string; noindex?: boolean; absoluteTitle?: boolean }): Metadata {
  const seo = opts.seo ?? {};
  const title = seo.title || opts.title;
  const description = seo.description || opts.description;
  const image = seo.ogImage || opts.image;
  return {
    title: seo.title || opts.absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: seo.canonical || absoluteUrl(opts.path) },
    openGraph: {
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
      url: absoluteUrl(opts.path),
      ...(image ? { images: [{ url: absoluteUrl(image) }] } : {}),
    },
    robots: seo.noindex || opts.noindex ? { index: false, follow: true } : undefined,
  };
}
