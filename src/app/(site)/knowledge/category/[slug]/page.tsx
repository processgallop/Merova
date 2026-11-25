import Link from "next/link";
import { notFound } from "next/navigation";
import { Crumbs } from "@/components/ui/blocks";
import { ArticleGrid } from "@/components/blog/ArticleGrid";
import { getPostCategories, getPosts } from "@/lib/content";
import { meta } from "@/lib/meta";

export const revalidate = 3600;
type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPostCategories()).map((c) => ({ slug: c.slug }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cat = (await getPostCategories()).find((x) => x.slug === slug);
  return cat ? meta({ title: `${cat.name} Guides`, description: cat.description, path: `/knowledge/category/${cat.slug}` }) : {};
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const [cats, posts] = await Promise.all([getPostCategories(), getPosts()]);
  const cat = cats.find((c) => c.slug === slug);
  if (!cat) notFound();
  const list = posts.filter((p) => p.categoryId === cat.id);
  return (
    <>
      <section className="border-b border-line">
        <div className="wrap pb-12 pt-10">
          <Crumbs items={[{ name: "Knowledge Centre", href: "/knowledge" }, { name: cat.name, href: `/knowledge/category/${cat.slug}` }]} />
          <p className="eyebrow mt-10">Knowledge Centre</p>
          <h1 className="t-display mt-5">{cat.name}</h1>
          <p className="t-lead mt-4 max-w-2xl">{cat.description}</p>
          <Link href="/knowledge" className="link link-red mt-6">All guides</Link>
        </div>
      </section>
      <section className="section">
        <div className="wrap">{list.length ? <ArticleGrid posts={list} categories={cats} /> : <p>No published guides in this category yet.</p>}</div>
      </section>
    </>
  );
}
