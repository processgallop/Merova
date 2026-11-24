import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand, PageHero, SectionHead } from "@/components/ui/blocks";
import { CLAIM_DEFINITIONS, SUSTAINABILITY_TOPICS } from "@/data/company";
import { categories } from "@/data/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Sustainability | Materials Stated Precisely | Merova Printpack", description: "How Merova approaches recycled content, recyclable formats, compostable materials and material optimisation, without greenwashing.", path: "/about/sustainability/" });

export default function Page() {
  return (
    <>
      <PageHero tone="dark" crumbs={[{ name: "About Merova", href: "/about/" }, { name: "Sustainability", href: "/about/sustainability/" }]} eyebrow="Sustainability" title="Compostable, stated precisely." intro="Four material categories, each described accurately. Compostable claims are made only against the certificate for the grade supplied." image="/assets/renders/scenes/sustainability.webp" imageAlt="Moulded fibre clamshell and compostable pouch" />
      <section className="section">
        <div className="wrap wrap-wide grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHead eyebrow="Definitions" title="Four claims, four meanings." />
          <dl className="reveal grid gap-px overflow-hidden rounded-[24px] border border-line bg-line">{CLAIM_DEFINITIONS.map((d) => <div key={d.term} className="bg-white p-6"><dt className="h4">{d.term}</dt><dd className="mt-2 text-[15.5px] text-stone">{d.text}</dd></div>)}</dl>
        </div>
      </section>
      <section className="section bg-sand">
        <div className="wrap wrap-wide">
          <SectionHead eyebrow="In practice" title="What we do." />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">{SUSTAINABILITY_TOPICS.map((t, i) => <div key={t.name} className="reveal rounded-[24px] bg-white p-6" style={{ ["--i" as string]: i % 5 }}><h3 className="h4">{t.name}</h3><p className="mt-2 text-sm text-stone">{t.text}</p></div>)}</div>
          <div className="mt-10 flex flex-wrap gap-2">{categories.map((c) => <Link key={c.id} href={`/products/${c.slug}/`} className="chip">{c.name} <ArrowRight className="h-3.5 w-3.5" /></Link>)}</div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
