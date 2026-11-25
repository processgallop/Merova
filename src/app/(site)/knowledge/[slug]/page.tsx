import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import type { PostBlock } from "@/db/types";
import { Crumbs, Faqs, List } from "@/components/ui/blocks";
import { Img } from "@/components/ui/Img";
import { inline } from "@/components/ui/RichText";
import { ProductCard } from "@/components/product/ProductCard";
import { Cta } from "@/components/sections/Sections";
import { JsonLd, breadcrumbLd, faqLd } from "@/components/seo/JsonLd";
import { findRedirect, getCatalog, getPost, getPostCategories, getPosts, postUrl, readingMinutes } from "@/lib/content";
import { meta } from "@/lib/meta";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;
type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const p = await getPost((await params).slug);
  if (!p) return {};
  // Guides stay out of search indexes until a named Merova reviewer approves them.
  return meta({ title: p.title, description: p.excerpt, path: postUrl(p), seo: p.seo, image: p.cover?.url, noindex: p.reviewStatus !== "reviewed" });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    const r = await findRedirect(`/knowledge/${slug}`);
    if (r) permanentRedirect(r.toPath);
    notFound();
  }
  const [cats, { cards }, posts] = await Promise.all([getPostCategories(), getCatalog(), getPosts()]);
  const cat = cats.find((c) => c.id === post.categoryId);
  const related = post.relatedProducts.map((s) => cards.find((c) => c.slug === s)).filter((c): c is (typeof cards)[number] => Boolean(c)).slice(0, 4);
  const more = (post.relatedPosts.length ? posts.filter((p) => post.relatedPosts.includes(p.slug)) : posts.filter((p) => p.id !== post.id && p.categoryId === post.categoryId)).slice(0, 3);
  const crumbs = [{ name: "Knowledge Centre", href: "/knowledge" }, ...(cat ? [{ name: cat.name, href: `/knowledge/category/${cat.slug}` }] : []), { name: post.title, href: postUrl(post) }];

  return (
    <article>
      <header className="border-b border-line">
        <div className="wrap pb-12 pt-10">
          <Crumbs items={crumbs} />
          <div className="mx-auto mt-12 max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-red">{cat?.name} · {readingMinutes(post)} min read</p>
            <h1 className="t-display mt-5">{post.title}</h1>
            <p className="t-lead mt-6">{post.intro}</p>
            <p className="mt-6 text-sm text-muted">By {post.author}{post.publishedAt ? ` · ${new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}` : ""}{post.reviewStatus === "reviewed" && post.reviewer ? ` · Technically reviewed by ${post.reviewer}` : ""}</p>
          </div>
        </div>
        {post.cover ? <div className="wrap pb-12"><Img image={post.cover} priority caption sizes="100vw" className="relative mx-auto aspect-[21/9] max-w-5xl overflow-hidden bg-paper" /></div> : null}
      </header>
      <div className="wrap grid gap-12 py-16 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <nav aria-label="Contents" className="sticky top-[calc(var(--header-h)+24px)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Contents</p>
            <ol className="mt-4 space-y-2 text-sm">
              {post.body.map((s, i) => <li key={i}><a href={`#s${i}`} className="text-heading hover:text-red">{s.heading}</a></li>)}
            </ol>
          </nav>
        </aside>
        <div className="prose-m lg:col-span-7">
          {post.body.map((s, i) => (
            <section key={i} id={`s${i}`} style={{ scrollMarginTop: "calc(var(--header-h) + 20px)" }}>
              <h2>{s.heading}</h2>
              {s.blocks.map((b, j) => <Block key={j} b={b} />)}
            </section>
          ))}
          {post.recommendations.length ? (
            <section><h2>Recommendations</h2><List items={post.recommendations} /></section>
          ) : null}
          {post.videoUrl ? <p><a href={post.videoUrl} target="_blank" rel="noopener noreferrer">Watch the related video</a></p> : null}
        </div>
      </div>
      {post.faqs.length ? (
        <section className="section-tight border-t border-line">
          <div className="wrap mx-auto max-w-4xl"><p className="eyebrow mb-6">FAQs</p><Faqs items={post.faqs} /></div>
        </section>
      ) : null}
      {related.length ? (
        <section className="section surface-paper">
          <div className="wrap">
            <p className="eyebrow">Products in this guide</p>
            <div className="hairline-grid mt-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">{related.map((c) => <ProductCard key={c.id} p={c} compact />)}</div>
          </div>
        </section>
      ) : null}
      {more.length ? (
        <section className="section-tight">
          <div className="wrap">
            <p className="eyebrow">Related guides</p>
            <ul className="mt-6 grid gap-px bg-line md:grid-cols-3">
              {more.map((p) => <li key={p.id} className="bg-cloud"><Link href={postUrl(p)} className="group flex h-full items-start justify-between gap-4 p-5"><span className="font-display font-bold text-heading group-hover:text-red">{p.title}</span><ArrowRight className="mt-1 size-4 flex-none text-red" /></Link></li>)}
            </ul>
          </div>
        </section>
      ) : null}
      <Cta data={{ variant: "red", heading: "Apply this to your packaging.", text: "Share your requirement and the team will recommend a specification.", primary: { label: "Request a Quote", href: "/request-a-quote" }, secondary: { label: "Speak With Our Team", href: "/contact" } }} />
      <JsonLd data={[breadcrumbLd(crumbs), { "@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.excerpt, author: { "@type": "Organization", name: post.author }, publisher: { "@type": "Organization", name: "Merova Printpack" }, datePublished: post.publishedAt?.toISOString(), dateModified: post.updatedAt.toISOString(), image: post.cover ? absoluteUrl(post.cover.url) : undefined, mainEntityOfPage: absoluteUrl(postUrl(post)) }, ...(post.faqs.length ? [faqLd(post.faqs)] : [])]} />
    </article>
  );
}

function Block({ b }: { b: PostBlock }) {
  switch (b.type) {
    case "p": return <p>{inline(b.text)}</p>;
    case "h3": return <h3>{inline(b.text)}</h3>;
    case "note": return <p className="note">{inline(b.text)}</p>;
    case "ul": return <ul>{b.items.map((x, i) => <li key={i}>{inline(x)}</li>)}</ul>;
    case "ol": return <ol>{b.items.map((x, i) => <li key={i}>{inline(x)}</li>)}</ol>;
    case "image": return <Img image={b.image} caption fill={false} imgClassName="w-full h-auto" />;
    case "table":
      return (
        <div className="overflow-x-auto">
          <table>
            {b.caption ? <caption className="media-caption mb-2 text-left">{b.caption}</caption> : null}
            <thead><tr>{b.head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
            <tbody>{b.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{inline(c)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      );
  }
}
