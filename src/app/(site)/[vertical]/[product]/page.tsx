import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Download, MessageCircle } from "lucide-react";
import { Breadcrumbs, CtaBand, CustomRequirementBand, FaqList } from "@/components/ui/blocks";
import { Media } from "@/components/ui/Media";
import { ProductCard } from "@/components/product/ProductCard";
import { SpecLegend, SpecTable } from "@/components/product/SpecTable";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { IndustryIcon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/seo/JsonLd";
import { flyerUrl, getProduct, industryById, productUrl, products, quoteUrl, relatedProducts, verticalById } from "@/data/catalog";
import { toCard } from "@/data/cards";
import { absoluteUrl, site, whatsappHref } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ vertical: verticalById[p.vertical].slug, product: p.slug }));

type Props = { params: Promise<{ vertical: string; product: string }> };

function resolve(vertical: string, slug: string) {
  const p = getProduct(slug);
  return p && verticalById[p.vertical].slug === vertical ? p : undefined;
}

export async function generateMetadata({ params }: Props) {
  const { vertical, product } = await params;
  const p = resolve(vertical, product);
  if (!p) return {};
  return pageMetadata({
    title: p.seo.title ?? `${p.name} | ${verticalById[p.vertical].navName} Packaging | Merova Printpack`,
    description: p.seo.description ?? `${p.summary} Specifications, applications, FAQs and downloadable flyer. Request a quote from Merova Printpack.`.slice(0, 300),
    path: productUrl(p),
  });
}

const NAV = [
  ["overview", "Overview"],
  ["specifications", "Specifications"],
  ["customisation", "Printing & customisation"],
  ["quality", "Quality"],
  ["faqs", "FAQs"],
] as const;

export default async function ProductPage({ params }: Props) {
  const { vertical, product } = await params;
  const p = resolve(vertical, product);
  if (!p) notFound();
  const v = verticalById[p.vertical];
  const url = productUrl(p);
  const wa = whatsappHref(`Hello Merova Team, I am interested in ${p.name}. I would like to discuss my requirements.`);
  const related = relatedProducts(p);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.summary,
    image: absoluteUrl(p.image.src),
    url: absoluteUrl(url),
    category: v.name,
    brand: { "@type": "Brand", name: site.name },
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-y-0 left-0 w-1.5 bg-red-500" aria-hidden />
        <div className="container-x py-8 lg:py-14">
          <Breadcrumbs items={[{ name: "Products", href: "/products" }, { name: v.name, href: `/${v.slug}` }, { name: p.shortName ?? p.name, href: url }]} />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-14">
            <div className="reveal order-2 lg:order-1">
              <p className="eyebrow">{v.name}</p>
              <h1 className="t-1 mt-3">{p.name}</h1>
              <p className="mt-5 font-display text-xl font-medium leading-snug text-red-600">{p.headline}</p>
              <p className="lede mt-4">{p.summary}</p>
              <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
                <Link href={quoteUrl(p)} className="btn btn-primary">Request a Quote <ArrowRight className="h-4 w-4" aria-hidden /></Link>
                <TrackedLink href={flyerUrl(p)} download event="flyer_download" params={{ product: p.slug }} className="btn btn-navy">
                  <Download className="h-4 w-4" aria-hidden /> Download Product Flyer
                </TrackedLink>
                {wa ? (
                  <TrackedLink href={wa} target="_blank" rel="noopener" event="whatsapp_click" params={{ product: p.slug }} className="btn btn-outline">
                    <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp enquiry
                  </TrackedLink>
                ) : (
                  <Link href={`/contact?topic=sales&product=${p.slug}`} className="btn btn-outline">
                    <MessageCircle className="h-4 w-4" aria-hidden /> Speak With Our Team
                  </Link>
                )}
              </div>
              <p className="mt-4 text-[0.85rem] text-muted">
                Need something different? <Link href={`/custom-requirement?product=${p.slug}`} className="font-semibold text-char-800 underline underline-offset-2">Discuss a custom requirement</Link>
              </p>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="absolute -bottom-5 -right-5 left-12 top-12 hidden bg-red-500 lg:block" aria-hidden />
              <Media image={p.image} sizes="(min-width:1024px) 48vw, 100vw" priority className="relative rounded-sm" />
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-[4.5rem] z-30 hidden border-b border-line bg-paper/95 backdrop-blur lg:top-[5.25rem] md:block">
        <nav aria-label="On this page" className="container-x flex items-center gap-6 overflow-x-auto py-3 text-[0.88rem]">
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="nav-link whitespace-nowrap px-3 py-1 font-semibold text-ink-2 hover:text-red-600">{label}</a>
          ))}
          <Link href={quoteUrl(p)} className="btn btn-primary btn-sm ml-auto">Request a Quote</Link>
        </nav>
      </div>

      <section id="overview" className="scroll-mt-32 py-14 lg:py-20">
        <div className="container-x grid gap-12 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <h2 className="t-2">Product overview</h2>
            <div className="prose-merova mt-5">
              {p.overview.map((para) => <p key={para.slice(0, 24)}>{para}</p>)}
            </div>
          </div>
          <div className="grid gap-6 self-start rounded-sm border border-line border-t-[3px] border-t-red-500 bg-white p-7">
            <ListBlock title="Applications" items={p.applications} />
            <ListBlock title="Available formats" items={p.formats} />
            <ListBlock title="Material options" items={p.materials} />
          </div>
        </div>
      </section>

      <section id="specifications" className="scroll-mt-32 border-y border-line bg-white py-14 lg:py-20">
        <div className="container-x">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Technical specifications</p>
              <h2 className="t-2 mt-3">{p.name} specification</h2>
            </div>
            <TrackedLink href={flyerUrl(p)} download event="flyer_download" params={{ product: p.slug }} className="btn btn-outline btn-sm">
              <Download className="h-4 w-4" aria-hidden /> Specification flyer (PDF)
            </TrackedLink>
          </div>
          <div className="mt-8">
            <SpecTable rows={p.specs} caption={`${p.name} technical specification`} />
            <SpecLegend />
            <p className="mt-5 max-w-3xl text-[0.9rem] leading-relaxed text-ink-2">
              {p.specNote ?? "Dimensions, tolerances and material grades are confirmed in writing for your order at quotation and on the approved sample. Merova does not publish values that have not been confirmed for production."}
            </p>
          </div>
        </div>
      </section>

      <section id="customisation" className="scroll-mt-32 py-14 lg:py-20">
        <div className="container-x grid gap-6 md:grid-cols-2">
          <div className="rounded-sm border border-line bg-white p-6 lg:p-8">
            <h2 className="t-3">Printing & finishing</h2>
            <CheckList items={p.printing} />
          </div>
          <div className="rounded-sm border border-line bg-white p-6 lg:p-8">
            <h2 className="t-3">Customisation possibilities</h2>
            <CheckList items={p.customisation} />
          </div>
        </div>
      </section>

      <section id="quality" className="scroll-mt-32 border-y border-line bg-paper-2 py-16 lg:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow">Quality considerations</p>
            <h2 className="t-2 mt-3">What we check</h2>
            <p className="mt-4 leading-relaxed text-ink-2">Checks are made against the approved sample and specification. See how quality is built into every stage.</p>
            <Link href="/quality" className="link-arrow mt-4 text-[0.92rem]">Quality assurance <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
          <div>
            <CheckList items={p.quality} />
            <h3 className="mt-10 font-display text-[1.05rem] font-semibold text-char-950">Related industries</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {p.industries.map((id) => (
                <li key={id}>
                  <Link href={`/industries/${industryById[id].slug}`} className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-white px-3.5 py-1.5 text-[0.85rem] font-semibold text-char-900 hover:border-red-500">
                    <IndustryIcon name={industryById[id].icon} className="h-4 w-4" /> {industryById[id].name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="faqs" className="scroll-mt-32 py-14 lg:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="eyebrow">FAQs</p>
            <h2 className="t-2 mt-3">{p.shortName ?? p.name} questions</h2>
            <p className="mt-4 leading-relaxed text-ink-2">Can&apos;t find your answer? Ask Mira or speak with the team.</p>
          </div>
          <FaqList faqs={p.faqs} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-white py-14 lg:py-20">
          <div className="container-x">
            <h2 className="t-2">Related products</h2>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {related.map((r) => (
                <li key={r.slug}><ProductCard card={toCard(r)} compact /></li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CustomRequirementBand product={p.slug} />
      <CtaBand title={`Request a quote for ${p.name.toLowerCase()}`} text="The quote form is pre-filled with this product and asks only for the details that matter for it." primary={{ label: "Request a Quote", href: quoteUrl(p) }} />
      <JsonLd data={schema} />
    </>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-sans tabular-nums text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted">{title}</h3>
      <ul className="mt-2.5 grid gap-1.5 text-[0.93rem] text-ink-2">
        {items.map((i) => (
          <li key={i} className="flex gap-2.5"><span className="mt-[0.7em] h-0.5 w-2.5 shrink-0 bg-red-500" aria-hidden />{i}</li>
        ))}
      </ul>
    </div>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 grid gap-3">
      {items.map((i) => (
        <li key={i} className="flex gap-3 text-[0.95rem] leading-relaxed text-ink-2">
          <Check className="mt-1 h-4 w-4 shrink-0 text-red-500" aria-hidden /> {i}
        </li>
      ))}
    </ul>
  );
}
