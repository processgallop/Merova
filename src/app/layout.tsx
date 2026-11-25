import type { Metadata, Viewport } from "next";
import { DM_Sans, Inter, Manrope, Plus_Jakarta_Sans, Sora } from "next/font/google";
import { getSeoSettings, getSiteSettings, getTheme } from "@/lib/content";
import { themeToCss } from "@/lib/theme";
import { absoluteUrl, siteUrl } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap", preload: false });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap", preload: false });
const dmsans = DM_Sans({ subsets: ["latin"], variable: "--font-dmsans", display: "swap", preload: false });

export async function generateMetadata(): Promise<Metadata> {
  const [seo, site, theme] = await Promise.all([getSeoSettings(), getSiteSettings(), getTheme()]);
  const indexable = seo.allowIndexing && process.env.VERCEL_ENV !== "preview";
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: seo.defaultTitle, template: seo.titleTemplate },
    description: seo.defaultDescription,
    applicationName: site.companyName,
    icons: { icon: theme.faviconUrl || "/icon.svg", apple: "/apple-icon.png" },
    openGraph: { type: "website", siteName: site.companyName, locale: "en_IN", images: [{ url: absoluteUrl(seo.ogImage || "/og.png"), width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image" },
    robots: indexable ? undefined : { index: false, follow: false },
    verification: site.analytics.gscVerification ? { google: site.analytics.gscVerification } : undefined,
  };
}

export const viewport: Viewport = { themeColor: "#d52b1e", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await getTheme();
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${sora.variable} ${jakarta.variable} ${dmsans.variable}`} suppressHydrationWarning>
      <head>
        <style id="merova-theme" dangerouslySetInnerHTML={{ __html: themeToCss(theme) }} />
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
