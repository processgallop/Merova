import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Download, FileText } from "lucide-react";
import { IndustryDiscovery, type DiscoveryIndustry } from "@/components/industry/IndustryDiscovery";
import { CtaBand, FaqList, SectionHeading } from "@/components/ui/blocks";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { DOWNLOADS, industries, products, productsForIndustry, productsInVertical, verticals } from "@/data/catalog";
import { toCard } from "@/data/cards";
import { latestArticles } from "@/data/blog";
import { PROCESS_STEPS } from "@/data/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Merova Printpack — Packaging, Perfected. | Corrugated, Paper, Foodservice & Flexible Packaging",
  description:
    "Multi-material packaging partner for corrugated boxes, folding cartons, foodservice and QSR packaging, plastic and flexible films, and custom packaging. Find your packaging and request a quote.",
  path: "/",
});

const HOME_FAQS = [
  { q: "What packaging does Merova supply?", a: "Merova covers five verticals: corrugated packaging, paperboard and paper packaging, foodservice and QSR packaging, plastic and flexible packaging, and custom and specialised packaging. Each product page lists formats, materials and the technical information needed to quote." },
  { q: "How do I get a quotation?", a: "Use the Request a Quote form. It adapts to the product you choose and asks only for what is needed — dimensions, material, quantity and printing. You can attach drawings, artwork or photographs, or start a conversation on WhatsApp." },
  { q: "Can you develop packaging that isn't listed?", a: "Yes. Share your specifications, drawings, photographs or a sample through the custom requirement form, and the team will assess the application and propose a suitable solution." },
  { q: "Which industries do you work with?", a: "Pharmaceuticals and healthcare, automotive, food and beverage, retail, gifting, manufacturing and industrial, e-commerce, multiplexes and cinemas, FMCG, and electronics and appliances." },
];

const PILLARS = [
  { n: "01", title: "Multi-material expertise", text: "Corrugated, paperboard, foodservice board and flexible films — the material is chosen for the application, not the machine.", href: "/products" },
  { n: "02", title: "Custom development", text: "Structures developed from your drawings, photographs or samples, and proven on a sample before production.", href: "/custom-packaging" },
  { n: "03", title: "Quality at every stage", text: "Incoming material, in-process and final checks against one agreed specification.", href: "/quality" },
  { n: "04", title: "Clear technical information", text: "Specifications, flyers and FAQs for every product — with unconfirmed values clearly marked.", href: "/resources/downloads" },
];

export default function HomePage() {
  const cards = Object.fromEntries(products.map((p) => [p.slug, toCard(p)]));
  const discovery: DiscoveryIndustry[] = industries.map((i) => ({
    id: i.id,
    name: i.name,
    shortName: i.shortName,
    slug: i.slug,
    icon: i.icon,
    headline: i.headline,
    products: productsForIndustry(i.id).map((p) => p.slug),
  }));
  const [feature, ...rest] = verticals;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#ece6de]">
        <div className="absolute inset-0">
          <Image
            src="/assets/products/renders/hero.webp"
            alt="Merova packaging across five verticals: corrugated boxes, printed cartons, a popcorn tub, a hot cup, film rolls and printed sachets"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[70%_50%] max-lg:opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#ece6de] from-20% via-[#ece6de]/85 via-45% to-transparent to-75%" aria-hidden />
        </div>
        <div className="container-x relative grid min-h-[34rem] items-center py-16 lg:min-h-[44rem] lg:py-24">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">Multi-material packaging partner</p>
            <h1 className="t-display mt-6">
              Packaging,
              <br />
              <span className="text-red-500">Perfected.</span>
            </h1>
            <p className="mt-6 font-display text-[1.35rem] font-medium leading-snug text-char-800 sm:text-2xl">Engineered to Protect. Designed to Perform.</p>
            <p className="lede mt-5 max-w-xl">
              Corrugated, paperboard, foodservice, flexible and custom packaging for ten industries — specified to your application, sampled before production and checked at every stage.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="#find-your-packaging" className="btn btn-primary">Find Your Packaging <ArrowRight className="h-4 w-4" aria-hidden /></Link>
              <Link href="/request-a-quote" className="btn btn-dark">Request a Quote</Link>
            </div>
          </div>
        </div>
        <span className="absolute bottom-3 right-4 rounded-sm bg-white/80 px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-char-600">Product visualisation</span>
      </section>

      {/* VERTICALS BAND */}
      <section className="surface-red relative">
        <ul className="container-x grid divide-y divide-cloud/25 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-5 lg:divide-x">
          {verticals.map((v, i) => (
            <li key={v.id} className={`${i === 0 ? "" : ""}`}>
              <Link href={`/${v.slug}`} className="group flex h-full items-center justify-between gap-3 px-1 py-5 transition-colors hover:bg-red-600 lg:flex-col lg:items-start lg:px-6 lg:py-7">
                <span>
                  <span className="block text-[0.7rem] font-bold uppercase tracking-[0.16em]">{String(i + 1).padStart(2, "0")} · {productsInVertical(v.id).length} formats</span>
                  <span className="mt-1.5 block font-display text-[1.08rem] font-semibold leading-snug">{v.name}</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* DISCOVERY ENGINE */}
      <section id="find-your-packaging" className="scroll-mt-24 bg-white py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Find your packaging"
            title={<>What are you looking <span className="text-red-500">to pack?</span></>}
            intro="Choose your industry to see the packaging formats Merova supplies for it — with specifications, product flyers and a direct route to a quotation."
          />
          <div className="mt-12">
            <IndustryDiscovery industries={discovery} cards={cards} initial="pharmaceutical" />
          </div>
        </div>
      </section>

      {/* VERTICALS — editorial grid */}
      <section className="py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Products"
            title="Five packaging verticals. One accountable partner."
            intro="Different materials solve different problems. Merova works across all five, so the right material is recommended for the job."
            action={<Link href="/products" className="btn btn-outline">Explore all products <ArrowRight className="h-4 w-4" aria-hidden /></Link>}
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <Link href={`/${feature.slug}`} className="group rise relative block overflow-hidden rounded-sm bg-paper-2 lg:row-span-2">
              <div className="zoom-img relative aspect-[3/4] sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[36rem]">
                <Image src={feature.image.src} alt={feature.image.alt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-char-950/90 via-char-950/50 to-transparent p-7 pt-24 text-cloud lg:p-9">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em]">{productsInVertical(feature.id).length} formats</p>
                <h3 className="mt-2 font-display text-[1.8rem] font-semibold !text-cloud">{feature.name}</h3>
                <p className="mt-2 max-w-md text-[0.95rem]">{feature.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 font-semibold">Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></span>
              </div>
            </Link>
            <div className="grid gap-5 sm:grid-cols-2">
              {rest.map((v) => (
                <Link key={v.id} href={`/${v.slug}`} className="group rise card flex flex-col overflow-hidden transition-shadow duration-500 hover:shadow-lift">
                  <div className="zoom-img relative aspect-[4/3] overflow-hidden bg-paper-2">
                    <Image src={v.image.src} alt={v.image.alt} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col border-t-[3px] border-red-500 p-5">
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-red-600">{productsInVertical(v.id).length} formats</p>
                    <h3 className="mt-1.5 font-display text-[1.12rem] font-semibold">{v.name}</h3>
                    <span className="link-arrow mt-auto pt-3 text-[0.88rem]">Explore <ArrowRight className="h-4 w-4" aria-hidden /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS — red surface */}
      <section className="surface-red-deep relative overflow-hidden py-20 lg:py-28">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/brand/merova-mark-cream.svg" alt="" aria-hidden="true" className="glyph-watermark -left-40 bottom-0 w-[54rem] max-w-none" />
        <div className="container-x relative grid gap-14 lg:grid-cols-[1fr_1.3fr]">
          <div className="rise">
            <p className="eyebrow eyebrow-light">How Merova works</p>
            <h2 className="t-2 mt-4">From your first brief to final delivery. Every stage has a purpose.</h2>
            <p className="mt-6 text-lg leading-relaxed">A structured process means fewer surprises: the specification is agreed, the sample is approved, and the production run is checked against both.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/process" className="btn btn-cloud">See the full process <ArrowRight className="h-4 w-4" aria-hidden /></Link>
              <Link href="/manufacturing" className="btn btn-ghost-light">Explore Manufacturing</Link>
            </div>
          </div>
          <ol className="grid gap-px overflow-hidden rounded-sm bg-cloud/20 sm:grid-cols-3">
            {PROCESS_STEPS.map((s, i) => (
              <li key={s.name} className="rise bg-red-600/40 p-5 backdrop-blur-sm transition-colors duration-300 hover:bg-red-700/60">
                <span className="font-display text-2xl font-semibold">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-3 font-display text-[1.02rem] font-semibold">{s.name}</p>
                <p className="mt-1 text-[0.86rem] leading-relaxed">{s.short}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* WHY MEROVA */}
      <section className="py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="Why Merova" title="Credibility built on process, not claims." intro="We publish what we do and how we do it. Figures, certifications and client references are shown only once they are verified." />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p) => (
              <li key={p.n} className="rise">
                <Link href={p.href} className="group block h-full bg-white p-7 transition-colors duration-300 hover:bg-red-500">
                  <span className="font-display text-[2.6rem] font-semibold leading-none text-red-500 transition-colors group-hover:text-cloud">{p.n}</span>
                  <h3 className="mt-6 font-display text-[1.12rem] font-semibold transition-colors group-hover:!text-cloud">{p.title}</h3>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-2 transition-colors group-hover:text-cloud">{p.text}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[0.88rem] font-semibold text-red-600 transition-colors group-hover:text-cloud">Learn more <ArrowRight className="h-4 w-4" aria-hidden /></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CUSTOM + SUSTAINABILITY */}
      <section className="pb-20 lg:pb-28">
        <div className="container-x grid gap-5 lg:grid-cols-2">
          <div className="rise grid overflow-hidden rounded-sm bg-char-900 text-cloud sm:grid-cols-[1fr_1fr]">
            <div className="p-8 lg:p-10">
              <p className="eyebrow eyebrow-light">Custom packaging</p>
              <h2 className="t-3 mt-4 !text-cloud">When nothing standard fits, we start from your product.</h2>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-char-100">Share your specifications, drawings, photographs or samples. Our team will assess your application and identify the right solution.</p>
              <Link href="/custom-requirement" className="btn btn-primary mt-7">Discuss Your Requirement <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </div>
            <div className="zoom-img relative min-h-[15rem]">
              <Image src="/assets/products/bespoke-dielines.webp" alt="Bespoke carton prototypes and dielines with measuring tools" fill sizes="(min-width:1024px) 25vw, 100vw" className="object-cover" />
            </div>
          </div>
          <div className="rise grid overflow-hidden rounded-sm border border-line bg-white sm:grid-cols-[1fr_1fr]">
            <div className="zoom-img relative min-h-[15rem]">
              <Image src="/assets/manufacturing/sustainability-board-detail.webp" alt="Close-up of corrugated board and kraft packaging offcuts" fill sizes="(min-width:1024px) 25vw, 100vw" className="object-cover" />
            </div>
            <div className="p-8 lg:p-10">
              <p className="eyebrow">Sustainability</p>
              <h2 className="t-3 mt-4">Better packaging decisions begin with better material choices.</h2>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-2">Right-sized structures, recycled-content board and certified-compostable options — every claim stated per material.</p>
              <Link href="/sustainability" className="link-arrow mt-6 text-[0.92rem]">Our approach <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* KNOWLEDGE + DOWNLOADS */}
      <section className="border-t border-line bg-white py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Packaging knowledge centre"
            title="Technical guidance for packaging buyers."
            intro="Practical guides on board, flutes, films, cups and procurement — written to help you specify with confidence."
            action={<Link href="/blog" className="btn btn-outline">All articles <ArrowRight className="h-4 w-4" aria-hidden /></Link>}
          />
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {latestArticles(3).map((a) => (
              <li key={a.slug} className="rise"><ArticleCard article={a} /></li>
            ))}
          </ul>
          <div className="rise surface-red relative mt-12 grid gap-4 overflow-hidden rounded-sm p-7 sm:grid-cols-[1.4fr_1fr_1fr] sm:items-center lg:p-9">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/brand/merova-mark-cream.svg" alt="" aria-hidden="true" className="glyph-watermark -right-10 -top-6 w-80" />
            <p className="relative font-display text-xl font-semibold">Download Merova documents</p>
            <TrackedLink href={DOWNLOADS.profile} event="profile_download" download className="btn btn-ghost-light relative"><FileText className="h-4 w-4" aria-hidden /> Company Profile</TrackedLink>
            <TrackedLink href={DOWNLOADS.catalogue} event="catalogue_download" download className="btn btn-cloud relative"><Download className="h-4 w-4" aria-hidden /> Product Catalogue</TrackedLink>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading eyebrow="FAQs" title="Common questions" intro={<>More answers in the <Link href="/resources/faqs" className="font-semibold text-red-600 underline underline-offset-4">FAQ centre</Link>.</>} />
          <FaqList faqs={HOME_FAQS} />
        </div>
      </section>

      <CtaBand
        title="Tell us what you pack. We'll recommend how to pack it."
        text="Share the product, how it ships and the quantities you need. You'll get a recommendation, a sample route and a quotation from the right Merova team."
      />
    </>
  );
}
