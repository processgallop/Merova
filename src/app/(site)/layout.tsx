import { BasketProvider } from "@/components/basket/Basket";
import { Dock } from "@/components/layout/Dock";
import { Footer } from "@/components/layout/Footer";
import { Header, type NavData } from "@/components/layout/Header";
import { Motion } from "@/components/layout/Motion";
import { SearchDialog } from "@/components/search/Search";
import { categories, clientIndex, industries, productsIn, products, subcategoriesOf } from "@/data/catalog";
import { site } from "@/lib/site";

const nav: NavData = {
  totalProducts: products.length,
  categories: categories.map((c) => ({ id: c.id, name: c.name, short: c.short, url: `/products/${c.slug}/`, promise: c.promise, image: c.image, accent: c.accent, count: productsIn(c.id).length, subs: subcategoriesOf(c.id).map((s) => ({ name: s.name, url: `/products/${c.slug}/#${s.slug}` })) })),
  industries: industries.map((i) => ({ name: i.name, url: i.url, image: i.image, ops: i.operators.map((o) => ({ name: o.name, url: o.url })) })),
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <BasketProvider>
      <Motion />
      <Header nav={nav} />
      <main id="main" className="pb-20 lg:pb-0">{children}</main>
      <Footer />
      <Dock index={clientIndex} whatsapp={site.contact.whatsapp} />
      <SearchDialog index={clientIndex} />
    </BasketProvider>
  );
}
