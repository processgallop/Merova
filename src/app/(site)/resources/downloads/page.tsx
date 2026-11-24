import Image from "next/image";
import { Download, FileText } from "lucide-react";
import { CtaBand, PageHero, SectionHead } from "@/components/ui/blocks";
import { DownloadFilter } from "./Filter";
import { categories, productsIn, products } from "@/data/catalog";
import { pdfSizes } from "@/lib/files";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Download Centre | Catalogue, Brochures & Product Flyers | Merova", description: "Download the Merova master catalogue, category brochures, company profile and one-page flyers for every product. No forms.", path: "/resources/downloads/" });

export default function Page() {
  const sizes = pdfSizes();
  const main = [
    { title: "Master product catalogue", text: `Every product across four materials.`, href: "/assets/downloads/merova-product-catalogue.pdf", red: true },
    { title: "Company profile", text: "Who we are, what we make, how we work.", href: "/assets/downloads/merova-company-profile.pdf" },
  ];
  return (
    <>
      <PageHero crumbs={[{ name: "Resources", href: "/resources/" }, { name: "Download centre", href: "/resources/downloads/" }]} eyebrow="Download centre" title="Specifications you can share." intro="Instant PDF downloads. No forms, no email gate." />
      <section id="catalogue" className="section-tight bg-sand">
        <div className="wrap wrap-wide grid gap-4 md:grid-cols-2">
          {main.map((d) => <a key={d.href} href={d.href} download className={`tile reveal p-8 ${d.red ? "tile-red" : ""}`}><FileText className="h-8 w-8" /><h2 className="mt-10 font-display text-3xl font-semibold">{d.title}</h2><p className={`mt-2 ${d.red ? "text-white/85" : "text-stone"}`}>{d.text} PDF{sizes[d.href] ? ` · ${sizes[d.href]}` : ""}</p><span className="mt-6 inline-flex items-center gap-2 font-semibold"><Download className="h-4 w-4" /> Download</span></a>)}
        </div>
      </section>
      <section id="brochures" className="section-tight">
        <div className="wrap wrap-wide">
          <SectionHead eyebrow="Category brochures" title="One brochure per material." />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => { const href = `/assets/downloads/merova-${c.slug}-brochure.pdf`; return <a key={c.id} href={href} download className="tile reveal group"><div className="p-3 pb-0"><div className="relative aspect-[3/4] overflow-hidden rounded-[20px] bg-red"><Image src={c.image} alt="" fill sizes="25vw" className="tile-img object-cover opacity-90 mix-blend-luminosity" /><span className="absolute inset-x-4 bottom-4 font-display text-xl font-semibold text-white drop-shadow">{c.name}</span></div></div><div className="p-5"><p className="text-sm text-stone">{productsIn(c.id).length} products · PDF{sizes[href] ? ` · ${sizes[href]}` : ""}</p><span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-red"><Download className="h-4 w-4" /> Download</span></div></a>; })}
          </div>
        </div>
      </section>
      <section id="flyers" className="section-tight bg-sand">
        <div className="wrap wrap-wide">
          <SectionHead eyebrow="Product flyers" title={`${products.length} one-page flyers.`} />
          <div className="mt-8"><DownloadFilter items={products.map((p) => ({ id: p.id, n: p.name, c: p.category, href: p.flyer, size: sizes[p.flyer], i: p.image }))} cats={categories.map((c) => ({ id: c.id, n: c.short }))} /></div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
