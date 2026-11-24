import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { Breadcrumbs, CtaBand, CustomRequirementBand, FaqList, SectionHeading } from "@/components/ui/blocks";
import { ProductGrid } from "@/components/product/ProductCard";
import { IndustryIcon } from "@/components/ui/Icon";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { industries, industryBySlug, productsForIndustry } from "@/data/catalog";
import { toCard } from "@/data/cards";
import { articles } from "@/data/blog";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { pageMetadata } from "@/lib/seo";
import { whatsappHref } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => industries.map((i) => ({ slug: i.slug }));
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const i = industryBySlug((await params).slug);
  if (!i) return {};
  return pageMetadata({ title: i.seo.title, description: i.seo.description, path: `/industries/${i.slug}` });
}

export default async function IndustryPage({ params }: Props) {
  const i = industryBySlug((await params).slug);
  if (!i) notFound();
  const list = productsForIndustry(i.id);
  const quote = `/request-a-quote?industry=${i.id}`;
  const wa = whatsappHref(`Hello Merova Team, I am looking for packaging for the ${i.name} industry. I would like to discuss my requirements.`);
  const relatedSlugs = new Set(list.map((p) => p.slug));
  const reading = articles.filter((a) => a.relatedProducts.some((s) => relatedSlugs.has(s))).slice(0, 3);

  return (
    <>
      <section className="surface-red-deep relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/brand/merova-mark-cream.svg" alt="" aria-hidden="true" className="glyph-watermark -left-24 -bottom-16 w-[44rem] max-w-none" />
        <div className="container-x relative grid gap-10 py-12 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:py-16">
          <div className="reveal">
            <div className="[&_a]:text-cloud [&_span]:text-cloud [&_nav]:text-cloud"><Breadcrumbs items={[{ name: "Industries", href: "/industries" }, { name: i.name, href: `/industries/${i.slug}` }]} /></div>
            <div className="mt-8 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-cloud text-red-600"><IndustryIcon name={i.icon} className="h-5 w-5" /></span>
              <p className="eyebrow eyebrow-light">{i.name} packaging</p>
            </div>
            <h1 className="t-1 mt-6 max-w-4xl">{i.headline}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed">{i.intro}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="#solutions" className="btn btn-cloud">View {list.length} solutions <ArrowRight className="h-4 w-4" aria-hidden /></Link>
              <Link href={quote} className="btn btn-ghost-light">Request a Quote for {i.shortName}</Link>
              {wa && <TrackedLink href={wa} target="_blank" rel="noopener" event="whatsapp_click" params={{ industry: i.id }} className="btn btn-ghost-light"><MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp</TrackedLink>}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -bottom-4 -right-4 left-10 top-10 hidden bg-red-800/60 lg:block" aria-hidden />
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-paper-2">
              <Image src={i.image} alt={`Packaging for ${i.name.toLowerCase()}`} fill priority sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
              <span className="absolute bottom-2 left-2 rounded-sm bg-white/85 px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-char-600">{i.image.includes("/renders/") ? "Product visualisation" : "Representative image"}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="container-x">
          <SectionHeading eyebrow="What matters" title={`Packaging challenges in ${i.shortName.toLowerCase()}`} />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {i.challenges.map((c, n) => (
              <div key={c.title} className="rounded-sm border border-line bg-white p-6">
                <span className="font-display text-2xl font-semibold text-red-500">{String(n + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-display text-[1.08rem] font-semibold text-char-950">{c.title}</h3>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-2">{c.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-sm border border-line bg-paper-2 p-6">
            <h3 className="font-display text-[1.02rem] font-semibold text-char-950">What we consider when specifying</h3>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {i.considerations.map((c) => (
                <li key={c} className="flex gap-2.5 text-[0.93rem] text-ink-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden />{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="solutions" className="scroll-mt-24 border-y border-line bg-white py-14 lg:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow={`${list.length} packaging solutions`}
            title={`Packaging for ${i.name.toLowerCase()}`}
            intro="Every product links to its specifications, FAQs and downloadable flyer, and the quote button carries your industry through to the form."
            action={<Link href={quote} className="btn btn-primary">Request a Quote <ArrowRight className="h-4 w-4" aria-hidden /></Link>}
          />
          <div className="mt-10"><ProductGrid cards={list.map(toCard)} industry={i.id} /></div>
        </div>
      </section>

      <CustomRequirementBand industry={i.id} />

      <section className="py-14 lg:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading eyebrow="FAQs" title={`${i.shortName} packaging questions`} />
          <FaqList faqs={i.faqs} />
        </div>
      </section>

      {reading.length > 0 && (
        <section className="border-t border-line bg-white py-14 lg:py-20">
          <div className="container-x">
            <h2 className="t-2">Further reading</h2>
            <ul className="mt-8 grid gap-5 md:grid-cols-3">{reading.map((a) => <li key={a.slug}><ArticleCard article={a} /></li>)}</ul>
          </div>
        </section>
      )}

      <CtaBand title={`Talk to Merova about ${i.shortName.toLowerCase()} packaging`} text="Tell us what you pack, how it ships and how many you need. We'll recommend the format and send a quotation." primary={{ label: "Request a Quote", href: quote }} />
    </>
  );
}
