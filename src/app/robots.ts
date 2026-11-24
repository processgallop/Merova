import type { MetadataRoute } from "next";
import { absoluteUrl, site } from "@/lib/site";

/** Indexing is off unless this is the production deployment AND NEXT_PUBLIC_INDEXABLE=true (sample content must not be indexed). */
export default function robots(): MetadataRoute.Robots {
  const open = process.env.VERCEL_ENV === "production" && site.indexable;
  return {
    rules: open ? [{ userAgent: "*", allow: "/", disallow: ["/api/", "/print/", "/enquiry-received/", "/request-a-quote/basket/"] }] : [{ userAgent: "*", disallow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
