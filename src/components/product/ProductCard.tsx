import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { Media } from "@/components/ui/Media";
import { TrackedLink } from "@/components/ui/TrackedLink";
import type { ProductCardData } from "@/data/cards";

const quoteHref = (slug: string, industry?: string) =>
  `/request-a-quote?product=${slug}${industry ? `&industry=${industry}` : ""}`;

/** Presentational card — no catalogue imports, so it is safe inside client components. */
export function ProductCard({ card, industry, compact = false }: { card: ProductCardData; industry?: string; compact?: boolean }) {
  return (
    <article className="card group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-card">
      <Link href={card.url} aria-hidden="true" tabIndex={-1} className="block overflow-hidden">
        <Media image={card.image} sizes="(min-width:1280px) 25vw, (min-width:640px) 45vw, 100vw" caption={false} className="transition-transform duration-500 group-hover:scale-[1.02]" />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-muted">{card.vertical}</p>
        <h3 className="mt-1.5 font-display text-[1.08rem] font-semibold leading-snug text-navy-950">
          <Link href={card.url} className="hover:text-signal-600">{card.name}</Link>
        </h3>
        <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-2">{card.summary}</p>
        {!compact && (
          <dl className="mt-4 grid gap-2 border-t border-line pt-3 text-[0.82rem]">
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 font-semibold text-ink">Application</dt>
              <dd className="text-ink-2">{card.application}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 font-semibold text-ink">Materials</dt>
              <dd className="text-ink-2">{card.materials}</dd>
            </div>
          </dl>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
          <Link href={card.url} className="btn btn-outline btn-sm">View Product</Link>
          <Link href={quoteHref(card.slug, industry)} className="btn btn-primary btn-sm">Request a Quote</Link>
          <TrackedLink
            href={card.flyer}
            download
            event="flyer_download"
            params={{ product: card.slug }}
            className="inline-flex items-center gap-1 px-1 py-2 text-[0.82rem] font-semibold text-navy-700 hover:text-signal-600"
            aria-label={`Download ${card.name} flyer (PDF)`}
          >
            <Download className="h-3.5 w-3.5" aria-hidden /> Flyer
          </TrackedLink>
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ cards, industry }: { cards: ProductCardData[]; industry?: string }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
      {cards.map((c) => (
        <li key={c.slug}><ProductCard card={c} industry={industry} /></li>
      ))}
    </ul>
  );
}

export function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="link-arrow">
      {children} <ArrowRight className="h-4 w-4" aria-hidden />
    </Link>
  );
}
