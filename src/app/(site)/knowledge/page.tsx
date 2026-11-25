import { Crumbs } from "@/components/ui/blocks";
import { ArticleGrid } from "@/components/blog/ArticleGrid";
import { getPostCategories, getPosts } from "@/lib/content";
import { meta } from "@/lib/meta";
import Link from "next/link";

export const revalidate = 3600;
export const metadata = meta({ title: "Packaging Knowledge Centre", description: "Technical guides on corrugated board, flutes, cartons, foodservice packaging, films, sustainability and packaging procurement.", path: "/knowledge" });

export default async function KnowledgePage() {
  const [posts, cats] = await Promise.all([getPosts(), getPostCategories()]);
  const used = cats.filter((c) => posts.some((p) => p.categoryId === c.id));
  return (
    <>
      <section className="border-b border-line">
        <div className="wrap pb-12 pt-10">
          <Crumbs items={[{ name: "Knowledge Centre", href: "/knowledge" }]} />
          <p className="eyebrow mt-10">Packaging Knowledge Centre</p>
          <h1 className="t-display mt-5 max-w-4xl">Technical guidance for better packaging decisions.</h1>
          <ul className="mt-10 flex flex-wrap gap-2">
            <li><span className="chip is-active">All guides</span></li>
            {used.map((c) => <li key={c.id}><Link href={`/knowledge/category/${c.slug}`} className="chip">{c.name}</Link></li>)}
          </ul>
        </div>
      </section>
      <section className="section">
        <div className="wrap"><ArticleGrid posts={posts} categories={cats} featureFirst /></div>
      </section>
    </>
  );
}
