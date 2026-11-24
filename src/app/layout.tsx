import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/analytics/ConsentBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/site";
import { DEFAULT_OG, organizationJsonLd } from "@/lib/seo";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap", weight: ["500", "600", "700"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Merova Printpack | Packaging, Perfected.", template: "%s | Merova Printpack" },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: site.url },
  robots: site.indexable ? undefined : { index: false, follow: true },
  openGraph: { type: "website", siteName: site.name, locale: site.locale, url: site.url, images: [{ url: DEFAULT_OG, width: 1200, height: 630, alt: "Merova Printpack: Packaging, Perfected." }] },
  twitter: { card: "summary_large_image" },
  verification: site.analytics.gscVerification ? { google: site.analytics.gscVerification } : undefined,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#d52b1e", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${sora.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-dvh">
        {children}
        <Analytics gaId={site.analytics.gaId} gtmId={site.analytics.gtmId} />
        <JsonLd data={organizationJsonLd()} />
      </body>
    </html>
  );
}
