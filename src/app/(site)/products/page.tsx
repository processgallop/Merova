import Link from "next/link";
import { Download } from "lucide-react";
import { CtaBand, CustomRequirementBand, PageHero, SectionHeading } from "@/components/ui/blocks";
import { ProductGrid } from "@/components/product/ProductCard";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { DOWNLOADS, products, productsInVertical, verticals } from "@/data/catalog";
import { toCard } from "@/data/cards";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Packaging Products | Corrugated, Cartons, Foodservice & Flexible | Merova Printpack",
  description: `Browse ${products.length} packaging formats across corrugated, paperboard, foodservice, plastic and flexible, and custom packaging — each with specifications and a downloadable flyer.`,
  path: "/products",
});

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Packaging products across five material verticals."
        intro={`${products.length} formats, each with its own page, specification table, FAQs and downloadable flyer. Not sure where to start? Find your packaging by industry.`}
        crumbs={[{ name: "Products", href: "/products" }]}
      >
        <Link href="/#find-your-packaging" className="btn btn-navy">Find by industry</Link>
        <Link href="/request-a-quote" className="btn btn-primary">Request a Quote</Link>
        <TrackedLink href={DOWNLOADS.catalogue} download event="catalogue_download" className="btn btn-outline"><Download className="h-4 w-4" aria-hidden /> Product Catalogue (PDF)</TrackedLink>
      </PageHero>

      <nav aria-label="Product verticals" className="sticky top-[4.25rem] z-30 border-b border-line bg-paper/95 backdrop-blur lg:top-[4.75rem]">
        <ul className="container-x flex gap-2 overflow-x-auto py-3">
          {verticals.map((v) => (
            <li key={v.id}><a href={`#${v.slug}`} className="chip whitespace-nowrap !py-1.5 !text-[0.72rem] hover:border-navy-800">{v.navName} · {productsInVertical(v.id).length}</a></li>
          ))}
        </ul>
      </nav>

      {verticals.map((v, i) => (
        <section key={v.id} id={v.slug} className={`scroll-mt-32 py-14 lg:py-20 ${i % 2 ? "border-y border-line bg-white" : ""}`}>
          <div className="container-x">
            <SectionHeading eyebrow={`${productsInVertical(v.id).length} formats`} title={v.name} intro={v.intro} action={<Link href={`/${v.slug}`} className="btn btn-outline">{v.navName} overview</Link>} />
            <div className="mt-10"><ProductGrid cards={productsInVertical(v.id).map(toCard)} /></div>
          </div>
        </section>
      ))}

      <CustomRequirementBand />
      <CtaBand title="Ready to request a quote?" text="Choose a product and the form adapts to it — dimensions, materials, printing and quantities, with optional file uploads." />
    </>
  );
}
