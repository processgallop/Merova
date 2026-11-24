import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand, PageHero, Render, SampleBadge, SectionHead } from "@/components/ui/blocks";
import { categories, counts, industries, productsIn } from "@/data/catalog";
import { SAMPLE_FACILITY, VALUES } from "@/data/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "About Merova Printpack | Multi-Material Printing & Packaging Partner", description: "Merova Printpack is a printing and packaging partner across paper, plastic and film, compostable and corrugated materials. How we work, what we make and who we serve.", path: "/about/" });

const LINKS = [["Manufacturing & infrastructure", "/about/manufacturing/"], ["Quality assurance", "/about/quality/"], ["Process excellence", "/about/process/"], ["Client servicing", "/about/client-servicing/"], ["Sustainability", "/about/sustainability/"], ["Leadership & team", "/about/leadership/"], ["Careers", "/about/careers/"], ["Business partnerships", "/about/partnerships/"]];

export default function About() {
  return (
    <>
      <PageHero tone="red" crumbs={[{ name: "About Merova", href: "/about/" }]} eyebrow="About Merova" title="One accountable partner across four materials." intro="Merova Printpack specifies, prints and supplies packaging in paper, plastic and film, compostable and corrugated materials, for manufacturers, food businesses, retailers and institutions." image="/assets/renders/scenes/about.webp" imageAlt="Merova packaging across four materials" />
      <section className="section">
        <div className="wrap wrap-wide grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div className="reveal"><p className="eyebrow">Our position</p><h2 className="h2 mt-4">Specified, printed and checked. Whatever the material.</h2></div>
          <div className="reveal body grid gap-5 text-[17px]" style={{ ["--i" as string]: 1 }}>
            <p>Most businesses buy packaging from several suppliers: one for cartons, one for films, another for corrugated shippers and yet another for compostable alternatives. Each has its own assumptions, its own colour standard and its own lead times.</p>
            <p>Merova brings those materials under one specification discipline. We start from the product and how it is filled, stored, shipped and sold. We specify the right material and construction, prove it on a sample, and supply it to the approved reference, order after order.</p>
          </div>
        </div>
        <div className="wrap wrap-wide mt-14">
          <div className="flex items-center gap-3"><p className="eyebrow eyebrow-muted">At a glance</p>{<SampleBadge />}</div>
          <dl className="mt-4 grid gap-px overflow-hidden rounded-[28px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {[{ value: String(counts.products), label: "product types across four materials" }, { value: String(counts.industries), label: "industries with dedicated packaging guides" }, { value: String(counts.operators), label: "business types mapped to their packaging" }, SAMPLE_FACILITY.facts[3]].map((f) => <div key={f.label} className="bg-white p-7"><dt className="order-2 mt-2 text-sm text-stone">{f.label}</dt><dd className="font-display text-5xl font-semibold tracking-tight text-red tnum">{f.value}</dd></div>)}
          </dl>
        </div>
      </section>
      <section className="section bg-sand">
        <div className="wrap wrap-wide">
          <SectionHead eyebrow="Portfolio" title="Four material categories." />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{categories.map((c, i) => <Link key={c.id} href={`/products/${c.slug}/`} className="tile reveal" style={{ ["--i" as string]: i }}><div className="p-3 pb-0"><Render src={c.image} alt="" label={false} className="rounded-[20px]" ratio="aspect-[4/3]" sizes="25vw" /></div><div className="p-6"><h3 className="h4">{c.name}</h3><p className="mt-1 text-sm text-stone">{productsIn(c.id).length} products · {c.promise}</p></div></Link>)}</div>
        </div>
      </section>
      <section className="section">
        <div className="wrap wrap-wide grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHead eyebrow="How we work" title="Four commitments." />
          <div className="grid gap-4 sm:grid-cols-2">{VALUES.map((v, i) => <div key={v.title} className="reveal rounded-[24px] border border-line bg-white p-6" style={{ ["--i" as string]: i }}><h3 className="h4">{v.title}</h3><p className="mt-2 text-[15px] text-stone">{v.text}</p></div>)}</div>
        </div>
      </section>
      <section className="section-tight bg-graphite text-white">
        <div className="wrap wrap-wide">
          <SectionHead tone="dark" eyebrow="Industries" title="Who we serve." />
          <div className="mt-8 flex flex-wrap gap-2">{industries.map((i) => <Link key={i.id} href={i.url} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm hover:border-white">{i.name} <ArrowRight className="h-3.5 w-3.5" /></Link>)}</div>
          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{LINKS.map(([t, u]) => <Link key={u} href={u} className="group flex items-center justify-between rounded-2xl bg-graphite-2 px-5 py-4 font-medium hover:bg-red">{t}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>)}</div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
