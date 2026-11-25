import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { postUrl, readingMinutes, type Post } from "@/lib/content";

export function ArticleGrid({ posts, categories, featureFirst = false }: { posts: Post[]; categories: { id: number; name: string }[]; featureFirst?: boolean }) {
  const cat = (id: number | null) => categories.find((c) => c.id === id)?.name ?? "";
  const [first, ...rest] = posts;
  return (
    <div className="space-y-16">
      {featureFirst && first ? (
        <Link href={postUrl(first)} className="group grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="img-zoom relative aspect-[16/10] bg-paper lg:col-span-7"><Img image={first.cover} priority sizes="(min-width:1024px) 60vw, 100vw" className="absolute inset-0" /></div>
          <div className="lg:col-span-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-red">{cat(first.categoryId)} · {readingMinutes(first)} min read</p>
            <h2 className="t-h2 mt-4 group-hover:text-red">{first.title}</h2>
            <p className="mt-4">{first.excerpt}</p>
          </div>
        </Link>
      ) : null}
      <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {(featureFirst ? rest : posts).map((p, i) => (
          <Link key={p.id} href={postUrl(p)} className="group block" data-reveal style={{ "--d": i % 3 } as React.CSSProperties}>
            <div className="img-zoom relative aspect-[4/3] bg-paper"><Img image={p.cover} sizes="(min-width:1024px) 33vw, 50vw" className="absolute inset-0" /></div>
            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-red">{cat(p.categoryId)} · {readingMinutes(p)} min</p>
            <h3 className="mt-2 font-display text-xl font-bold leading-snug group-hover:text-red">{p.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
