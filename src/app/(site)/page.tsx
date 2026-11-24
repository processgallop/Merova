import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Download, FileText, Layers, PenTool, ShieldCheck, Sparkles } from "lucide-react";
import { CtaBand, ProductTile, Render, SectionHead } from "@/components/ui/blocks";
import { IndustryFinder, type FinderData } from "@/components/industry/Finder";
import { categories, counts, industries, operatorById, productById, products, productsIn } from "@/data/catalog";
import { CLAIM_DEFINITIONS, CLIENT_SERVICE, PROCESS_STEPS, VALUES } from "@/data/company";
import { articles, readingMinutes } from "@/content/blog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Merova Printpack | Paper, Plastic, Compostable & Corrugated Packaging",
  description: "Packaging, Perfected. Merova Printpack supplies printed paper, plastic and film, compostable and corrugated packaging for food, retail, pharma, e-commerce and industry. Request a quote.",
  path: "/",
});

const finder: FinderData = {
  industries: industries.map((i) => ({ id: i.id, name: i.name, url: i.url, ops: i.operators.map((o) => ({ id: o.id, name: o.name, url: o.url, primary: o.primary, secondary: o.secondary })) })),
  products: Object.fromEntries(products.map((p) => [p.id, { n: p.name, u: p.url, i: p.image, c: p.category }])),
  cats: categories.map((c) => ({ id: c.id, name: c.short, accent: c.accent })),
};

const FEATURED = ["PA-09", "PL-01", "CR-02", "PA-03", "CO-10", "PA-05", "CR-06", "PA-07"];
const APPS = ["multiplex-cinema", "sweet-shops", "cloud-kitchens", "ecommerce-d2c"];

export default function Home() {
  const [paper, plastic, compost, corr] = categories;
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-red text-white">
        <svg viewBox="0 0 1200 500" aria-hidden className="draw pointer-events-none absolute -bottom-10 left-0 h-auto w-[140%] max-w-none opacity-25 lg:w-full"><path pathLength={1} d="M-20 420 C 120 120, 230 80, 300 260 S 420 520, 520 230 S 700 -40, 860 210 S 1080 420, 1220 190" fill="none" stroke="#F1F0EC" strokeWidth="38" strokeLinecap="round" /></svg>
        <div className="wrap wrap-wide relative grid gap-10 pb-16 pt-12 lg:grid-cols-[1.02fr_1fr] lg:items-center lg:gap-6 lg:pb-24 lg:pt-16">
          <div className="rise relative z-10">
            <p className="eyebrow !text-reverse" style={{ ["--i" as string]: 0 }}>Printing &amp; packaging · Paper · Plastic · Compostable · Corrugated</p>
            <h1 className="display mt-6 text-white"><span className="block" style={{ ["--i" as string]: 1 }}>Packaging,</span><span className="block" style={{ ["--i" as string]: 2 }}>Perfected.</span></h1>
            <p className="mt-6 font-display text-xl font-medium tracking-tight text-reverse sm:text-2xl" style={{ ["--i" as string]: 3 }}>Engineered to Protect. Designed to Perform.</p>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-white/85" style={{ ["--i" as string]: 4 }}>One partner for {counts.products} packaging products across four materials, specified to your product, printed to your brand and sampled before production.</p>
            <div className="mt-9 flex flex-wrap gap-3" style={{ ["--i" as string]: 5 }}>
              <Link href="/products/" className="btn btn-cloud btn-lg">Explore products <ArrowRight className="arrow h-4 w-4" /></Link>
              <Link href="/request-a-quote/" className="btn btn-ghost-light btn-lg">Request a Quote</Link>
            </div>
          </div>
          <div className="reveal-img relative">
            <div className="overflow-hidden rounded-[32px] shadow-[0_40px_120px_-40px_rgb(60_0_0/0.7)]">
              <Image src="/assets/renders/scenes/hero.webp" alt="Merova packaging across four materials: corrugated boxes, printed cartons, a popcorn tub, film roll and paper cups" width={1920} height={1200} priority sizes="(min-width: 1024px) 52vw, 100vw" className="aspect-[16/11] w-full object-cover" />
            </div>
            <p className="absolute bottom-4 left-4 rounded-full bg-black/35 px-3 py-1 text-[11px] text-white backdrop-blur">3D render · sample brands</p>
          </div>
        </div>
        <div className="relative border-t border-white/15">
          <div className="wrap wrap-wide grid grid-cols-2 gap-y-4 py-6 text-sm text-reverse sm:grid-cols-4">
            {categories.map((c) => <Link key={c.id} href={`/products/${c.slug}/`} className="group flex items-center gap-2 hover:text-white"><span className="mat-dot !bg-white/70" />{c.name}<ArrowRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" /></Link>)}
          </div>
        </div>
      </section>

      {/* MATERIALS */}
      <section className="section">
        <div className="wrap wrap-wide">
          <SectionHead eyebrow="Four materials, one partner" title={<>Every material has a purpose.<br className="hidden sm:block" /> Find the right one.</>} intro="Start with the material, or start with your business below. Every product links to its specification, flyer and an instant enquiry." action={<Link href="/products/" className="btn btn-outline">All {counts.products} products <ArrowRight className="arrow h-4 w-4" /></Link>} />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_auto]">
            {[{ c: paper, cls: "lg:col-span-2 lg:row-span-2 tile-red", big: true }, { c: corr, cls: "lg:col-span-2" }, { c: plastic, cls: "" }, { c: compost, cls: "tile-dark" }].map(({ c, cls, big }, i) => (
              <Link key={c.id} href={`/products/${c.slug}/`} className={`tile reveal group ${cls}`} style={{ ["--i" as string]: i }}>
                <div className={`p-3 pb-0 ${big ? "lg:flex-1" : ""}`}><Render src={c.image} alt={`${c.name} by Merova`} label={false} className="rounded-[20px] lg:h-full" ratio={big ? "aspect-[4/3] lg:aspect-auto lg:min-h-[340px]" : "aspect-[16/9]"} sizes={big ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, 100vw"} /></div>
                <div className={`flex flex-col p-6 ${big ? "" : "flex-1"}`}>
                  <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${cls.includes("tile-") ? "text-white/70" : "text-stone"}`}>{productsIn(c.id).length} products</p>
                  <h3 className={`mt-2 font-display font-semibold tracking-tight ${big ? "text-3xl lg:text-[40px] lg:leading-[1.05]" : "text-2xl"}`}>{c.name}</h3>
                  <p className={`mt-2 ${cls.includes("tile-") ? "text-white/85" : "text-stone"} ${big ? "text-lg" : "text-[15px]"}`}>{c.promise}{big && <> {c.intro}</>}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold">Explore {c.short} <ArrowRight className="tile-arrow h-4 w-4" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRY FINDER */}
      <section className="section bg-sand">
        <div className="wrap wrap-wide">
          <SectionHead eyebrow="Find packaging for your business" title="Tell us what you run. We'll show you what you need." intro="Pick your industry and business type. The packaging it uses appears by material, ready to add to one enquiry." />
          <div className="reveal mt-12"><IndustryFinder data={finder} /></div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="section">
        <div className="wrap wrap-wide">
          <SectionHead eyebrow="Featured products" title="Made to be specified, printed and trusted." action={<Link href="/products/" className="link-arrow">Browse the full range <ArrowRight className="h-4 w-4" /></Link>} />
          <div className="mt-12 grid auto-rows-auto gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED.map((id, i) => <div key={id} className={`reveal contents`} style={{ ["--i" as string]: i }}><ProductTile p={productById[id]} size={i === 0 ? "L" : i === 5 ? "M" : "S"} tone={i === 0 ? "sand" : "white"} showCategory /></div>)}
          </div>
        </div>
      </section>

      {/* WHY MEROVA */}
      <section className="section bg-graphite text-white">
        <div className="wrap wrap-wide">
          <SectionHead tone="dark" eyebrow="Why Merova" title="One specification discipline across every material." intro="Buyers deal with one accountable team for paper, plastic, compostable and corrugated packaging, instead of four vendors and four sets of assumptions." />
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v, i) => (
              <div key={v.title} className={`reveal rounded-[28px] p-8 ${i === 0 ? "bg-red lg:row-span-2" : "bg-graphite-2"}`} style={{ ["--i" as string]: i }}>
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${i === 0 ? "bg-white/15" : "bg-red"}`}>{[<Layers key="a" className="h-6 w-6" />, <Check key="b" className="h-6 w-6" />, <PenTool key="c" className="h-6 w-6" />, <ShieldCheck key="d" className="h-6 w-6" />][i]}</span>
                <h3 className={`mt-8 font-display font-semibold tracking-tight ${i === 0 ? "text-3xl lg:text-4xl" : "text-2xl"}`}>{v.title}</h3>
                <p className={`mt-3 leading-relaxed ${i === 0 ? "text-lg text-white/90" : "text-[#cfc7c0]"}`}>{v.text}</p>
                {i === 0 && <Link href="/about/" className="btn btn-cloud mt-10">About Merova <ArrowRight className="arrow h-4 w-4" /></Link>}
              </div>
            ))}
            <Link href="/custom-packaging/" className="reveal tile !border-white/10 !bg-transparent p-8 text-white hover:!bg-white/5" style={{ ["--i" as string]: 4 }}>
              <Sparkles className="h-6 w-6 text-[#ff8c80]" />
              <h3 className="mt-8 font-display text-2xl font-semibold">Something you can&apos;t find?</h3>
              <p className="mt-3 text-[#cfc7c0]">Describe the requirement, upload a photo of your current pack, and we&apos;ll propose a format.</p>
              <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-[#ff8c80]">Describe your requirement <ArrowRight className="tile-arrow h-4 w-4" /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section">
        <div className="wrap wrap-wide grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <SectionHead eyebrow="Manufacturing & process" title="From requirement to delivery, in nine controlled steps." intro="Every order runs through the same sequence. The approved sample becomes the reference for production and for every repeat order." />
            <div className="reveal mt-8 flex flex-wrap gap-3"><Link href="/about/process/" className="btn btn-dark">How we work <ArrowRight className="arrow h-4 w-4" /></Link><Link href="/about/manufacturing/" className="btn btn-outline">Manufacturing</Link><Link href="/about/quality/" className="btn btn-outline">Quality</Link></div>
            <div className="reveal-img mt-10 hidden lg:block"><Render src="/assets/renders/scenes/process.webp" alt="Die-cut corrugated box opening to show its locking flap" className="rounded-[28px]" sizes="40vw" /></div>
          </div>
          <ol className="relative grid gap-3 before:absolute before:bottom-6 before:left-[27px] before:top-6 before:w-0.5 before:bg-line">
            {PROCESS_STEPS.map((s, i) => (
              <li key={s.name} className="reveal relative flex gap-5 rounded-[24px] p-3 pr-6 hover:bg-sand" style={{ ["--i" as string]: i % 4 }}>
                <span className="relative z-10 grid h-14 w-14 flex-none place-items-center rounded-full border-2 border-red bg-cloud font-display text-lg font-semibold text-red tnum">{String(i + 1).padStart(2, "0")}</span>
                <div className="pt-2"><h3 className="h4">{s.name}</h3><p className="mt-1 text-[15px] leading-relaxed text-stone">{s.detail}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* APPLICATIONS */}
      <section className="section bg-sand">
        <div className="wrap wrap-wide">
          <SectionHead eyebrow="Applications" title="Packaging that performs at every point of service." action={<Link href="/industries/" className="link-arrow">All industries <ArrowRight className="h-4 w-4" /></Link>} />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {APPS.map((id, i) => { const o = operatorById[id]; return (
              <Link key={id} href={o.url} className={`tile reveal group ${i === 0 ? "lg:col-span-2 lg:row-span-2" : ""} ${i === 3 ? "lg:col-span-2" : ""}`} style={{ ["--i" as string]: i }}>
                <div className="relative flex-1"><Render src={o.image} alt={o.headline} label={false} ratio={i === 0 ? "aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[420px]" : "aspect-[16/10]"} sizes="(min-width:1024px) 50vw, 100vw" /></div>
                <div className="p-6"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone">{industries.find((d) => d.id === o.industry)!.name}</p><h3 className="mt-2 font-display text-xl font-semibold tracking-tight">{o.name}</h3><p className="mt-1 text-sm text-stone">{o.primary.length} core products across {new Set(o.primary.map((p) => productById[p].category)).size} materials</p></div>
              </Link>
            ); })}
          </div>
        </div>
      </section>

      {/* SUSTAINABILITY */}
      <section className="section">
        <div className="wrap wrap-wide grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="reveal-img"><Render src="/assets/renders/scenes/sustainability.webp" alt="Moulded-fibre clamshell and compostable pouch" className="rounded-[28px]" /></div>
          <div>
            <SectionHead eyebrow="Sustainability" title="Compostable, recyclable, recycled. Not the same thing." intro="We name materials precisely and publish compostable claims only against the certificate for that grade." />
            <dl className="reveal mt-8 grid gap-px overflow-hidden rounded-[24px] border border-line bg-line">
              {CLAIM_DEFINITIONS.map((d) => <div key={d.term} className="bg-white p-5"><dt className="h4">{d.term}</dt><dd className="mt-1 text-[15px] leading-relaxed text-stone">{d.text}</dd></div>)}
            </dl>
            <div className="reveal mt-8 flex flex-wrap gap-3"><Link href="/products/compostable-products/" className="btn btn-dark">Compostable products <ArrowRight className="arrow h-4 w-4" /></Link><Link href="/about/sustainability/" className="btn btn-outline">Our approach</Link></div>
          </div>
        </div>
      </section>

      {/* CUSTOMISATION & SERVICE */}
      <section className="section bg-sand">
        <div className="wrap wrap-wide grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="reveal rounded-[28px] bg-white p-8 lg:p-12">
            <p className="eyebrow">Customisation</p>
            <h2 className="h2 mt-4">Your size. Your print. Your spec.</h2>
            <ul className="mt-8 grid gap-4 text-[15.5px]">
              {["Custom dimensions and dielines", "Brand colours matched on a signed proof", "Finishes: foil, emboss, lamination, spot UV, windows", "Material and coating to suit the product and the route", "Samples for fit and handling before production"].map((t) => <li key={t} className="flex gap-3"><span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-red-50 text-red"><Check className="h-3.5 w-3.5" /></span>{t}</li>)}
            </ul>
            <Link href="/custom-packaging/" className="btn btn-primary mt-10">Discuss your packaging requirement <ArrowRight className="arrow h-4 w-4" /></Link>
          </div>
          <div className="reveal" style={{ ["--i" as string]: 1 }}>
            <p className="eyebrow">Client servicing</p>
            <h2 className="h2 mt-4">A named person from enquiry to repeat order.</h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {CLIENT_SERVICE.slice(0, 6).map((c) => <div key={c.name} className="rounded-[20px] border border-line bg-cloud p-5"><h3 className="h4">{c.name}</h3><p className="mt-1 text-sm leading-relaxed text-stone">{c.text}</p></div>)}
            </div>
            <Link href="/about/client-servicing/" className="link-arrow mt-6">How we service clients <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* DOWNLOADS */}
      <section className="section">
        <div className="wrap wrap-wide">
          <SectionHead eyebrow="Resources" title="Specifications you can share internally." intro="Download the master catalogue, a category brochure, the company profile or any product flyer. No forms." action={<Link href="/resources/downloads/" className="btn btn-outline">Download centre <ArrowRight className="arrow h-4 w-4" /></Link>} />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            <a href="/assets/downloads/merova-product-catalogue.pdf" className="tile tile-red reveal p-8 sm:col-span-2 lg:row-span-2" download>
              <FileText className="h-8 w-8" /><h3 className="mt-auto pt-16 font-display text-3xl font-semibold">Master product catalogue</h3><p className="mt-2 text-white/85">All {counts.products} products, four categories, one PDF.</p><span className="mt-6 inline-flex items-center gap-2 font-semibold"><Download className="h-4 w-4" /> Download PDF</span>
            </a>
            {categories.map((c, i) => (
              <a key={c.id} href={`/assets/downloads/merova-${c.slug}-brochure.pdf`} download className="tile reveal p-6 lg:col-span-2" style={{ ["--i" as string]: i + 1 }}>
                <span className="mat-dot" style={{ ["--mat" as string]: c.accent }} />
                <h3 className="mt-6 h4">{c.name} brochure</h3><p className="mt-1 text-sm text-stone">{productsIn(c.id).length} products · PDF</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-red"><Download className="h-4 w-4" /> Download</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* INSIGHTS */}
      <section className="section bg-sand">
        <div className="wrap wrap-wide">
          <SectionHead eyebrow="Insights" title="Practical guides for packaging buyers." action={<Link href="/insights/" className="link-arrow">All articles <ArrowRight className="h-4 w-4" /></Link>} />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[articles[0], articles[4], articles[9]].map((a, i) => (
              <Link key={a.slug} href={a.url} className="tile reveal group" style={{ ["--i" as string]: i }}>
                <div className="p-3 pb-0"><Render src={a.image} alt="" label={false} className="rounded-[20px]" ratio="aspect-[16/10]" sizes="(min-width:768px) 33vw, 100vw" /></div>
                <div className="flex flex-1 flex-col p-6"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone">{readingMinutes(a)} min read</p><h3 className="mt-2 font-display text-xl font-semibold leading-snug tracking-tight group-hover:text-red">{a.title}</h3><p className="mt-2 line-clamp-2 text-sm text-stone">{a.description}</p></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
