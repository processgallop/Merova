import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CtaBand, FaqList, PageHero, SectionHead } from "@/components/ui/blocks";
import { MaterialColumns } from "@/components/industry/MaterialColumns";
import { AddKit } from "@/components/basket/Basket";
import { WhatsAppContext } from "@/components/layout/Dock";
import { industries, industryBySlug, productById } from "@/data/catalog";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const dynamicParams = false;
export const generateStaticParams = () => industries.flatMap((i) => i.operators.filter((o) => o.page).map((o) => ({ industry: i.slug, operator: o.slug })));
type Props = { params: Promise<{ industry: string; operator: string }> };

async function resolve({ params }: Props) { const { industry, operator } = await params; const i = industryBySlug(industry); const o = i?.operators.find((x) => x.slug === operator && x.page); return i && o ? { i, o } : undefined; }

export async function generateMetadata(props: Props) {
  const r = await resolve(props); if (!r) return {};
  const names = r.o.primary.slice(0, 4).map((id) => productById[id]?.name.toLowerCase()).join(", ");
  return pageMetadata({ title: `Packaging for ${r.o.name} | Merova Printpack`.slice(0, 70), description: `${r.o.intro} Includes ${names}.`.slice(0, 158), path: r.o.url, image: r.o.image });
}

export default async function OperatorPage(props: Props) {
  const r = await resolve(props); if (!r) notFound();
  const { i, o } = r;
  const siblings = i.operators.filter((x) => x.page && x.id !== o.id);
  return (
    <>
      <WhatsAppContext message={`Hello Merova team, I run a ${o.name.toLowerCase().replace(/s$/, "")} business and need packaging. Please share options and quotation details.`} label={`${o.name} packaging`} />
      {o.faqs.length > 0 && <JsonLd data={faqJsonLd(o.faqs)} />}
      <PageHero tone="red" crumbs={[{ name: "Industries", href: "/industries/" }, { name: i.name, href: i.url }, { name: o.name, href: o.url }]} eyebrow={i.name} title={o.headline} intro={o.intro} image={o.image} imageAlt={o.headline}>
        <AddKit ids={o.primary} label={o.name} industry={i.name} operator={o.name} />
      </PageHero>
      {o.points.length > 0 && (
        <section className="section-tight bg-sand">
          <div className="wrap wrap-wide grid gap-4 md:grid-cols-3">
            {o.points.map((pt, k) => <div key={pt.title} className="reveal rounded-[24px] bg-white p-6" style={{ ["--i" as string]: k }}><p className="eyebrow">Point of use {k + 1}</p><h2 className="mt-3 h3">{pt.title}</h2><p className="mt-2 text-[15px] text-stone">{pt.text}</p></div>)}
          </div>
        </section>
      )}
      <section className="section">
        <div className="wrap wrap-wide">
          <SectionHead eyebrow="Your packaging kit, by material" title={`What ${o.name.toLowerCase()} use.`} intro="Core products are what most businesses like yours buy. Optional products depend on your menu, range or delivery model. Add any of them to one enquiry." />
          <div className="mt-10"><MaterialColumns primary={o.primary} secondary={o.secondary} /></div>
          <div className="reveal mt-8 flex flex-col gap-4 rounded-[24px] bg-graphite p-6 text-white sm:flex-row sm:items-center sm:justify-between lg:p-8">
            <p className="max-w-xl text-lg">Not sure about sizes or quantities? Add the kit and tell us about your outlet. We&apos;ll recommend the specification.</p>
            <AddKit ids={o.primary} label={o.name} industry={i.name} operator={o.name} />
          </div>
        </div>
      </section>
      <section className="section-tight bg-sand">
        <div className="wrap wrap-wide grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>{o.faqs.length > 0 ? <><p className="eyebrow">FAQs</p><h2 className="h2 mt-4">Questions from {o.name.toLowerCase()}.</h2><FaqList faqs={o.faqs} className="mt-8" /></> : <><p className="eyebrow">Custom requirements</p><h2 className="h2 mt-4">Need something specific?</h2><p className="lede mt-4">Describe the product, the outlet and the volumes. Upload a photo of your current pack if you have one.</p></>}
            <Link href="/custom-packaging/" className="btn btn-dark mt-8">Describe your requirement <ArrowRight className="arrow h-4 w-4" /></Link>
          </div>
          <div className="rounded-[24px] bg-white p-6"><p className="eyebrow eyebrow-muted">Also in {i.name}</p><ul className="mt-4 grid gap-1">{siblings.map((s) => <li key={s.id}><Link href={s.url} className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-sand"><span>{s.name}</span><ArrowRight className="h-4 w-4 text-red" /></Link></li>)}</ul></div>
        </div>
      </section>
      <CtaBand title={`Packaging for ${o.name.toLowerCase()}, quoted together.`} />
    </>
  );
}
