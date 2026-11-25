import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Emblem } from "@/components/brand/Logo";
import { Btn, Crumbs, Faqs, List, SectionHead } from "@/components/ui/blocks";
import { Img } from "@/components/ui/Img";
import { Icon } from "@/components/ui/Icon";
import { Discovery } from "@/components/industry/Discovery";
import { Cta } from "@/components/sections/Sections";
import { JsonLd, breadcrumbLd, faqLd } from "@/components/seo/JsonLd";
import { findRedirect, getIndustries, getIndustryBySlug, getPosts, industryUrl, postUrl } from "@/lib/content";
import { getDiscoveryData } from "@/lib/discovery";
import { meta } from "@/lib/meta";

export const revalidate = 3600;
type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getIndustries()).map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props) {
  const r = await getIndustryBySlug((await params).slug);
  if (!r) return {};
  return meta({ title: `${r.industry.name} Packaging`, description: r.industry.intro, path: industryUrl(r.industry), seo: r.industry.seo, image: (r.industry.banner ?? r.industry.image)?.url });
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const r = await getIndustryBySlug(slug);
  if (!r) {
    const red = await findRedirect(`/industries/${slug}`);
    if (red) permanentRedirect(red.toPath);
    notFound();
  }
  const { industry: ind, products, sector } = r;
  const [data, posts] = await Promise.all([getDiscoveryData(), getPosts()]);
  const segCount = new Set(products.map((p) => p.card.segment.id)).size;
  const crumbs = [{ name: "Industries", href: "/industries" }, { name: ind.name, href: industryUrl(ind) }];
  const words = ind.name.toLowerCase().split(/[\s&,]+/).filter((w) => w.length > 3);
  const reading = posts.filter((p) => words.some((w) => `${p.title} ${p.excerpt}`.toLowerCase().includes(w.slice(0, 6)))).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white" data-context={`packaging for ${ind.name}`}>
        <Img image={ind.banner ?? ind.image} priority className="absolute inset-0 opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,var(--c-ink)_30%,color-mix(in_oklab,var(--c-ink)_55%,transparent)_65%,color-mix(in_oklab,var(--c-red)_50%,transparent))]" />
        <Emblem className="pointer-events-none absolute -right-[5%] -bottom-[10%] w-[50%] opacity-[0.1]" color="#fff" />
        <div className="wrap relative pb-20 pt-10">
          <Crumbs items={crumbs} light />
          <div className="mt-14 max-w-3xl">
            <p className="eyebrow light rise-in"><Icon name={ind.icon} className="size-4" />{sector?.name ?? "Industry"}</p>
            <h1 className="t-display rise-in mt-6 text-white" style={{ "--d": 1 } as React.CSSProperties}>{ind.name}</h1>
            <p className="t-lead rise-in mt-6 text-white/85" style={{ "--d": 2 } as React.CSSProperties}>{ind.headline}</p>
            <div className="rise-in mt-9 flex flex-wrap gap-3" style={{ "--d": 3 } as React.CSSProperties}>
              <Btn href="#solutions">View {products.length} solutions</Btn>
              <Btn href={`/request-a-quote?industry=${ind.slug}`} variant="ghost-light">Request a Quote</Btn>
            </div>
          </div>
          <dl className="rise-in mt-14 flex flex-wrap gap-x-12 gap-y-4 border-t border-white/15 pt-6 text-sm" style={{ "--d": 4 } as React.CSSProperties}>
            <div><dt className="text-white/60">Relevant products</dt><dd className="index-num text-3xl text-white">{products.length}</dd></div>
            <div><dt className="text-white/60">Product segments</dt><dd className="index-num text-3xl text-white">{segCount}</dd></div>
            {ind.subIndustries.length ? <div><dt className="text-white/60">Sub-industries covered</dt><dd className="index-num text-3xl text-white">{ind.subIndustries.length}</dd></div> : null}
          </dl>
        </div>
        <p className="media-caption absolute bottom-3 right-4 !text-white/60">Representative image{(ind.banner ?? ind.image)?.credit ? ` · ${(ind.banner ?? ind.image)?.credit}` : ""}</p>
      </section>

      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">Industry introduction</p>
            <p className="t-lead mt-6 text-heading">{ind.intro}</p>
            {ind.subIndustries.length ? (
              <>
                <p className="mt-10 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Includes</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">{ind.subIndustries.map((s) => <li key={s} className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-heading">{s}</li>)}</ul>
              </>
            ) : null}
          </div>
          <div className="lg:col-span-7">
            <p className="eyebrow">Typical packaging requirements</p>
            <div className="mt-6 grid gap-px bg-line sm:grid-cols-3">
              {ind.challenges.map((c, i) => (
                <div key={c.title} className="bg-cloud p-5" data-reveal style={{ "--d": i } as React.CSSProperties}>
                  <p className="index-num text-2xl text-red">{String(i + 1).padStart(2, "0")}</p>
                  <h2 className="mt-3 font-display text-base font-bold">{c.title}</h2>
                  <p className="mt-2 text-sm">{c.text}</p>
                </div>
              ))}
            </div>
            {ind.considerations.length ? (
              <div className="mt-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">What we consider when specifying</p>
                <List items={ind.considerations} className="mt-4 grid gap-x-8 sm:grid-cols-2 [&>li]:mt-0" />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section id="solutions" className="section surface-paper" style={{ scrollMarginTop: "var(--header-h)" }}>
        <div className="wrap">
          <SectionHead align="split" eyebrow="Relevant products" title={`Packaging for ${ind.shortName || ind.name}, across every segment.`} intro="Grouped by product segment. Filter by material, application or product type, add several products to one enquiry, or download any flyer." />
          <div className="mt-12"><Discovery data={data} mode="industry" initialIndustry={ind.slug} /></div>
        </div>
      </section>

      {ind.faqs.length ? (
        <section className="section">
          <div className="wrap grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4"><SectionHead eyebrow="FAQs" title={`${ind.shortName || ind.name} packaging questions`} /></div>
            <div className="lg:col-span-8"><Faqs items={ind.faqs} /></div>
          </div>
        </section>
      ) : null}

      {reading.length ? (
        <section className="section-tight border-t border-line">
          <div className="wrap">
            <p className="eyebrow">Further reading</p>
            <ul className="mt-6 grid gap-px bg-line md:grid-cols-3">
              {reading.map((p) => (
                <li key={p.id} className="bg-cloud"><Link href={postUrl(p)} className="group flex h-full items-start justify-between gap-4 p-5"><span className="font-display font-bold text-heading group-hover:text-red">{p.title}</span><ArrowRight className="mt-1 size-4 flex-none text-red" /></Link></li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <Cta data={{ variant: "red", heading: `Let's define the right packaging for your ${(ind.shortName || ind.name).toLowerCase()} operation.`, text: "Your industry is carried into the quote form automatically.", primary: { label: "Request a Quote", href: `/request-a-quote?industry=${ind.slug}` }, secondary: { label: "Discuss a Custom Requirement", href: `/custom-requirement?industry=${ind.slug}` } }} />
      <JsonLd data={[breadcrumbLd(crumbs), ...(ind.faqs.length ? [faqLd(ind.faqs)] : [])]} />
    </>
  );
}
