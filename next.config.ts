import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Cache Components is deliberately off: every page is statically generated
  // from the central data in src/data, so streaming/PPR adds no value here.
  cacheComponents: false,
  poweredByHeader: false,
  // Allows isolated QA builds (e.g. NEXT_DIST_DIR=.next-qa) without touching the main build.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/assets/downloads/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, must-revalidate" }],
      },
    ];
  },
  async redirects() {
    // Routes from the previous merova.vercel.app build, kept so old links resolve.
    return [
      { source: "/about", destination: "/company", permanent: true },
      { source: "/capabilities", destination: "/manufacturing/capabilities", permanent: true },
      { source: "/insights", destination: "/blog", permanent: true },
      { source: "/request-quote", destination: "/request-a-quote", permanent: true },
      { source: "/downloads", destination: "/resources/downloads", permanent: true },
      { source: "/faqs", destination: "/resources/faqs", permanent: true },
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/terms-and-conditions", destination: "/terms", permanent: true },
    ];
  },
};

export default nextConfig;
