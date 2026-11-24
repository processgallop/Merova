import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ClipboardCheck, Download, FileText, Layers, PenTool, ShieldCheck } from "lucide-react";
import { IndustryDiscovery, type DiscoveryIndustry } from "@/components/industry/IndustryDiscovery";
import { CtaBand, FaqList, SectionHeading } from "@/components/ui/blocks";
import { Media } from "@/components/ui/Media";
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

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="container-x grid gap-10 pb-14 pt-10 lg:grid-cols-[1.08fr_1fr] lg:items-center lg:gap-14 lg:pb-20 lg:pt-16">
          <div className="reveal">
            <p className="eyebrow">Multi-material packaging solutions partner</p>
            <h1 className="t-display mt-4">
              Packaging,
              <br />
              <span className="text-signal">Perfected.</span>
            </h1>
            <p className="mt-5 font-display text-xl font-medium text-navy-800 sm:text-2xl">Engineered to Protect. Designed to Perform.</p>
            <p className="lede mt-5 max-w-xl">
              Corrugated, paperboard, foodservice, flexible and custom packaging for ten industries — specified to your application, sampled before production and checked at every stage.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="#find-your-packaging" className="btn btn-navy">Find Your Packaging <ArrowRight className="h-4 w-4" aria-hidden /></Link>
              <Link href="/request-a-quote" className="btn btn-primary">Request a Quote</Link>
            </div>
            <ul className="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-6 text-[0.88rem] text-ink-2 sm:grid-cols-3">
              {["5 packaging verticals", `${products.length} product formats`, "10 industries", "Custom development", "Sample before production", "Product flyers to download"].map((t) => (
                <li key={t} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />{t}</li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md lg:aspect-[5/5.2]">
              <Image
                src="/assets/manufacturing/hero-factory-packaging.webp"
                alt="Corrugated cartons, paper bags and pouches on a packaging production floor"
                fill
                priority
                sizes="(min-width:1024px) 46vw, 100vw"
                className="object-cover"
              />
              <span className="absolute bottom-2 left-2 rounded-sm bg-white/85 px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.08em] text-muted">Representative image</span>
            </div>
            <div className="card absolute -bottom-6 left-4 right-4 hidden p-4 shadow-lift sm:block lg:-left-10 lg:right-auto lg:w-[21rem]">
              <p className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-muted">Five verticals, one partner</p>
              <ul className="mt-2 grid gap-1.5">
                {verticals.map((v) => (
                  <li key={v.id}>
                    <Link href={`/${v.slug}`} className="flex items-center justify-between text-[0.9rem] font-semibold text-navy-900 hover:text-signal-600">
                      {v.name} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DISCOVERY ENGINE */}
      <section id="find-your-packaging" className="scroll-mt-20 bg-white py-16 lg:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Find your packaging"
            title="What are you looking to pack?"
            intro="Choose your industry to see the packaging formats Merova supplies for it — with specifications, product flyers and a direct route to a quotation."
          />
          <div className="mt-10">
            <IndustryDiscovery industries={discovery} cards={cards} initial="pharmaceutical" />
          </div>
        </div>
      </section>

      {/* VERTICALS */}
      <section className="py-16 lg:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Products"
            title="Five packaging verticals. One accountable partner."
            intro="Different materials solve different problems. Merova works across all five, so the right material is recommended for the job — not the one a single-process supplier happens to make."
            action={<Link href="/products" className="btn btn-outline">Explore all products</Link>}
          />
          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {verticals.map((v) => (
              <li key={v.id}>
                <Link href={`/${v.slug}`} className="card group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-card">
                  <Media image={v.image} sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw" caption={false} aspect="aspect-[16/9]" />
                  <div className="flex flex-1 flex-col p-6">
                    <p className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-muted">{productsInVertical(v.id).length} formats</p>
                    <h3 className="mt-1.5 font-display text-xl font-semibold text-navy-950 group-hover:text-signal-600">{v.name}</h3>
                    <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-2">{v.description}</p>
                    <span className="link-arrow mt-auto pt-5 text-[0.9rem]">Explore {v.navName} <ArrowRight className="h-4 w-4" aria-hidden /></span>
                  </div>
                </Link>
              </li>
            ))}
            <li>
              <div className="flex h-full flex-col justify-between rounded-md bg-navy-900 p-6 text-white">
                <div>
                  <p className="eyebrow eyebrow-light">Product flyers</p>
                  <p className="mt-3 font-display text-xl font-semibold">Every product has a downloadable technical flyer.</p>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-white/70">Share specifications internally before you request a quote.</p>
                </div>
                <div className="mt-6 flex flex-col gap-2">
                  <TrackedLink href={DOWNLOADS.catalogue} event="catalogue_download" download className="btn btn-primary btn-sm"><Download className="h-4 w-4" aria-hidden /> Download Catalogue</TrackedLink>
                  <Link href="/resources/downloads" className="btn btn-ghost-light btn-sm">Downloads Centre</Link>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* APPROACH */}
      <section className="border-y border-line bg-paper-2 py-16 lg:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeading
              eyebrow="How Merova works"
              title="From your first brief to final delivery. Every stage has a purpose."
              intro="A structured process means fewer surprises: the specification is agreed, the sample is approved, and the production run is checked against both."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/process" className="btn btn-navy">See the full process</Link>
              <Link href="/manufacturing" className="btn btn-outline">Explore Manufacturing</Link>
            </div>
          </div>
          <ol className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-3">
            {PROCESS_STEPS.map((s, i) => (
              <li key={s.name} className="bg-white p-5">
                <span className="font-mono text-[0.72rem] text-signal-600">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-2 font-display text-[1.02rem] font-semibold text-navy-950">{s.name}</p>
                <p className="mt-1 text-[0.85rem] leading-relaxed text-ink-2">{s.short}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PILLARS */}
      <section className="py-16 lg:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Why Merova" title="Credibility built on process, not claims." intro="We publish what we do and how we do it. Figures, certifications and client references are shown only once they are verified." />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Layers, title: "Multi-material expertise", text: "Corrugated, paperboard, foodservice board and flexible films — the material is chosen for the application.", href: "/products" },
              { icon: PenTool, title: "Custom development", text: "Structures developed from your drawings, photographs or samples, and proven on a sample before production.", href: "/custom-packaging" },
              { icon: ShieldCheck, title: "Quality at every stage", text: "Incoming material, in-process and final checks against an agreed specification.", href: "/quality" },
              { icon: ClipboardCheck, title: "Clear technical information", text: "Specifications, flyers and FAQs for every product, with unconfirmed values clearly marked.", href: "/resources/downloads" },
            ].map(({ icon: I, title, text, href }) => (
              <li key={title}>
                <Link href={href} className="group block h-full rounded-md border border-line bg-white p-6 transition-colors hover:border-navy-800">
                  <I className="h-7 w-7 text-signal" strokeWidth={1.5} aria-hidden />
                  <h3 className="mt-5 font-display text-[1.08rem] font-semibold text-navy-950">{title}</h3>
                  <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-2">{text}</p>
                  <span className="link-arrow mt-4 text-[0.88rem]">Learn more <ArrowRight className="h-4 w-4" aria-hidden /></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CUSTOM + SUSTAINABILITY */}
      <section className="pb-16 lg:pb-24">
        <div className="container-x grid gap-5 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-md bg-navy-900 p-8 text-white lg:p-10">
            <p className="eyebrow eyebrow-light">Custom packaging</p>
            <h2 className="t-2 mt-3 !text-white">When nothing standard fits, we start from your product.</h2>
            <p className="mt-4 max-w-lg leading-relaxed text-white/75">
              Share your specifications, drawings, photographs or sample requirements. Our team will assess your application and help identify the appropriate packaging solution.
            </p>
            <Link href="/custom-requirement" className="btn btn-primary mt-8">Discuss Your Custom Requirement <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
          <div className="grid overflow-hidden rounded-md border border-line bg-white sm:grid-cols-[1fr_1.1fr]">
            <div className="relative min-h-[14rem]">
              <Image src="/assets/manufacturing/sustainability-board-detail.webp" alt="Close-up of corrugated board and kraft packaging offcuts" fill sizes="(min-width:1024px) 22vw, 100vw" className="object-cover" />
            </div>
            <div className="p-8">
              <p className="eyebrow">Sustainability</p>
              <h2 className="t-3 mt-3">Better packaging decisions begin with better material choices.</h2>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-2">
                Right-sized structures, recycled-content board and certified-compostable options — with every claim stated per material, never as a blanket promise.
              </p>
              <Link href="/sustainability" className="link-arrow mt-5 text-[0.9rem]">Our sustainability approach <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* RESOURCES */}
      <section className="border-t border-line bg-white py-16 lg:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Packaging knowledge centre"
            title="Technical guidance for packaging buyers."
            intro="Practical guides on board, flutes, films, cups and procurement, written to help you specify packaging with confidence."
            action={<Link href="/blog" className="btn btn-outline">All articles</Link>}
          />
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {latestArticles(3).map((a) => (
              <li key={a.slug}><ArticleCard article={a} /></li>
            ))}
          </ul>
          <div className="mt-10 grid gap-3 rounded-md border border-line bg-paper p-6 sm:grid-cols-3 sm:items-center">
            <p className="font-display text-lg font-semibold text-navy-950 sm:col-span-1">Download Merova documents</p>
            <TrackedLink href={DOWNLOADS.profile} event="profile_download" download className="btn btn-outline"><FileText className="h-4 w-4" aria-hidden /> Company Profile (PDF)</TrackedLink>
            <TrackedLink href={DOWNLOADS.catalogue} event="catalogue_download" download className="btn btn-navy"><Download className="h-4 w-4" aria-hidden /> Product Catalogue (PDF)</TrackedLink>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading eyebrow="FAQs" title="Common questions" intro={<>More answers in the <Link href="/resources/faqs" className="underline underline-offset-2">FAQ centre</Link>.</>} />
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
