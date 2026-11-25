import type { MetadataRoute } from "next";
import { getSeoSettings } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getSeoSettings();
  const allow = seo.allowIndexing && process.env.VERCEL_ENV !== "preview";
  return {
    rules: allow ? [{ userAgent: "*", allow: "/", disallow: [...new Set(["/admin", "/api", "/print", ...seo.robotsDisallow])] }] : [{ userAgent: "*", disallow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
