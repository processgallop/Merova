"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowUpRight, Check, Download, Plus } from "lucide-react";
import type { ProductCard as Card } from "@/lib/content";
import { useSelection } from "@/components/client/selection";
import { track } from "@/lib/track";

export type CardData = Pick<Card, "slug" | "name" | "shortName" | "summary" | "family" | "segment" | "image" | "url" | "flyer" | "code" | "availability" | "materials">;

export function ProductCard({ p, context, industry, compact = false }: { p: CardData; context?: string | null; industry?: string; compact?: boolean }) {
  const { has, toggle } = useSelection();
  const picked = has(p.slug);
  return (
    <article className="group relative flex h-full flex-col bg-cloud transition-colors duration-300 hover:bg-surface">
      <span className="absolute inset-x-0 top-0 z-10 h-[3px] origin-left scale-x-0 bg-red transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-x-100" aria-hidden />
      <Link href={p.url} className="block" onClick={() => track("product_click", { product: p.slug, industry })} tabIndex={-1} aria-hidden>
        <div className={`img-zoom relative ${compact ? "aspect-[4/3]" : "aspect-[5/4]"} bg-[color-mix(in_oklab,var(--c-bg)_70%,#e9dfd2)]`}>
          {p.image ? <img src={p.image.url} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" /> : null}
          <span className="absolute left-3 top-3 rounded-full bg-cloud/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-heading backdrop-blur">
            <span className="text-red">{p.segment.code}</span> · {p.segment.navName}
          </span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{p.family}</p>
        <h3 className="mt-1.5 font-display text-[1.15rem] font-bold leading-snug tracking-tight">
          <Link href={p.url} className="transition-colors hover:text-red" onClick={() => track("product_click", { product: p.slug, industry })}>
            {p.name}
          </Link>
        </h3>
        {context ? <p className="mt-1 text-xs font-semibold text-red">{context}</p> : null}
        {!compact ? <p className="mt-2 line-clamp-2 text-sm">{p.summary}</p> : null}
        {p.availability === "pending" ? <p className="mt-2 text-[11px] font-semibold text-muted">Capability under confirmation</p> : null}
        <div className="mt-auto flex items-center gap-1 pt-4">
          <Link href={p.url} className="link whitespace-nowrap text-sm" onClick={() => track("product_click", { product: p.slug, industry })}>
            {compact ? "View" : "View product"} <ArrowUpRight className="size-4" />
          </Link>
          <span className="ml-auto flex items-center gap-1">
            {p.flyer ? <a href={p.flyer} className="flex size-9 items-center justify-center text-muted transition-colors hover:text-red" aria-label={`Download ${p.shortName} flyer (PDF)`} title="Download flyer" onClick={() => track("download", { file: "flyer", product: p.slug })}>
              <Download className="size-4" />
            </a> : null}
            <button
              type="button"
              onClick={() => toggle({ slug: p.slug, name: p.shortName, segment: p.segment.navName, image: p.image?.url })}
              aria-pressed={picked}
              aria-label={picked ? `Remove ${p.shortName} from enquiry` : `Add ${p.shortName} to enquiry`}
              title={picked ? "Added to enquiry" : "Add to enquiry"}
              className={`flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-all ${picked ? "border-red bg-red text-white" : "border-line text-heading hover:border-heading"}`}
            >
              {picked ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
              <span>{picked ? "Added" : "Enquire"}</span>
            </button>
          </span>
        </div>
      </div>
    </article>
  );
}
