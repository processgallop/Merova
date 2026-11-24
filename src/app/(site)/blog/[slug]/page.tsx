import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { Breadcrumbs, FaqList } from "@/components/ui/blocks";
import { Media } from "@/components/ui/Media";
import { ArticleBlock } from "@/components/blog/ArticleBody";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { ProductCard } from "@/components/product/ProductCard";
import { ShareLinks } from "@/components/blog/ShareLinks";
import { JsonLd } from "@/components/seo/JsonLd";
import { articles, CATEGORIES, getArticle, readingMinutes, relatedArticles } from "@/data/blog";
import { getProduct } from "@/data/catalog";
import { toCard } from "@/data/cards";
import { absoluteUrl, site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import type { Product } from "@/data/types";

export const dynamicParams = false;
export const generateStaticParams = () => articles.map((a) => ({ slug: a.slug }));
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const a = getArticle((await params).slug);
  if (!a) return {};
  return pageMetadata({
    title: `${a.title} | Merova Printpack`,
    description: a.description,
    path: `/blog/${a.slug}`,
    type: "article",
    image: a.image.endsWith(".webp") ? a.image : undefined,
    // Kept out of search results until a named Merova technical reviewer approves the article.
    noindex: a.review.status !== "reviewed",
  });
}

export default async function ArticlePage({ params }: Props) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const cat = CATEGORIES[a.category];
  const url = `/blog/${a.slug}`;
  const prods = a.relatedProducts.map(getProduct).filter((p): p is Product => Boolean(p));
  const reviewed = a.review.status === "reviewed";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    image: absoluteUrl(a.image),
    mainEntityOfPage: absoluteUrl(url),
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: absoluteUrl("/assets/brand/merova-logo-512.png") } },
    ...(reviewed && a.review.reviewer ? { reviewedBy: { "@type": "Person", name: a.review.reviewer } } : {}),
    ...(a.review.date ? { datePublished: a.review.date, dateModified: a.review.date } : {}),
  };

  return (
    <article>
      <header className="border-b border-line">
        <div className="container-x max-w-4xl py-10 lg:py-14">
          <Breadcrumbs items={[{ name: "Knowledge Centre", href: "/blog" }, { name: cat.name, href: `/blog/category/${cat.slug}` }, { name: a.title, href: url }]} />
          <p className="eyebrow mt-8">{cat.name} · {readingMinutes(a)} min read</p>
          <h1 className="t-1 mt-3">{a.title}</h1>
          <p className="lede mt-5">{a.intro}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
            <span>By the Merova packaging team</span>
            <span>{reviewed ? `Technically reviewed by ${a.review.reviewer}` : "Technical review: pending (Merova technical team)"}</span>
            <ShareLinks url={absoluteUrl(url)} title={a.title} />
          </div>
        </div>
      </header>

      <div className="container-x grid max-w-6xl gap-12 py-12 lg:grid-cols-[1fr_17rem]">
        <div className="min-w-0">
          <Media image={{ src: a.image, alt: "", kind: a.image.endsWith(".svg") ? "illustration" : "representative" }} sizes="(min-width:1024px) 720px, 100vw" aspect="aspect-[16/9]" className="rounded-md border border-line" />
          <div className="prose-merova mt-10">
            {a.sections.map((s) => (
              <section key={s.heading}>
                <h2>{s.heading}</h2>
                {s.blocks.map((b, i) => <ArticleBlock key={i} block={b} />)}
              </section>
            ))}
            <h2>Practical recommendations</h2>
            <ul className="!list-none !pl-0">
              {a.recommendations.map((r) => <li key={r} className="flex gap-3"><Check className="mt-1.5 h-4 w-4 shrink-0 text-ok" aria-hidden /><span>{r}</span></li>)}
            </ul>
            <h2>Industry applications</h2>
            <ul>{a.applications.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>

          <section className="mt-12">
            <h2 className="t-3">Frequently asked questions</h2>
            <div className="mt-4"><FaqList faqs={a.faqs} /></div>
          </section>

          <aside className="mt-12 rounded-md bg-navy-900 p-7 text-white">
            <p className="font-display text-xl font-semibold">{a.cta.title}</p>
            <Link href={a.cta.href} className="btn btn-primary mt-5">{a.cta.label} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </aside>
        </div>

        <aside className="grid content-start gap-5 lg:sticky lg:top-28">
          <div className="rounded-md border border-line bg-white p-5">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted">In this guide</p>
            <ul className="mt-3 grid gap-2 text-[0.88rem]">
              {a.sections.map((s) => <li key={s.heading} className="text-ink-2">{s.heading}</li>)}
              <li className="text-ink-2">Practical recommendations</li>
              <li className="text-ink-2">FAQs</li>
            </ul>
          </div>
          <div className="rounded-md border border-line bg-paper-2 p-5">
            <p className="font-display font-semibold text-navy-950">Need advice for your application?</p>
            <Link href="/request-a-quote" className="btn btn-primary btn-sm mt-4 w-full">Request a Quote</Link>
            <Link href="/contact?topic=technical" className="btn btn-outline btn-sm mt-2 w-full">Ask a specialist</Link>
          </div>
        </aside>
      </div>

      {prods.length > 0 && (
        <section className="border-t border-line bg-white py-14">
          <div className="container-x">
            <h2 className="t-2">Related products</h2>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{prods.map((p) => <li key={p.slug}><ProductCard card={toCard(p)} compact /></li>)}</ul>
          </div>
        </section>
      )}
      <section className="py-14">
        <div className="container-x">
          <h2 className="t-2">Related guides</h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">{relatedArticles(a).map((r) => <li key={r.slug}><ArticleCard article={r} /></li>)}</ul>
        </div>
      </section>
      <JsonLd data={schema} />
    </article>
  );
}
