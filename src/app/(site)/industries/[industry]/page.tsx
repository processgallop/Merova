import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CtaBand, FaqList, PageHero, Render, SectionHead } from "@/components/ui/blocks";
import { MaterialColumns } from "@/components/industry/MaterialColumns";
import { AddKit } from "@/components/basket/Basket";
import { WhatsAppContext } from "@/components/layout/Dock";
import { industries, industryBySlug } from "@/data/catalog";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => industries.map((i) => ({ industry: i.slug }));
type Props = { params: Promise<{ industry: string }> };

export async function generateMetadata({ params }: Props) {
  const i = industryBySlug((await params).industry);
  return i ? pageMetadata({ title: `${i.name} Packaging | Products by Business Type | Merova Printpack`.slice(0, 70), description: `${i.intro}`.slice(0, 158), path: i.url, image: i.image }) : {};
}

export default async function IndustryPage({ params }: Props) {
  const i = industryBySlug((await params).industry);
  if (!i) notFound();
  const pages = i.operators.filter((o) => o.page);
  const sections = i.operators.filter((o) => !o.page);
  return (
    <>
      <WhatsAppContext message={`Hello Merova team, I'm looking for packaging for ${i.name.toLowerCase()}. Please share options.`} label={`${i.name} packaging`} />
      <PageHero crumbs={[{ name: "Industries", href: "/industries/" }, { name: i.name, href: i.url }]} eyebrow={i.name} title={i.headline} intro={i.intro} image={i.image} imageAlt={`Packaging for ${i.name}`}>
        <a href="#businesses" className="btn btn-primary">Find your business <ArrowRight className="arrow h-4 w-4" /></a>
        <Link href="/request-a-quote/" className="btn btn-outline">Request a Quote</Link>
      </PageHero>

      {i.needs.length > 0 && (
        <section className="section-tight bg-graphite text-white">
          <div className="wrap wrap-wide">
            <SectionHead tone="dark" eyebrow="What packaging must do here" title={`What ${i.name.toLowerCase()} needs from packaging.`} />
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{i.needs.map((n, k) => <div key={n.title} className="reveal rounded-[24px] bg-graphite-2 p-6" style={{ ["--i" as string]: k }}><span className="font-display text-sm font-semibold text-[#ff8c80] tnum">{String(k + 1).padStart(2, "0")}</span><h3 className="mt-4 h4 text-white">{n.title}</h3><p className="mt-2 text-[15px] text-[#cfc7c0]">{n.text}</p></div>)}</div>
          </div>
        </section>
      )}

      <section id="businesses" className="section scroll-mt-24">
        <div className="wrap wrap-wide">
          <SectionHead eyebrow="By business type" title="Choose your business." />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pages.map((o, k) => (
              <Link key={o.id} href={o.url} className="tile reveal group" style={{ ["--i" as string]: k % 3 }}>
                <div className="p-3 pb-0"><Render src={o.image} alt="" label={false} className="rounded-[20px]" ratio="aspect-[16/10]" sizes="(min-width:1024px) 33vw, 100vw" /></div>
                <div className="flex flex-1 flex-col p-6"><h3 className="font-display text-xl font-semibold tracking-tight">{o.name}</h3><p className="mt-2 text-sm text-stone">{o.primary.length} core and {o.secondary.length} optional products</p><span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-red">See the packaging kit <ArrowRight className="tile-arrow h-4 w-4" /></span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {sections.map((o, k) => (
        <section key={o.id} id={o.slug} className={`section-tight scroll-mt-24 ${k % 2 === 0 ? "bg-sand" : ""}`}>
          <div className="wrap wrap-wide">
            <SectionHead eyebrow={i.name} title={o.headline} intro={o.intro} action={<AddKit ids={o.primary} label={o.name} industry={i.name} operator={o.name} />} />
            <div className="mt-10"><MaterialColumns primary={o.primary} secondary={o.secondary} /></div>
          </div>
        </section>
      ))}

      {i.faqs.length > 0 && <section className="section-tight"><div className="wrap wrap-wide grid gap-10 lg:grid-cols-[0.8fr_1.2fr]"><SectionHead eyebrow="FAQs" title="Common questions." /><FaqList faqs={i.faqs} /></div></section>}
      <CtaBand title={`Packaging for ${i.name.toLowerCase()}, in one enquiry.`} />
    </>
  );
}
