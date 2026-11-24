import Link from "next/link";
import { CtaBand, PageHero } from "@/components/ui/blocks";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { articles, CATEGORIES } from "@/data/blog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Packaging Knowledge Centre | Guides & Insights | Merova Printpack",
  description: "Technical packaging guides: corrugated ply and flutes, cartons, foodservice packaging, films and micron, pharmaceutical and automotive packaging, sustainability and procurement.",
  path: "/blog",
});

export default function BlogIndex() {
  const used = Object.entries(CATEGORIES).filter(([id]) => articles.some((a) => a.category === id));
  return (
    <>
      <PageHero eyebrow="Packaging knowledge centre" title="Practical guidance for packaging buyers and engineers." intro={`${articles.length} technical guides on materials, formats, specification and procurement — written to help you specify packaging with confidence.`} crumbs={[{ name: "Knowledge Centre", href: "/blog" }]} />
      <nav aria-label="Categories" className="border-b border-line bg-white">
        <ul className="container-x flex gap-2 overflow-x-auto py-3">
          <li><Link href="/blog" className="chip whitespace-nowrap !border-navy-900 !bg-navy-900 !py-1.5 !text-white">All</Link></li>
          {used.map(([, c]) => <li key={c.slug}><Link href={`/blog/category/${c.slug}`} className="chip whitespace-nowrap !py-1.5 hover:border-navy-800">{c.name}</Link></li>)}
        </ul>
      </nav>
      <section className="py-14 lg:py-20">
        <ul className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => <li key={a.slug}><ArticleCard article={a} /></li>)}
        </ul>
      </section>
      <CtaBand title="Have a technical question we haven't covered?" text="Ask the team — or Mira — and we'll point you in the right direction." primary={{ label: "Contact Technical Support", href: "/contact?topic=technical" }} />
    </>
  );
}
