import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Download, FileText, Info, MessageCircle } from "lucide-react";
import { Breadcrumbs, CtaBand, FaqList, ProductTile, Render, SectionHead } from "@/components/ui/blocks";
import { ProductActions } from "@/components/product/ProductActions";
import { WhatsAppContext } from "@/components/layout/Dock";
import { JsonLd } from "@/components/seo/JsonLd";
import { categoryById, industries, operatorsFor, productBySlug, products, relatedProducts } from "@/data/catalog";
import { articlesForProduct } from "@/content/blog";
import { absoluteUrl, productWaMessage, site, whatsappHref } from "@/lib/site";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ category: categoryById[p.category].slug, product: p.slug }));
type Props = { params: Promise<{ category: string; product: string }> };

const resolve = async ({ params }: Props) => { const { category, product } = await params; const p = productBySlug(product); return p && categoryById[p.category].slug === category ? p : undefined; };

export async function generateMetadata(props: Props) {
  const p = await resolve(props);
  if (!p) return {};
  const c = categoryById[p.category];
  return pageMetadata({ title: `${p.name} | ${c.short} Packaging | Merova Printpack`.slice(0, 70), description: `${p.description} Variants: ${p.variants.slice(0, 3).join(", ")}. Specifications, flyer and quote.`.slice(0, 158), path: p.url, image: p.image });
}

export default async function ProductPage(props: Props) {
  const p = await resolve(props);
  if (!p) notFound();
  const c = categoryById[p.category];
  const ops = operatorsFor(p.id);
  const related = relatedProducts(p);
  const reads = articlesForProduct(p.id);
  const byIndustry = industries.map((i) => ({ i, ops: [...ops.primary, ...ops.secondary].filter((o) => o.industry === i.id) })).filter((x) => x.ops.length);
  const wa = productWaMessage(p.name, c.name, p.url);
  return (
    <>
      <WhatsAppContext message={wa} label={p.name} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description, image: absoluteUrl(p.image), url: absoluteUrl(p.url), category: `${c.name} > ${p.subcategory}`, brand: { "@type": "Brand", name: site.name }, sku: p.id }} />
      {p.faqs.length > 0 && <JsonLd data={faqJsonLd(p.faqs)} />}

      {/* HERO */}
      <section className="bg-cloud">
        <div className="wrap wrap-wide pt-8">
          <Breadcrumbs items={[{ name: "Products", href: "/products/" }, { name: c.name, href: `/products/${c.slug}/` }, { name: p.name, href: p.url }]} />
        </div>
        <div className="wrap wrap-wide grid gap-10 pb-16 pt-8 lg:grid-cols-[1.08fr_1fr] lg:gap-14 lg:pb-24">
          <div className="reveal-img lg:sticky lg:top-24 lg:self-start">
            <Render src={p.image} alt={p.imageAlt} priority className="rounded-[32px]" sizes="(min-width: 1024px) 52vw, 100vw" />
            <div className="mt-3 flex items-center gap-2 text-xs text-stone"><Info className="h-3.5 w-3.5" /> Representative 3D render with a fictitious sample brand. Your print, size and finish are specified at quotation.</div>
          </div>
          <div className="rise">
            <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-stone" style={{ ["--i" as string]: 0 }}><span className="mat-dot" style={{ ["--mat" as string]: c.accent }} />{c.short} · {p.subcategory}</p>
            <h1 className="h1 mt-4" style={{ ["--i" as string]: 1 }}>{p.name}</h1>
            <p className="mt-5 font-display text-[22px] font-medium leading-snug tracking-tight text-red" style={{ ["--i" as string]: 2 }}>{p.headline}</p>
            <p className="lede mt-4" style={{ ["--i" as string]: 3 }}>{p.description}</p>
            {p.status !== 1 && <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-warn-bg px-3 py-1.5 text-xs font-semibold text-warn" style={{ ["--i" as string]: 3 }}>{p.status === 2 ? "Available subject to confirmation" : "New to the range: availability confirmed at enquiry"}</p>}
            <div className="mt-8" style={{ ["--i" as string]: 4 }}><ProductActions id={p.id} name={p.name} variants={p.variants} flyer={p.flyer} /></div>
            <a href={whatsappHref(wa)} target="_blank" rel="noopener" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1a7f46] hover:underline" style={{ ["--i" as string]: 5 }}><MessageCircle className="h-4 w-4" /> Ask about {p.name} on WhatsApp</a>
            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-line bg-line text-sm" style={{ ["--i" as string]: 6 }}>
              <div className="bg-white p-4"><dt className="text-stone">Material family</dt><dd className="mt-1 font-semibold">{c.name}</dd></div>
              <div className="bg-white p-4"><dt className="text-stone">Formats</dt><dd className="mt-1 font-semibold tnum">{p.variants.length} variants</dd></div>
              <div className="col-span-2 bg-white p-4"><dt className="text-stone">You specify</dt><dd className="mt-1 font-semibold">{p.parameters.join(" · ")}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      {/* OVERVIEW + VARIANTS */}
      <section className="section-tight border-t border-line">
        <div className="wrap wrap-wide grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div className="reveal">
            <p className="eyebrow">Overview</p>
            <h2 className="h2 mt-4">What it is and where it&apos;s used.</h2>
            {p.overview.map((t) => <p key={t} className="body mt-5 text-[17px]">{t}</p>)}
            <p className="body mt-5 text-[17px]"><strong className="text-ink">Typical applications:</strong> {p.applications}.</p>
          </div>
          <div className="reveal" style={{ ["--i" as string]: 1 }}>
            <p className="eyebrow">Available variants</p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">{p.variants.map((v) => <li key={v} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4 text-[15px]"><Check className="mt-0.5 h-4 w-4 flex-none text-red" />{v}</li>)}</ul>
            <p className="eyebrow mt-10">Materials &amp; construction</p>
            <ul className="mt-4 flex flex-wrap gap-2">{p.materials.map((m) => <li key={m} className="chip">{m}</li>)}</ul>
          </div>
        </div>
      </section>

      {/* SPECS + CUSTOMISATION */}
      <section className="section-tight bg-sand" id="specifications">
        <div className="wrap wrap-wide grid gap-8 lg:grid-cols-[1.25fr_1fr]">
          <div className="reveal rounded-[28px] bg-white p-6 lg:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="h3">Technical parameters</h2><span className="badge badge-sample">Indicative values</span></div>
            <table className="table-spec mt-6">
              <tbody>
                {p.specs.map((s) => <tr key={s.label}><th scope="row">{s.label}</th><td>{s.value}{s.kind === "option" && <span className="ml-2 text-xs text-stone">(option)</span>}</td></tr>)}
                <tr><th scope="row">Configurable</th><td>{p.parameters.join("; ")}</td></tr>
              </tbody>
            </table>
            <p className="mt-6 flex gap-2 rounded-2xl bg-cloud p-4 text-[13.5px] leading-relaxed text-stone"><Info className="mt-0.5 h-4 w-4 flex-none" />Indicative values are typical ranges for this format and are confirmed for your order at quotation. Merova does not publish prices; every requirement is quoted.</p>
          </div>
          <div className="grid content-start gap-6">
            <div className="reveal rounded-[28px] bg-white p-6 lg:p-8" style={{ ["--i" as string]: 1 }}>
              <h2 className="h3">Printing &amp; customisation</h2>
              <ul className="mt-5 grid gap-3">{p.customisation.map((t) => <li key={t} className="flex gap-3 text-[15px]"><span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-red-50 text-red"><Check className="h-3 w-3" /></span>{t}</li>)}</ul>
            </div>
            <div className="reveal rounded-[28px] bg-graphite p-6 text-white lg:p-8" style={{ ["--i" as string]: 2 }}>
              <h2 className="h3 text-white">Quality checks</h2>
              <ul className="mt-5 grid gap-3 text-[15px] text-[#cfc7c0]">{p.quality.map((t) => <li key={t} className="flex gap-3"><Check className="mt-1 h-4 w-4 flex-none text-[#ff8c80]" />{t}</li>)}</ul>
              <Link href="/about/quality/" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#ff8c80]">Quality assurance <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      {byIndustry.length > 0 && (
        <section className="section-tight">
          <div className="wrap wrap-wide">
            <SectionHead eyebrow="Industries & operators" title={`Who uses ${p.name.toLowerCase()}.`} />
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {byIndustry.map(({ i, ops: os }, k) => (
                <div key={i.id} className="reveal rounded-[24px] border border-line bg-white p-6" style={{ ["--i" as string]: k }}>
                  <Link href={i.url} className="h4 hover:text-red">{i.name}</Link>
                  <ul className="mt-4 flex flex-wrap gap-2">{os.map((o) => <li key={o.id}><Link href={o.url} className={`chip ${ops.primary.includes(o) ? "!border-red !text-red" : ""}`}>{o.name}</Link></li>)}</ul>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-stone">Red outline: a core product for that business. Grey: optional.</p>
          </div>
        </section>
      )}

      {/* RELATED */}
      {related.length > 0 && (
        <section className="section-tight bg-sand">
          <div className="wrap wrap-wide">
            <SectionHead eyebrow="Related products" title="Often specified together." action={<Link href={`/products/${c.slug}/`} className="link-arrow">All {c.short} <ArrowRight className="h-4 w-4" /></Link>} />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{related.slice(0, 4).map((r) => <ProductTile key={r.id} p={r} showCategory />)}</div>
          </div>
        </section>
      )}

      {/* FAQ + FLYER */}
      <section className="section-tight">
        <div className="wrap wrap-wide grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="eyebrow">FAQs</p>
            <h2 className="h2 mt-4">{p.name}: questions buyers ask.</h2>
            <FaqList faqs={p.faqs} className="mt-8" />
          </div>
          <div className="grid content-start gap-4">
            <a href={p.flyer} download className="tile tile-red reveal p-8">
              <FileText className="h-8 w-8" />
              <h3 className="mt-10 font-display text-2xl font-semibold">{p.name}: one-page flyer</h3>
              <p className="mt-2 text-white/85">Variants, configurable parameters, applications and a QR link back to this page. A4 PDF.</p>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold"><Download className="h-4 w-4" /> Download flyer</span>
            </a>
            {reads.map((a) => <Link key={a.slug} href={a.url} className="tile reveal p-6"><p className="eyebrow eyebrow-muted">Guide</p><h3 className="mt-2 font-display text-lg font-semibold leading-snug">{a.title}</h3><span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-red">Read <ArrowRight className="tile-arrow h-4 w-4" /></span></Link>)}
          </div>
        </div>
      </section>

      <CtaBand title={`Request a quote for ${p.name.toLowerCase()}.`} text="Tell us size, quantity and print. Add other products to the same enquiry if you need them." primary={{ label: "Request a custom quote", href: `/request-a-quote/?add=${p.id}` }} waMessage={wa} />
    </>
  );
}
