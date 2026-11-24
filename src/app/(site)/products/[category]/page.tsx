import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowRight, Download } from "lucide-react";
import { bentoSizes, CtaBand, FaqList, PageHero, ProductTile, SectionHead } from "@/components/ui/blocks";
import { JsonLd } from "@/components/seo/JsonLd";
import { categories, categoryBySlug, heldProducts, industries, subcategoriesOf, type CategoryId } from "@/data/catalog";
import { CLAIM_DEFINITIONS } from "@/data/company";
import { SUB_CONTENT } from "@/data/product-content";
import { absoluteUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => categories.map((c) => ({ category: c.slug }));
type Props = { params: Promise<{ category: string }> };

const SEO: Record<CategoryId, { title: string; description: string }> = {
  paper: { title: "Paper Packaging | Cartons, Rigid Boxes, Paper Cups, Bags & Labels | Merova", description: "Printed folding and mono cartons, sweet and cake boxes, rigid boxes, paper cups, popcorn tubs, foodservice packaging, carry bags, labels and commercial print." },
  plastic: { title: "Plastic Packaging & Films | BOPP, Shrink, Cling, Pouches | Merova", description: "BOPP HST rolls, POF and PE shrink film, stretch film, cling film, LDPE pouches, courier bags, laminated pouches and plastic food containers." },
  compostable: { title: "Compostable Packaging | Bags, Films, Containers, Cutlery | Merova", description: "Certified compostable carry bags, garbage bags, courier bags, pouches, films, food containers, trays, cups and cutlery, each with its certification stated." },
  corrugated: { title: "Corrugated Boxes | 3, 5 & 7-Ply, Die-Cut, E-commerce, Export | Merova", description: "3-ply, 5-ply and 7-ply corrugated boxes, die-cut and e-commerce boxes, export cartons, sheets, partitions, inserts, trays and retail-ready packaging." },
};

export async function generateMetadata({ params }: Props) {
  const c = categoryBySlug((await params).category);
  return c ? pageMetadata({ ...SEO[c.id], path: `/products/${c.slug}/`, image: c.image }) : {};
}

export default async function CategoryPage({ params }: Props) {
  const c = categoryBySlug((await params).category);
  if (!c) notFound();
  const subs = subcategoriesOf(c.id);
  const all = subs.flatMap((s) => s.products);
  const faqs = subs.flatMap((s) => SUB_CONTENT[s.id]?.faqs ?? []).slice(0, 6);
  const inds = industries.filter((i) => i.operators.some((o) => o.primary.some((id) => all.some((p) => p.id === id))));
  const tone = c.id === "paper" ? "red" : c.id === "compostable" ? "dark" : "cloud";
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: c.name, url: absoluteUrl(`/products/${c.slug}/`), mainEntity: { "@type": "ItemList", itemListElement: all.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(p.url), name: p.name })) } }} />
      <PageHero tone={tone} crumbs={[{ name: "Products", href: "/products/" }, { name: c.name, href: `/products/${c.slug}/` }]} eyebrow={`${all.length} products · ${subs.length} families`} title={c.promise} intro={`${c.name}. ${c.intro}`} image={c.image} imageAlt={`${c.name} by Merova`}>
        <a href={`/assets/downloads/merova-${c.slug}-brochure.pdf`} download className={tone === "cloud" ? "btn btn-dark" : "btn btn-cloud"}><Download className="h-4 w-4" /> Download brochure</a>
        <Link href="/request-a-quote/" className={tone === "cloud" ? "btn btn-outline" : "btn btn-ghost-light"}>Request a Quote</Link>
      </PageHero>

      <nav aria-label={`${c.name} families`} className="sticky top-[76px] z-30 border-y border-line bg-cloud/95 backdrop-blur">
        <div className="wrap wrap-wide no-scrollbar flex gap-2 overflow-x-auto py-3">
          {subs.map((s) => <a key={s.id} href={`#${s.slug}`} className="chip flex-none">{s.name} <span className="text-stone tnum">{s.products.length}</span></a>)}
        </div>
      </nav>

      {subs.map((s, si) => (
        <section key={s.id} id={s.slug} className={`scroll-mt-40 ${si % 2 ? "bg-sand" : ""} section-tight`}>
          <div className="wrap wrap-wide">
            <SectionHead eyebrow={c.short} title={s.name} intro={SUB_CONTENT[s.id]?.overview} />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(() => { const sz = bentoSizes(s.products.length); return s.products.map((p, i) => <ProductTile key={p.id} p={p} size={sz[i]} tone={i === 0 && si === 0 && c.id === "paper" ? "red" : "white"} />); })()}
            </div>
          </div>
        </section>
      ))}

      {(c.id === "compostable" || c.id === "plastic") && (
        <section className="section-tight">
          <div className="wrap wrap-wide grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            <div className="reveal">
              <p className="eyebrow">{c.id === "compostable" ? "Material claims" : "Regulation"}</p>
              <h2 className="h2 mt-4">{c.id === "compostable" ? "What compostable means, precisely." : "Single-use plastic rules in India."}</h2>
              <p className="lede mt-5">{c.id === "compostable" ? "Each compostable product is published with its certification (industrial or home compostable) and, for India, its CPCB certificate number." : "Plastic cups, glasses, plates, cutlery, trays and wrapping films around sweet boxes have been prohibited in India since 1 July 2022, and plastic carry bags must be at least 120 µm. Merova does not offer prohibited items; paper and compostable alternatives are listed instead."}</p>
            </div>
            {c.id === "compostable" ? (
              <dl className="reveal grid gap-px overflow-hidden rounded-[24px] border border-line bg-line">{CLAIM_DEFINITIONS.map((d) => <div key={d.term} className="bg-white p-5"><dt className="h4">{d.term}</dt><dd className="mt-1 text-[15px] text-stone">{d.text}</dd></div>)}</dl>
            ) : (
              <div className="reveal rounded-[24px] bg-warn-bg p-6 text-warn">
                <p className="flex items-center gap-2 font-semibold"><AlertTriangle className="h-5 w-5" /> Not offered (held for compliance review)</p>
                <ul className="mt-3 list-disc pl-5 text-[15px]">{heldProducts.map((h) => <li key={h.id}>{h.name}</li>)}</ul>
                <p className="mt-4 text-[15px]">Alternatives: <Link href="/products/paper-products/paper-cups/" className="font-semibold underline">Paper cups</Link>, <Link href="/products/compostable-products/compostable-cups/" className="font-semibold underline">compostable cups</Link>, <Link href="/products/compostable-products/compostable-trays-plates/" className="font-semibold underline">compostable trays</Link>.</p>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="section-tight bg-graphite text-white">
        <div className="wrap wrap-wide">
          <SectionHead tone="dark" eyebrow="By application" title={`Who uses ${c.short.toLowerCase()} packaging.`} />
          <div className="mt-8 flex flex-wrap gap-2">{inds.map((i) => <Link key={i.id} href={i.url} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm hover:border-white hover:bg-white/5">{i.name} <ArrowRight className="h-3.5 w-3.5" /></Link>)}</div>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="section-tight">
          <div className="wrap wrap-wide grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHead eyebrow="FAQs" title={`${c.short}: common questions.`} />
            <FaqList faqs={faqs} />
          </div>
        </section>
      )}
      <CtaBand title={`Specify your ${c.short.toLowerCase()} packaging.`} />
    </>
  );
}
