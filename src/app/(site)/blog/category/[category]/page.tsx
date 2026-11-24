import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/blocks";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { articles, CATEGORIES, categoryBySlug } from "@/data/blog";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () =>
  Object.entries(CATEGORIES).filter(([id]) => articles.some((a) => a.category === id)).map(([, c]) => ({ category: c.slug }));

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props) {
  const found = categoryBySlug((await params).category);
  if (!found) return {};
  const [, c] = found;
  return pageMetadata({ title: `${c.name} Guides | Merova Packaging Knowledge Centre`, description: `${c.description} Technical guides from Merova Printpack.`, path: `/blog/category/${c.slug}` });
}

export default async function CategoryPage({ params }: Props) {
  const found = categoryBySlug((await params).category);
  if (!found) notFound();
  const [id, c] = found;
  const list = articles.filter((a) => a.category === id);
  return (
    <>
      <PageHero eyebrow="Knowledge centre" title={c.name} intro={c.description} crumbs={[{ name: "Knowledge Centre", href: "/blog" }, { name: c.name, href: `/blog/category/${c.slug}` }]} />
      <section className="py-14 lg:py-20">
        <ul className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((a) => <li key={a.slug}><ArticleCard article={a} /></li>)}</ul>
        <p className="container-x mt-10"><Link href="/blog" className="link-arrow">All guides →</Link></p>
      </section>
    </>
  );
}
