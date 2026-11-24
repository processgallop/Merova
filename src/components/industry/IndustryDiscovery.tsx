"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, MessageSquareText } from "lucide-react";
import { IndustryIcon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/product/ProductCard";
import { track } from "@/lib/track";
import type { ProductCardData } from "@/data/cards";

export interface DiscoveryIndustry {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  icon: string;
  headline: string;
  products: string[];
}

const INITIAL = 6;

/**
 * "What Are You Looking to Pack?" — select an industry, see the products
 * mapped to it. The mapping comes from src/data (productsForIndustry), so
 * there is one source of truth for the homepage, industry pages and Mira.
 */
export function IndustryDiscovery({
  industries,
  cards,
  initial,
}: {
  industries: DiscoveryIndustry[];
  cards: Record<string, ProductCardData>;
  initial: string;
}) {
  const [active, setActive] = useState(initial);
  const [expanded, setExpanded] = useState(false);
  const ind = industries.find((i) => i.id === active) ?? industries[0];
  const list = useMemo(() => ind.products.map((s) => cards[s]).filter(Boolean), [ind, cards]);
  const shown = expanded ? list : list.slice(0, INITIAL);

  const select = (id: string) => {
    setActive(id);
    setExpanded(false);
    track("industry_select", { industry: id });
  };

  return (
    <div>
      {/* Mobile: native select is the most usable control on small screens */}
      <div className="md:hidden">
        <label htmlFor="industry-select" className="field-label">Choose your industry</label>
        <select id="industry-select" className="field" value={active} onChange={(e) => select(e.target.value)}>
          {industries.map((i) => (
            <option key={i.id} value={i.id}>{i.name}</option>
          ))}
        </select>
      </div>

      <div role="tablist" aria-label="Industries" className="hidden gap-2 md:grid md:grid-cols-5">
        {industries.map((i) => {
          const on = i.id === active;
          return (
            <button
              key={i.id}
              role="tab"
              type="button"
              id={`tab-${i.id}`}
              aria-selected={on}
              aria-controls="industry-panel"
              onClick={() => select(i.id)}
              className={`flex min-h-[4.25rem] items-center gap-3 rounded border px-3.5 py-3 text-left transition-colors ${
                on ? "border-navy-900 bg-navy-900 text-white" : "border-line bg-white text-navy-950 hover:border-navy-700"
              }`}
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded ${on ? "bg-white/10" : "bg-navy-50 text-navy-800"}`}>
                <IndustryIcon name={i.icon} className="h-[18px] w-[18px]" />
              </span>
              <span className="text-[0.88rem] font-semibold leading-tight">{i.name}</span>
            </button>
          );
        })}
      </div>

      <div id="industry-panel" role="tabpanel" aria-labelledby={`tab-${ind.id}`} className="mt-8">
        <div className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted">
              {list.length} packaging solutions for {ind.shortName}
            </p>
            <h3 className="mt-2 font-display text-[1.35rem] font-semibold leading-snug text-navy-950">{ind.headline}</h3>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link href={`/industries/${ind.slug}`} className="btn btn-outline btn-sm">
              {ind.shortName} packaging guide
            </Link>
            <Link href={`/request-a-quote?industry=${ind.id}`} className="btn btn-primary btn-sm">
              Request a Quote
            </Link>
          </div>
        </div>

        <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((c) => (
            <li key={c.slug} className="reveal"><ProductCard card={c} industry={ind.id} /></li>
          ))}
          <li className="reveal">
            <div className="flex h-full flex-col justify-between rounded-md border border-dashed border-navy-200 bg-navy-50 p-6">
              <div>
                <MessageSquareText className="h-7 w-7 text-navy-700" aria-hidden />
                <p className="eyebrow mt-5">Have a different requirement?</p>
                <p className="mt-2 font-display text-lg font-semibold leading-snug text-navy-950">Tell us what you need.</p>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-2">
                  Share your specifications, photographs or drawings. Our team would be happy to help.
                </p>
              </div>
              <Link href={`/custom-requirement?industry=${ind.id}`} className="btn btn-navy btn-sm mt-6">
                Discuss Your Custom Requirement
              </Link>
            </div>
          </li>
        </ul>

        {list.length > INITIAL && (
          <div className="mt-8 flex justify-center">
            <button type="button" className="btn btn-outline" onClick={() => setExpanded((e) => !e)} aria-expanded={expanded}>
              {expanded ? "Show fewer" : `Show all ${list.length} solutions`} <ArrowRight className={`h-4 w-4 transition-transform ${expanded ? "-rotate-90" : "rotate-90"}`} aria-hidden />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
