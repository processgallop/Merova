import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Dock } from "@/components/layout/Dock";
import { Consent } from "@/components/layout/Consent";
import { RevealObserver } from "@/components/client/RevealObserver";
import { JsonLd, organizationLd } from "@/components/seo/JsonLd";
import { getSiteSettings } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const site = await getSiteSettings();
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <Dock whatsapp={site.whatsapp} message={site.whatsappMessage} email={site.email} phone={site.phone} />
      <Consent gaId={site.analytics.gaId} gtmId={site.analytics.gtmId} enabled={site.cookieBanner} />
      <RevealObserver />
      <JsonLd data={organizationLd(site)} />
    </>
  );
}
