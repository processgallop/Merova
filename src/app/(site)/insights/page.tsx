import Link from "next/link";
import { CtaBand, PageHero, Render } from "@/components/ui/blocks";
import { articles, CATEGORIES, readingMinutes } from "@/content/blog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Insights | Packaging Guides for Buyers | Merova Printpack", description: "Practical guides on corrugated boxes, paperboard, films, foodservice packaging, compostable materials, e-commerce packaging and RFQs.", path: "/insights/" });

export default function Page() {
  const [lead, ...rest] = articles;
  return (
    <>
      <PageHero crumbs={[{ name: "Insights", href: "/insights/" }]} eyebrow="Insights" title="Practical guides for packaging buyers." intro="Written to help procurement, operations and brand teams make better packaging decisions." />
      <section className="section-tight bg-sand">
        <div className="wrap wrap-wide grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href={lead.url} className="tile tile-red reveal group md:col-span-2 lg:row-span-2"><div className="p-3 pb-0"><Render src={lead.image} alt="" label={false} className="rounded-[20px]" ratio="aspect-[16/9]" sizes="66vw" /></div><div className="p-8"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/75">{CATEGORIES[lead.category].name} · {readingMinutes(lead)} min</p><h2 className="mt-3 font-display text-3xl font-semibold leading-tight">{lead.title}</h2><p className="mt-3 text-white/85">{lead.description}</p></div></Link>
          {rest.map((a, i) => <Link key={a.slug} href={a.url} className="tile reveal group" style={{ ["--i" as string]: i % 3 }}><div className="p-3 pb-0"><Render src={a.image} alt="" label={false} className="rounded-[20px]" ratio="aspect-[16/10]" sizes="33vw" /></div><div className="flex flex-1 flex-col p-6"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone">{CATEGORIES[a.category].name} · {readingMinutes(a)} min</p><h2 className="mt-2 font-display text-xl font-semibold leading-snug group-hover:text-red">{a.title}</h2></div></Link>)}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
