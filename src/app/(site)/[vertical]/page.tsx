import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Download } from "lucide-react";
import { CtaBand, CustomRequirementBand, FaqList, PageHero, SectionHeading } from "@/components/ui/blocks";
import { ProductGrid } from "@/components/product/ProductCard";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { IndustryIcon } from "@/components/ui/Icon";
import { DOWNLOADS, industryById, productsInVertical, verticalBySlug, verticals } from "@/data/catalog";
import { toCard } from "@/data/cards";
import type { IndustryId } from "@/data/types";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => verticals.map((v) => ({ vertical: v.slug }));

type Props = { params: Promise<{ vertical: string }> };

export async function generateMetadata({ params }: Props) {
  const v = verticalBySlug((await params).vertical);
  if (!v) return {};
  return pageMetadata({ title: v.seo.title, description: v.seo.description, path: `/${v.slug}`, image: v.image.src.endsWith(".webp") ? v.image.src : undefined });
}

export default async function VerticalPage({ params }: Props) {
  const v = verticalBySlug((await params).vertical);
  if (!v) notFound();
  const items = productsInVertical(v.id);
  const inds = Array.from(new Set(items.flatMap((p) => p.industries))) as IndustryId[];
  const isCustom = v.id === "custom";

  return (
    <>
      <PageHero eyebrow={v.name} title={v.headline} intro={v.intro} crumbs={[{ name: "Products", href: "/products" }, { name: v.name, href: `/${v.slug}` }]} image={v.image}>
        {isCustom ? (
          <Link href="/custom-requirement" className="btn btn-primary">Discuss Your Custom Requirement <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        ) : (
          <Link href="#products" className="btn btn-navy">View {items.length} products</Link>
        )}
        <Link href={isCustom ? "/request-a-quote?product=bespoke-packaging" : "/request-a-quote"} className={isCustom ? "btn btn-outline" : "btn btn-primary"}>Request a Quote</Link>
        <TrackedLink href={DOWNLOADS.catalogue} download event="catalogue_download" className="btn btn-outline"><Download className="h-4 w-4" aria-hidden /> Catalogue (PDF)</TrackedLink>
      </PageHero>

      <section className="border-b border-line bg-white py-14 lg:py-16">
        <div className="container-x">
          <h2 className="t-3">{isCustom ? "How custom development works" : "Material technologies and options"}</h2>
          <dl className="mt-6 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {v.technologies.map((t) => (
              <div key={t.name} className="bg-white p-5">
                <dt className="font-display text-[1rem] font-semibold text-char-950">{t.name}</dt>
                <dd className="mt-2 text-[0.9rem] leading-relaxed text-ink-2">{t.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="products" className="scroll-mt-24 py-14 lg:py-20">
        <div className="container-x">
          <SectionHeading eyebrow={`${items.length} formats`} title={`${v.name} range`} intro="Each product has a dedicated page with specifications, FAQs, a downloadable flyer and a direct quotation route." />
          <div className="mt-10"><ProductGrid cards={items.map(toCard)} /></div>
        </div>
      </section>

      <section className="border-y border-line bg-paper-2 py-14">
        <div className="container-x">
          <h2 className="t-3">Industries using {v.navName.toLowerCase()} packaging</h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {inds.map((id) => (
              <li key={id}>
                <Link href={`/industries/${industryById[id].slug}`} className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-white px-4 py-2 text-[0.9rem] font-semibold text-char-900 hover:border-red-500">
                  <IndustryIcon name={industryById[id].icon} className="h-4 w-4" /> {industryById[id].name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading eyebrow="FAQs" title={`${v.navName} questions`} />
          <FaqList faqs={v.faqs} />
        </div>
      </section>

      {!isCustom && <CustomRequirementBand context={v.slug} />}
      <CtaBand title={`Request a quote for ${v.name.toLowerCase()}`} text="Tell us the product, dimensions, material and quantities. The form adapts to what you choose, and you can attach drawings or artwork." />
    </>
  );
}
