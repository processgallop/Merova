import Link from "next/link";
import { ArrowRight, BookOpen, Download, HelpCircle } from "lucide-react";
import { CtaBand, PageHero } from "@/components/ui/blocks";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { latestArticles } from "@/data/blog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Packaging Resources | Downloads, Guides & FAQs | Merova Printpack",
  description: "Merova's packaging resources: product flyers, catalogue, company profile, technical guides and FAQs.",
  path: "/resources",
});

export default function ResourcesPage() {
  const cards = [
    { icon: Download, title: "Downloads Centre", text: "Product flyers, the complete catalogue, company profile and brochures.", href: "/resources/downloads" },
    { icon: BookOpen, title: "Knowledge Centre", text: "Technical guides on board, flutes, films, cups, procurement and sustainability.", href: "/blog" },
    { icon: HelpCircle, title: "FAQs", text: "Answers on products, quotations, customisation, quality and sustainability.", href: "/resources/faqs" },
  ];
  return (
    <>
      <PageHero eyebrow="Resources" title="Everything you need to specify packaging with confidence." intro="Download documents, read technical guides, or find answers to common questions." crumbs={[{ name: "Resources", href: "/resources" }]} />
      <section className="py-14 lg:py-20">
        <ul className="container-x grid gap-5 md:grid-cols-3">
          {cards.map(({ icon: I, title, text, href }) => (
            <li key={href}>
              <Link href={href} className="card group flex h-full flex-col p-7 hover:shadow-card">
                <I className="h-7 w-7 text-red-500" strokeWidth={1.5} aria-hidden />
                <h2 className="mt-5 font-display text-xl font-semibold text-char-950 group-hover:text-red-600">{title}</h2>
                <p className="mt-2 leading-relaxed text-ink-2">{text}</p>
                <span className="link-arrow mt-auto pt-5">Open <ArrowRight className="h-4 w-4" aria-hidden /></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="border-t border-line bg-white py-14 lg:py-20">
        <div className="container-x">
          <h2 className="t-2">Latest guides</h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">{latestArticles(3).map((a) => <li key={a.slug}><ArticleCard article={a} /></li>)}</ul>
        </div>
      </section>
      <CtaBand title="Can't find what you need?" text="Ask Mira, or speak with the team directly." />
    </>
  );
}
