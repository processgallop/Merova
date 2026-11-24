import Link from "next/link";
import { Media } from "@/components/ui/Media";
import { CATEGORIES, readingMinutes, type Article } from "@/data/blog";

export function ArticleCard({ article }: { article: Article }) {
  const href = `/blog/${article.slug}`;
  return (
    <article className="card group flex h-full flex-col overflow-hidden">
      <Link href={href} tabIndex={-1} aria-hidden className="block overflow-hidden">
        <Media
          image={{ src: article.image, alt: "", kind: article.image.endsWith(".svg") ? "illustration" : "representative" }}
          sizes="(min-width:768px) 33vw, 100vw"
          caption={false}
          aspect="aspect-[16/10]"
          className="transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-red-600">
          {CATEGORIES[article.category].name} · {readingMinutes(article)} min read
        </p>
        <h3 className="mt-2 font-display text-[1.08rem] font-semibold leading-snug text-char-950">
          <Link href={href} className="hover:text-red-600">{article.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-[0.9rem] leading-relaxed text-ink-2">{article.description}</p>
        <Link href={href} className="link-arrow mt-auto pt-4 text-[0.88rem]">Read article →</Link>
      </div>
    </article>
  );
}
