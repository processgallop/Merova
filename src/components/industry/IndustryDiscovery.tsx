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
              className={`flex min-h-[4.25rem] items-center gap-3 rounded-sm border px-3.5 py-3 text-left transition-all duration-300 ${
                on ? "border-red-500 bg-red-500 text-white shadow-[0_14px_30px_-16px_rgb(213_43_30/0.8)]" : "border-line bg-white text-char-900 hover:border-red-400 hover:text-red-600"
              }`}
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-sm ${on ? "bg-white/15" : "bg-red-50 text-red-600"}`}>
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
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-red-600">
              {list.length} packaging solutions for {ind.shortName}
            </p>
            <h3 className="mt-2 font-display text-[1.5rem] font-semibold leading-snug text-char-900">{ind.headline}</h3>
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
            <div className="surface-red-deep relative flex h-full flex-col justify-between overflow-hidden rounded-sm p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/brand/merova-mark-cream.svg" alt="" aria-hidden="true" className="glyph-watermark -bottom-6 -right-10 w-64" />
              <div className="relative">
                <MessageSquareText className="h-7 w-7" aria-hidden />
                <p className="eyebrow eyebrow-light mt-5">Have a different requirement?</p>
                <p className="mt-2 font-display text-xl font-semibold leading-snug">Tell us what you need.</p>
                <p className="mt-2 text-[0.92rem] leading-relaxed">
                  Share your specifications, photographs or drawings. Our team would be happy to help.
                </p>
              </div>
              <Link href={`/custom-requirement?industry=${ind.id}`} className="btn btn-cloud btn-sm relative mt-6">
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
