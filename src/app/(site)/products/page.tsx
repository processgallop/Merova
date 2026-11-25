/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Emblem } from "@/components/brand/Logo";
import { Btn, Crumbs } from "@/components/ui/blocks";
import { Cta } from "@/components/sections/Sections";
import { getCatalog, segmentUrl } from "@/lib/content";
import { meta } from "@/lib/meta";

export const revalidate = 3600;
export const metadata = meta({
  title: "Packaging Products | Corrugated, Paperboard, Foodservice, Flexible & Custom",
  description: "Explore Merova's five packaging segments — corrugated, paperboard, foodservice and QSR, plastic and flexible, and custom packaging — with a page and flyer for every product.",
  path: "/products",
});

export default async function ProductsPage() {
  const { segments, cards } = await getCatalog();
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <Emblem className="pointer-events-none absolute -right-[8%] -top-1/4 w-[60%] opacity-[0.05]" />
        <div className="wrap relative pb-16 pt-10">
          <Crumbs items={[{ name: "Products", href: "/products" }]} />
          <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="eyebrow rise-in">Product portfolio · {cards.length} products</p>
              <h1 className="t-hero rise-in mt-6" style={{ "--d": 1 } as React.CSSProperties}>Every Packaging Requirement. A Clearly Defined Solution.</h1>
            </div>
            <div className="lg:col-span-4">
              <p className="t-lead rise-in" style={{ "--d": 2 } as React.CSSProperties}>Five segments, organised by material and format. Prefer to start from your sector? The industry finder brings relevant products from every segment together.</p>
              <div className="rise-in mt-6" style={{ "--d": 3 } as React.CSSProperties}><Btn href="/industries" variant="dark">Find packaging by industry</Btn></div>
            </div>
          </div>
        </div>
      </section>

      <nav aria-label="Segments" className="sticky top-[var(--header-h)] z-30 border-b border-line bg-cloud/95 backdrop-blur">
        <ul className="wrap scrollbar-none flex gap-1 overflow-x-auto py-2">
          {segments.map((s) => (
            <li key={s.id}><a href={`#seg-${s.code}`} className="flex h-10 items-center gap-2 whitespace-nowrap px-3 text-sm font-semibold text-heading hover:text-red"><span className="index-num text-red">{s.code}</span>{s.navName}</a></li>
          ))}
        </ul>
      </nav>

      {segments.map((s, i) => {
        const items = cards.filter((c) => c.segment.id === s.id);
        return (
          <section key={s.id} id={`seg-${s.code}`} className={`section ${i % 2 ? "surface-paper" : ""}`} style={{ scrollMarginTop: "calc(var(--header-h) + 60px)" }}>
            <div className="wrap grid gap-12 lg:grid-cols-12">
              <div className="min-w-0 lg:col-span-5">
                <div className="lg:sticky lg:top-[calc(var(--header-h)+90px)]">
                  <span className="index-num block text-[clamp(5rem,10vw,9rem)] leading-[0.8] text-red" data-reveal>{s.code}</span>
                  <h2 className="t-h2 mt-6" data-reveal>{s.name}</h2>
                  <p className="mt-4 text-lg" data-reveal>{s.intro}</p>
                  <div className="img-zoom relative mt-8 aspect-[4/3] overflow-hidden bg-surface" data-reveal="mask">
                    {s.image ? <img src={s.image.url} alt={s.image.alt} className="absolute inset-0 size-full object-cover" loading="lazy" /> : null}
                  </div>
                  <Link href={segmentUrl(s)} className="btn btn-dark mt-8"><span>Explore {s.navName}</span><ArrowRight className="btn-arrow size-4" /></Link>
                </div>
              </div>
              <div className="min-w-0 lg:col-span-7">
                {[...s.families, ...(items.some((c) => !s.families.some((f) => f.name === c.family)) ? [{ code: "+", name: "More products" }] : [])].map((f) => {
                  const fam = f.code === "+" ? items.filter((c) => !s.families.some((x) => x.name === c.family)) : items.filter((c) => c.family === f.name);
                  if (!fam.length) return null;
                  return (
                    <div key={f.code} className="mb-10 last:mb-0">
                      <p className="mb-3 flex items-baseline gap-3 border-b border-heading pb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted"><span className="text-red">{f.code}</span>{f.name}</p>
                      <ul className="divide-y divide-line">
                        {fam.map((c) => (
                          <li key={c.id}>
                            <Link href={c.url} className="group flex items-center gap-5 py-4">
                              <span className="relative size-16 flex-none overflow-hidden bg-surface">{c.image ? <img src={c.image.url} alt="" className="size-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" /> : null}</span>
                              <span className="min-w-0 flex-1">
                                <span className="block font-display text-lg font-bold leading-snug text-heading group-hover:text-red">{c.name}</span>
                                <span className="mt-0.5 block truncate text-sm">{c.summary}</span>
                              </span>
                              <ArrowUpRight className="size-5 flex-none text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-red" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}
      <Cta data={{ variant: "red", heading: "Not sure which format fits?", text: "Describe the product and how it travels. We will recommend a specification.", primary: { label: "Request a Quote", href: "/request-a-quote" }, secondary: { label: "Discuss a Custom Requirement", href: "/custom-requirement" } }} />
    </>
  );
}
