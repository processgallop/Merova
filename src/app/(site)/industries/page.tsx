import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand, PageHero, Render, SectionHead } from "@/components/ui/blocks";
import { IndustryFinder, type FinderData } from "@/components/industry/Finder";
import { categories, industries, products } from "@/data/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Packaging by Industry | Food, Pharma, Retail, E-commerce, Industrial | Merova", description: "Find packaging for your business: sweet shops, bakeries, cinemas, restaurants, QSR, cloud kitchens, pharma, retail, e-commerce, automotive and more, by material.", path: "/industries/" });

const finder: FinderData = {
  industries: industries.map((i) => ({ id: i.id, name: i.name, url: i.url, ops: i.operators.map((o) => ({ id: o.id, name: o.name, url: o.url, primary: o.primary, secondary: o.secondary })) })),
  products: Object.fromEntries(products.map((p) => [p.id, { n: p.name, u: p.url, i: p.image, c: p.category }])),
  cats: categories.map((c) => ({ id: c.id, name: c.short, accent: c.accent })),
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero tone="dark" crumbs={[{ name: "Industries", href: "/industries/" }]} eyebrow={`${industries.length} industries · ${industries.reduce((a, i) => a + i.operators.length, 0)} business types`} title="Tell us what you run. We'll show you what you need." intro="Buyers often know their business, not the technical name of the packaging. Start here: every business type maps to the products it uses, by material." />
      <section className="section-tight bg-sand"><div className="wrap wrap-wide"><IndustryFinder data={finder} /></div></section>
      <section className="section">
        <div className="wrap wrap-wide">
          <SectionHead eyebrow="All industries" title="Packaging knowledge, sector by sector." />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {industries.map((i, k) => (
              <Link key={i.id} href={i.url} className={`tile reveal group ${k === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`} style={{ ["--i" as string]: k % 3 }}>
                <div className="p-3 pb-0"><Render src={i.image} alt="" label={false} className="rounded-[20px]" ratio={k === 0 ? "aspect-[16/10]" : "aspect-[16/10]"} sizes="(min-width:1024px) 33vw, 100vw" /></div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className={`font-display font-semibold tracking-tight ${k === 0 ? "text-3xl" : "text-xl"}`}>{i.name}</h2>
                  <p className="mt-2 text-[15px] text-stone">{i.headline}</p>
                  <p className="mt-3 text-sm text-charcoal">{i.operators.map((o) => o.name).join(" · ")}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-red">Explore <ArrowRight className="tile-arrow h-4 w-4" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
