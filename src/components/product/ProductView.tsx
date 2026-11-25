import Link from "next/link";
import { ArrowRight, Download, Info, MessageCircle } from "lucide-react";
import { AVAILABILITY_LABEL } from "@/db/types";
import { Btn, Crumbs, Faqs, List, Pill, SectionHead } from "@/components/ui/blocks";
import { Img } from "@/components/ui/Img";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/product/ProductCard";
import { AddToEnquiry } from "@/components/product/AddToEnquiry";
import { Cta } from "@/components/sections/Sections";
import { JsonLd, breadcrumbLd, faqLd } from "@/components/seo/JsonLd";
import { flyerHref, getSiteSettings, industryUrl, productUrl, segmentUrl, type Industry, type Product, type ProductCard as CardT, type Segment } from "@/lib/content";
import { absoluteUrl, whatsappHref } from "@/lib/site";


const STATUS_NOTE = { option: "Option we specify", reference: "Industry reference", confirm: "Confirmed at quotation" } as const;

export async function ProductView({ r }: { r: { product: Product; segment: Segment; related: CardT[]; industries: Industry[] } }) {
  const { product: p, segment: seg, related, industries } = r;
  const site = await getSiteSettings();
  const url = productUrl(seg.slug, p);
  const wa = whatsappHref(site.whatsapp, `Hello Merova Team, I'm interested in ${p.name}. I would like to discuss my requirement.`);
  const crumbs = [{ name: "Products", href: "/products" }, { name: seg.name, href: segmentUrl(seg) }, { name: p.shortName || p.name, href: url }];
  const quote = `/request-a-quote?products=${p.slug}`;
  const sections = [
    { id: "overview", label: "Overview" },
    { id: "specifications", label: "Specifications" },
    { id: "customisation", label: "Printing & customisation" },
    { id: "industries", label: "Industries" },
    ...(p.faqs.length ? [{ id: "faqs", label: "FAQs" }] : []),
  ];

  return (
    <>
      <section className="border-b border-line" data-context={p.name}>
        <div className="wrap pt-8">
          <Crumbs items={crumbs} />
        </div>
        <div className="wrap grid gap-10 pb-14 pt-8 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6 lg:order-2">
            <div className="relative">
              <div className="absolute -right-3 -top-3 h-1/2 w-1/2 bg-red" aria-hidden />
              <Img image={p.images[0]} priority sizes="(min-width:1024px) 50vw, 100vw" className="relative aspect-[4/3] overflow-hidden bg-surface" />
            </div>
            <p className="media-caption mt-3">{p.images[0]?.kind === "render" ? "Product visualisation of the format — not a photograph of a specific Merova order." : p.images[0]?.kind === "representative" ? "Representative image." : ""}</p>
            {p.images.length > 1 ? (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {p.images.slice(1, 5).map((im, i) => <Img key={i} image={im} className="aspect-square overflow-hidden bg-surface" sizes="120px" />)}
              </div>
            ) : null}
          </div>
          <div className="lg:col-span-6 lg:order-1 lg:pt-6">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="ink">{seg.code} · {seg.navName}</Pill>
              <Pill>{p.family}</Pill>
              <span className="text-xs text-muted">ID {p.code}</span>
            </div>
            <h1 className="t-display rise-in mt-6">{p.name}</h1>
            <p className="t-lead rise-in mt-5 text-heading" style={{ "--d": 1 } as React.CSSProperties}>{p.headline}</p>
            <p className="rise-in mt-4" style={{ "--d": 2 } as React.CSSProperties}>{p.summary}</p>
            <p className="mt-5 flex items-start gap-2 text-sm text-muted"><Info className="mt-0.5 size-4 flex-none text-red" />{AVAILABILITY_LABEL[p.availability]}</p>
            <div className="rise-in mt-8 flex flex-wrap gap-3" style={{ "--d": 3 } as React.CSSProperties}>
              <Btn href={quote}>Request a Quote</Btn>
              {flyerHref(p) ? <a href={flyerHref(p)!} className="btn btn-outline" data-track-download={`flyer:${p.slug}`}><Download className="size-4" /><span>Download Flyer</span></a> : null}
              <AddToEnquiry slug={p.slug} name={p.shortName || p.name} segment={seg.navName} image={p.images[0]?.url} />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              {wa ? <a href={wa} target="_blank" rel="noopener noreferrer" className="link"><MessageCircle className="size-4 text-red" />WhatsApp enquiry</a> : <Link href="/contact" className="link"><MessageCircle className="size-4 text-red" />Speak with our team</Link>}
              <Link href={`/custom-requirement?products=${p.slug}`} className="link">Need something different? <ArrowRight className="size-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      <nav aria-label="On this page" className="sticky top-[var(--header-h)] z-30 border-b border-line bg-cloud/95 backdrop-blur">
        <div className="wrap flex items-center gap-4">
          <ul className="scrollbar-none flex flex-1 gap-1 overflow-x-auto py-2">
            {sections.map((s) => <li key={s.id}><a href={`#${s.id}`} className="flex h-10 items-center whitespace-nowrap px-3 text-sm font-semibold text-heading hover:text-red">{s.label}</a></li>)}
          </ul>
          <Link href={quote} className="btn btn-sm hidden md:inline-flex"><span>Quote</span><ArrowRight className="btn-arrow size-4" /></Link>
        </div>
      </nav>

      <section id="overview" className="section">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow">Overview</p>
            <div className="prose-m mt-6 text-lg">{p.overview.map((o, i) => <p key={i}>{o}</p>)}</div>
          </div>
          <div className="grid gap-px self-start bg-line lg:col-span-5">
            {[
              { t: "Applications", items: p.applications },
              { t: "Available formats", items: p.formats },
              { t: "Material options", items: p.materials },
            ].filter((b) => b.items.length).map((b) => (
              <div key={b.t} className="bg-cloud py-6 pr-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-red">{b.t}</p>
                <List items={b.items} className="mt-4 text-[15px]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="specifications" className="section surface-paper">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead eyebrow="Technical specifications" title="Specified to your application." intro={p.specNote || "Values marked “Confirmed at quotation” are agreed for each order and approved on a sample — they are not published guarantees."} />
            <ul className="mt-8 space-y-2 text-xs">
              {Object.entries(STATUS_NOTE).map(([k, v]) => <li key={k} className="flex items-center gap-2"><StatusDot s={k} />{v}</li>)}
            </ul>
            {p.moq ? <p className="mt-6 text-sm"><strong className="text-heading">Minimum order:</strong> {p.moq}</p> : null}
            {p.leadTime ? <p className="mt-2 text-sm"><strong className="text-heading">Lead time:</strong> {p.leadTime}</p> : null}
          </div>
          <div className="lg:col-span-8">
            <table className="w-full border-collapse bg-surface text-[15px]">
              <caption className="sr-only">{p.name} specifications</caption>
              <tbody>
                {p.specs.map((s, i) => (
                  <tr key={i} className="border-b border-line align-top last:border-0">
                    <th scope="row" className="w-2/5 px-5 py-4 text-left font-semibold text-heading">{s.label}</th>
                    <td className="px-5 py-4">
                      <span className="flex items-start gap-2.5"><StatusDot s={s.status ?? "option"} /><span>{s.value}</span></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="customisation" className="section">
        <div className="wrap grid gap-px bg-line md:grid-cols-3">
          {[
            { t: "Printing & finishing", items: p.printing },
            { t: "Customisation", items: p.customisation },
            { t: "Quality considerations", items: p.quality },
          ].map((b, i) => (
            <div key={b.t} className="bg-cloud p-7" data-reveal style={{ "--d": i } as React.CSSProperties}>
              <p className="index-num text-3xl text-line">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="mt-4 font-display text-xl font-bold">{b.t}</h2>
              <List items={b.items} className="mt-5 text-[15px]" />
            </div>
          ))}
        </div>
      </section>

      <section id="industries" className="section-tight border-y border-line">
        <div className="wrap grid gap-6 lg:grid-cols-12 lg:items-center">
          <p className="eyebrow lg:col-span-3">Related industries</p>
          <ul className="flex flex-wrap gap-2 lg:col-span-9">
            {industries.map((i) => <li key={i.id}><Link href={industryUrl(i)} className="chip"><Icon name={i.icon} className="size-4 text-red" />{i.name}</Link></li>)}
          </ul>
        </div>
      </section>

      {p.faqs.length ? (
        <section id="faqs" className="section">
          <div className="wrap grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4"><SectionHead eyebrow="FAQs" title={`About ${p.shortName || p.name}`} /></div>
            <div className="lg:col-span-8"><Faqs items={p.faqs} /></div>
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="section surface-paper">
          <div className="wrap">
            <SectionHead eyebrow="Related products" title="Often specified together." />
            <div className="hairline-grid mt-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {related.slice(0, 4).map((c) => <ProductCard key={c.id} p={c} compact />)}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-tight bg-red-tint">
        <div className="wrap flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="font-display text-2xl font-bold text-heading">Have a different packaging requirement?</p>
            <p className="mt-2 max-w-2xl">Share drawings, photographs or a sample — the team will assess your application.</p>
          </div>
          <Link href={`/custom-requirement?products=${p.slug}`} className="btn btn-dark"><span>Discuss Your Custom Requirement</span><ArrowRight className="btn-arrow size-4" /></Link>
        </div>
      </section>
      <Cta data={{ variant: "red", heading: `Request a quote for ${p.shortName || p.name}.`, text: "The form asks only the technical questions that matter for this product.", primary: { label: "Request a Quote", href: quote }, secondary: flyerHref(p) ? { label: "Download Flyer", href: flyerHref(p)! } : { label: "Speak With Our Team", href: "/contact" } }} />
      <JsonLd
        data={[
          breadcrumbLd(crumbs),
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.name,
            description: p.summary,
            sku: p.code,
            category: `${seg.name} > ${p.family}`,
            image: p.images.map((im) => absoluteUrl(im.url)),
            brand: { "@type": "Brand", name: "Merova Printpack" },
            url: absoluteUrl(url),
          },
          ...(p.faqs.length ? [faqLd(p.faqs)] : []),
        ]}
      />
    </>
  );
}

function StatusDot({ s }: { s: string }) {
  const cls = s === "confirm" ? "border-2 border-red bg-transparent" : s === "reference" ? "bg-[var(--c-muted)]" : "bg-red";
  return <span className={`mt-[0.45em] inline-block size-2.5 flex-none rounded-full ${cls}`} aria-label={STATUS_NOTE[s as keyof typeof STATUS_NOTE]} />;
}
