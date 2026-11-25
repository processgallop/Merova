import { articles1 } from "./articles-1";
import { articles2 } from "./articles-2";
import { articles3 } from "./articles-3";
import type { Article, Block, CategoryId } from "./types";

export type { Article, Block, CategoryId };

export const CATEGORIES: Record<CategoryId, { name: string; slug: string; description: string }> = {
  corrugated: { name: "Corrugated Packaging", slug: "corrugated-packaging", description: "Ply, flute, board strength and box styles." },
  paper: { name: "Paper Packaging", slug: "paper-packaging", description: "Cartons, boards, print and finishing." },
  foodservice: { name: "Foodservice Packaging", slug: "foodservice-packaging", description: "Cups, trays, food contact and QSR packaging." },
  flexible: { name: "Plastic & Flexible Packaging", slug: "flexible-packaging", description: "Films, pouches, micron and material selection." },
  pharmaceutical: { name: "Pharmaceutical Packaging", slug: "pharmaceutical-packaging", description: "Cartons, inserts and distribution packaging for pharma." },
  automotive: { name: "Automotive Packaging", slug: "automotive-packaging", description: "Transit packaging for components." },
  sustainable: { name: "Sustainable Packaging", slug: "sustainable-packaging", description: "Material choices and credible claims." },
  engineering: { name: "Packaging Engineering", slug: "packaging-engineering", description: "Protection, testing and design." },
  procurement: { name: "Procurement Guides", slug: "procurement-guides", description: "RFQs, cost and supplier management." },
  innovation: { name: "Packaging Innovations", slug: "packaging-innovations", description: "Development and new formats." },
};

/** Editorial calendar order (Part 9 of the brief). */
export const articles: Article[] = [...articles1, ...articles2, ...articles3];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
export const latestArticles = (n: number) => articles.slice(0, n);
export const categoryBySlug = (slug: string) =>
  (Object.entries(CATEGORIES) as [CategoryId, (typeof CATEGORIES)[CategoryId]][]).find(([, c]) => c.slug === slug);

export function readingMinutes(a: Article) {
  const text = [a.intro, ...a.sections.flatMap((s) => s.blocks.map(blockText)), ...a.recommendations, ...a.faqs.flatMap((f) => [f.q, f.a])].join(" ");
  return Math.max(3, Math.round(text.split(/\s+/).length / 200));
}

function blockText(b: Block): string {
  switch (b.type) {
    case "p":
    case "h3":
    case "note":
      return b.text;
    case "ul":
    case "ol":
      return b.items.join(" ");
    case "table":
      return [...b.head, ...b.rows.flat()].join(" ");
  }
}

export const relatedArticles = (a: Article, n = 3) =>
  [...articles.filter((x) => x.slug !== a.slug && x.category === a.category), ...articles.filter((x) => x.slug !== a.slug && x.category !== a.category)].slice(0, n);
