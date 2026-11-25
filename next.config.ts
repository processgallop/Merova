import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  cacheComponents: false,
  poweredByHeader: false,
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  serverExternalPackages: ["@electric-sql/pglite", "postgres", "sharp"],
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
  experimental: {
    serverActions: { bodySizeLimit: "4.5mb" },
    authInterrupts: true,
  },
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }, { key: "Cache-Control", value: "no-store" }] },
      { source: "/assets/downloads/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=3600, must-revalidate" }] },
    ];
  },
  async redirects() {
    // Pattern redirects from earlier site generations. Exact-path redirects are managed in /admin/seo.
    const segs = ["corrugated-packaging", "paper-packaging", "foodservice-packaging", "plastic-packaging", "custom-packaging"];
    return [
      ...segs.map((s) => ({ source: `/${s}`, destination: `/products/${s}`, permanent: true })),
      ...segs.map((s) => ({ source: `/${s}/:product`, destination: `/products/${s}/:product`, permanent: true })),
      { source: "/blog/category/:slug", destination: "/knowledge/category/:slug", permanent: true },
      { source: "/blog/:slug", destination: "/knowledge/:slug", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/capabilities", destination: "/about/capabilities", permanent: true },
      { source: "/insights", destination: "/knowledge", permanent: true },
      { source: "/request-quote", destination: "/request-a-quote", permanent: true },
      { source: "/downloads", destination: "/resources", permanent: true },
      { source: "/faqs", destination: "/resources/faqs", permanent: true },
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/terms-and-conditions", destination: "/terms", permanent: true },
    ];
  },
};

export default nextConfig;
