import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Manrope, Sora } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/analytics/ConsentBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/site";
import { DEFAULT_OG, organizationJsonLd } from "@/lib/seo";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap", weight: ["400", "500", "600", "700"] });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-plex-mono", display: "swap", weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Merova Printpack — Packaging, Perfected. | Corrugated, Paper, Foodservice & Flexible Packaging",
    template: "%s | Merova Printpack",
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: site.url },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: site.url,
    images: [{ url: DEFAULT_OG, width: 1200, height: 630, alt: "Merova Printpack — Packaging, Perfected." }],
  },
  twitter: { card: "summary_large_image" },
  verification: site.analytics.gscVerification ? { google: site.analytics.gscVerification } : undefined,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0d1f38",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${sora.variable} ${manrope.variable} ${plexMono.variable}`}>
      <body className="min-h-dvh antialiased">
        {children}
        <Analytics gaId={site.analytics.gaId} gtmId={site.analytics.gtmId} />
        <JsonLd data={organizationJsonLd()} />
      </body>
    </html>
  );
}
