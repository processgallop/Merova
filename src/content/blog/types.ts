export type Block =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "h3"; text: string }
  | { type: "table"; head: string[]; rows: string[][]; caption?: string }
  | { type: "note"; text: string };

export interface ArticleSection {
  heading: string;
  blocks: Block[];
}

export type CategoryId =
  | "corrugated"
  | "paper"
  | "foodservice"
  | "flexible"
  | "pharmaceutical"
  | "automotive"
  | "sustainable"
  | "engineering"
  | "procurement"
  | "innovation";

export interface Article {
  slug: string;
  title: string;
  description: string;
  category: CategoryId;
  keyword: string;
  intro: string;
  sections: ArticleSection[];
  recommendations: string[];
  applications: string[];
  faqs: { q: string; a: string }[];
  relatedProducts: string[];
  cta: { title: string; label: string; href: string };
  image: string;
  /** Articles stay noindex until a named Merova technical reviewer approves them. */
  review: { status: "pending" | "reviewed"; reviewer?: string; date?: string };
}
