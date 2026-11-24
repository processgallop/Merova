import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Info } from "lucide-react";
import { Breadcrumbs, CtaBand, FaqList, ProductTile, Render } from "@/components/ui/blocks";
import { JsonLd } from "@/components/seo/JsonLd";
import { articles, CATEGORIES, getArticle, readingMinutes, relatedArticles, type Block } from "@/content/blog";
import { productById } from "@/data/catalog";
import { absoluteUrl, site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => articles.map((a) => ({ slug: a.slug }));
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const a = getArticle((await params).slug);
  return a ? pageMetadata({ title: `${a.title} | Merova Insights`.slice(0, 70), description: a.description, path: a.url, image: a.image, type: "article", noindex: a.review.status !== "reviewed" }) : {};
}

function B({ b }: { b: Block }) {
  switch (b.type) {
    case "p": return <p>{b.text}</p>;
    case "h3": return <h3>{b.text}</h3>;
    case "ul": return <ul>{b.items.map((i) => <li key={i}>{i}</li>)}</ul>;
    case "ol": return <ol>{b.items.map((i) => <li key={i}>{i}</li>)}</ol>;
    case "note": return <p className="!my-6 rounded-2xl bg-sand p-5 !text-[15px]">{b.text}</p>;
    case "table": return <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-line"><table className="w-full text-[14.5px]"><thead><tr className="bg-sand text-left">{b.head.map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead><tbody>{b.rows.map((r, i) => <tr key={i} className="border-t border-line">{r.map((c, j) => <td key={j} className="px-4 py-3 align-top text-charcoal">{c}</td>)}</tr>)}</tbody></table>{b.caption && <p className="px-4 py-2 text-xs text-stone">{b.caption}</p>}</div>;
  }
}

export default async function Page({ params }: Props) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const related = a.relatedProducts.map((id) => productById[id]).filter(Boolean);
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: a.title, description: a.description, image: absoluteUrl(a.image), mainEntityOfPage: absoluteUrl(a.url), author: { "@type": "Organization", name: site.name }, publisher: { "@type": "Organization", name: site.name } }} />
      <article>
        <header className="bg-cloud">
          <div className="wrap max-w-4xl pb-10 pt-8">
            <Breadcrumbs items={[{ name: "Insights", href: "/insights/" }, { name: a.title, href: a.url }]} />
            <p className="eyebrow mt-12">{CATEGORIES[a.category].name} · {readingMinutes(a)} min read</p>
            <h1 className="h1 mt-4">{a.title}</h1>
            <p className="lede mt-6">{a.intro}</p>
            {a.review.status !== "reviewed" && <p className="mt-6 flex items-center gap-2 text-xs text-stone"><Info className="h-3.5 w-3.5" /> Awaiting technical review by the Merova team.</p>}
          </div>
          <div className="wrap max-w-5xl"><Render src={a.image} alt="" className="rounded-[28px]" ratio="aspect-[16/8]" sizes="(min-width:1024px) 960px, 100vw" /></div>
        </header>
        <div className="wrap grid max-w-6xl gap-12 py-16 lg:grid-cols-[220px_1fr]">
          <nav aria-label="On this page" className="hidden lg:block"><div className="sticky top-28"><p className="eyebrow eyebrow-muted">On this page</p><ul className="mt-3 grid gap-2 text-sm">{a.sections.map((s, i) => <li key={i}><a href={`#s${i}`} className="text-charcoal hover:text-red">{s.heading}</a></li>)}</ul></div></nav>
          <div className="prose-merova max-w-3xl text-[17px]">
            {a.sections.map((s, i) => <section key={i} id={`s${i}`} className="scroll-mt-28"><h2>{s.heading}</h2>{s.blocks.map((b, j) => <B key={j} b={b} />)}</section>)}
            {a.recommendations.length > 0 && <><h2>Recommendations</h2><ul>{a.recommendations.map((r) => <li key={r}>{r}</li>)}</ul></>}
            <div className="not-prose mt-12 rounded-[28px] bg-red p-8 text-white"><h2 className="font-display text-2xl font-semibold">{a.cta.title}</h2><Link href={a.cta.href} className="btn btn-cloud mt-6">{a.cta.label} <ArrowRight className="arrow h-4 w-4" /></Link></div>
            {a.faqs.length > 0 && <div className="not-prose mt-12"><h2 className="h3">FAQs</h2><FaqList faqs={a.faqs} className="mt-6" /></div>}
          </div>
        </div>
      </article>
      {related.length > 0 && <section className="section-tight bg-sand"><div className="wrap wrap-wide"><h2 className="h2">Products in this guide</h2><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{related.slice(0, 4).map((p) => <ProductTile key={p.id} p={p} showCategory />)}</div></div></section>}
      <section className="section-tight"><div className="wrap wrap-wide"><h2 className="h3">Keep reading</h2><div className="mt-6 grid gap-4 md:grid-cols-3">{relatedArticles(a).map((r) => <Link key={r.slug} href={r.url} className="tile p-6"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone">{CATEGORIES[r.category].name}</p><h3 className="mt-2 font-display text-lg font-semibold leading-snug">{r.title}</h3></Link>)}</div></div></section>
      <CtaBand />
    </>
  );
}
