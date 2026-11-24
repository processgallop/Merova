import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingDock } from "./FloatingDock";
import { buildMenus } from "@/data/menus";
import { industries, products, productUrl } from "@/data/catalog";
import { DEFAULT_WA_MESSAGE, site } from "@/lib/site";

/** Route → contextual WhatsApp opening message. */
function whatsappContext(): Record<string, string> {
  const map: Record<string, string> = { "/": DEFAULT_WA_MESSAGE };
  for (const p of products) map[productUrl(p)] = `Hello Merova Team, I am interested in ${p.name}. I would like to discuss my requirements.`;
  for (const i of industries) map[`/industries/${i.slug}`] = `Hello Merova Team, I am looking for packaging for the ${i.name} industry. I would like to discuss my requirements.`;
  map["/custom-requirement"] = "Hello Merova Team, I have a custom packaging requirement I would like to discuss.";
  return map;
}

/** Header, footer and the floating WhatsApp/Mira dock shared by every public page. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <Header menus={buildMenus()} />
      <main id="main">{children}</main>
      <Footer />
      <FloatingDock whatsapp={site.contact.whatsapp} contextMap={whatsappContext()} phone={site.contact.phone} email={site.contact.email} />
    </>
  );
}
