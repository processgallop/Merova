import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand, PageHero, ProductTile, SectionHead } from "@/components/ui/blocks";
import { ProductExplorer } from "@/components/product/Explorer";
import { categories, counts, productsIn, subcategoriesOf, clientIndex } from "@/data/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Packaging Products | Paper, Plastic, Compostable & Corrugated | Merova Printpack", description: `Browse ${counts.products} packaging products across paper, plastic and film, compostable and corrugated. Specifications, product flyers and instant enquiry.`, path: "/products/" });

export default function ProductsPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "Products", href: "/products/" }]} eyebrow={`${counts.products} products · 4 materials`} title="Every material has a purpose. Find the right one." intro="Browse by material, filter by what you need, and add products to one enquiry. Every product has a specification page and a one-page flyer." />
      <section className="section-tight bg-sand">
        <div className="wrap wrap-wide grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Link key={c.id} href={`/products/${c.slug}/`} className={`tile reveal p-6 ${i === 0 ? "tile-red" : ""}`} style={{ ["--i" as string]: i }}>
              <span className="mat-dot" style={{ ["--mat" as string]: i === 0 ? "#fff" : c.accent }} />
              <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight">{c.name}</h2>
              <p className={`mt-2 text-[15px] ${i === 0 ? "text-white/85" : "text-stone"}`}>{c.promise}</p>
              <p className={`mt-4 text-sm ${i === 0 ? "text-white/80" : "text-stone"}`}>{subcategoriesOf(c.id).map((s) => s.name).join(" · ")}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold">{productsIn(c.id).length} products <ArrowRight className="tile-arrow h-4 w-4" /></span>
            </Link>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="wrap wrap-wide">
          <SectionHead eyebrow="All products" title="Search and filter the full range." />
          <div className="mt-10"><ProductExplorer index={clientIndex} /></div>
        </div>
      </section>
      {categories.map((c, ci) => (
        <section key={c.id} className={`section-tight ${ci % 2 ? "bg-sand" : ""}`} aria-labelledby={`h-${c.id}`}>
          <div className="wrap wrap-wide">
            <SectionHead eyebrow={c.short} title={<span id={`h-${c.id}`}>{c.promise}</span>} action={<Link href={`/products/${c.slug}/`} className="btn btn-outline">All {c.short} <ArrowRight className="arrow h-4 w-4" /></Link>} />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{productsIn(c.id).slice(0, 4).map((p) => <ProductTile key={p.id} p={p} />)}</div>
          </div>
        </section>
      ))}
      <CtaBand />
    </>
  );
}
