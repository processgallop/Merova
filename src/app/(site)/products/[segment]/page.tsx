import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Emblem } from "@/components/brand/Logo";
import { Btn, Crumbs, Faqs, SectionHead } from "@/components/ui/blocks";
import { Img } from "@/components/ui/Img";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/product/ProductCard";
import { Cta } from "@/components/sections/Sections";
import { JsonLd, breadcrumbLd, faqLd } from "@/components/seo/JsonLd";
import { findRedirect, getCatalog, getSegmentBySlug, getSegments, industryUrl, segmentUrl } from "@/lib/content";
import { meta } from "@/lib/meta";

export const revalidate = 3600;
type Props = { params: Promise<{ segment: string }> };

export async function generateStaticParams() {
  return (await getSegments()).map((s) => ({ segment: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const seg = await getSegmentBySlug((await params).segment);
  if (!seg) return {};
  return meta({ title: seg.name, description: seg.intro, path: segmentUrl(seg), seo: seg.seo, image: seg.image?.url });
}

export default async function SegmentPage({ params }: Props) {
  const { segment } = await params;
  const seg = await getSegmentBySlug(segment);
  if (!seg) {
    const r = await findRedirect(`/products/${segment}`);
    if (r) permanentRedirect(r.toPath);
    notFound();
  }
  const { cards, industries, links } = await getCatalog();
  const items = cards.filter((c) => c.segment.id === seg.id);
  const ids = new Set(items.map((c) => c.id));
  const relInd = industries.filter((i) => links.some((l) => l.industryId === i.id && ids.has(l.productId)) && !i.isCatchAll);
  const crumbs = [{ name: "Products", href: "/products" }, { name: seg.name, href: segmentUrl(seg) }];

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white" data-context={seg.name}>
        <Img image={seg.banner ?? seg.image} priority className="absolute inset-0 opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/20" />
        <Emblem className="pointer-events-none absolute -right-[5%] bottom-0 w-[55%] opacity-[0.08]" color="#fff" />
        <div className="wrap relative pb-20 pt-10">
          <Crumbs items={crumbs} light />
          <div className="mt-14 max-w-3xl">
            <p className="eyebrow light rise-in"><span className="index-num text-base">{seg.code}</span>Segment {seg.code} · {items.length} products</p>
            <h1 className="t-display rise-in mt-6 text-white" style={{ "--d": 1 } as React.CSSProperties}>{seg.name}</h1>
            <p className="t-lead rise-in mt-6 text-white/80" style={{ "--d": 2 } as React.CSSProperties}>{seg.headline}</p>
            <div className="rise-in mt-9 flex flex-wrap gap-3" style={{ "--d": 3 } as React.CSSProperties}>
              <Btn href="#range">View the range</Btn>
              <Btn href="/request-a-quote" variant="ghost-light">Request a Quote</Btn>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight border-b border-line">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <p className="t-lead lg:col-span-7">{seg.intro}</p>
          <ul className="flex flex-wrap content-start gap-2 lg:col-span-5">
            {seg.families.map((f) => <li key={f.code}><a href={`#fam-${f.code}`} className="chip"><span className="text-red">{f.code}</span>{f.name}</a></li>)}
          </ul>
        </div>
      </section>

      <section id="range" className="section">
        <div className="wrap space-y-16">
          {[...seg.families, ...(items.some((c) => !seg.families.some((f) => f.name === c.family)) ? [{ code: "+", name: "More products" }] : [])].map((f) => {
            const fam = f.code === "+" ? items.filter((c) => !seg.families.some((x) => x.name === c.family)) : items.filter((c) => c.family === f.name);
            if (!fam.length) return null;
            return (
              <div key={f.code} id={`fam-${f.code}`} style={{ scrollMarginTop: "calc(var(--header-h) + 20px)" }}>
                <div className="mb-6 flex items-baseline gap-4 border-b border-heading pb-3">
                  <span className="index-num text-2xl text-red">{f.code}</span>
                  <h2 className="font-display text-2xl font-bold">{f.name}</h2>
                  <span className="ml-auto text-sm text-muted">{fam.length}</span>
                </div>
                <div className="hairline-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {fam.map((c) => <ProductCard key={c.id} p={c} />)}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {seg.technologies.length ? (
        <section className="section surface-ink on-dark">
          <div className="wrap">
            <SectionHead eyebrow="Technologies & materials" title={`What we specify in ${seg.navName.toLowerCase()}.`} light />
            <div className="mt-12 grid gap-px bg-white/10 md:grid-cols-2 lg:grid-cols-3">
              {seg.technologies.map((t, i) => (
                <div key={t.name} className="bg-ink p-7" data-reveal style={{ "--d": i % 3 } as React.CSSProperties}>
                  <p className="index-num text-2xl text-red">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-4 font-display text-lg font-bold text-white">{t.name}</h3>
                  <p className="mt-2 text-[15px] text-white/70">{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {relInd.length ? (
        <section className="section-tight">
          <div className="wrap">
            <p className="eyebrow">Industries using {seg.navName.toLowerCase()}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {relInd.map((i) => <li key={i.id}><Link href={industryUrl(i)} className="chip"><Icon name={i.icon} className="size-4 text-red" />{i.shortName || i.name}</Link></li>)}
            </ul>
          </div>
        </section>
      ) : null}

      {seg.faqs.length ? (
        <section className="section border-t border-line">
          <div className="wrap grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4"><SectionHead eyebrow="FAQs" title={`${seg.navName} questions`} /></div>
            <div className="lg:col-span-8"><Faqs items={seg.faqs} /></div>
          </div>
        </section>
      ) : null}

      <section className="section-tight bg-red-tint">
        <div className="wrap flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="font-display text-2xl font-bold text-heading">Have a different packaging requirement?</p>
            <p className="mt-2 max-w-2xl">Share your specifications, drawings, photographs or samples and our team will assess your application.</p>
          </div>
          <Link href="/custom-requirement" className="btn btn-dark"><span>Discuss Your Custom Requirement</span><ArrowRight className="btn-arrow size-4" /></Link>
        </div>
      </section>
      <Cta data={{ variant: "red", heading: `Request a quote for ${seg.navName.toLowerCase()}.`, text: "Select one or several products — technical questions adapt to each.", primary: { label: "Request a Quote", href: "/request-a-quote" }, secondary: { label: "Speak With Our Team", href: "/contact" } }} />
      <JsonLd data={[breadcrumbLd(crumbs), ...(seg.faqs.length ? [faqLd(seg.faqs)] : [])]} />
    </>
  );
}
