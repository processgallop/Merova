"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { ClientIndex } from "@/data/catalog";
import { AddToEnquiry } from "@/components/basket/Basket";
import { searchIndex } from "@/components/search/Search";

const CATS = [["", "All"], ["paper", "Paper"], ["plastic", "Plastic & Films"], ["compostable", "Compostable"], ["corrugated", "Corrugated"]] as const;

export function ProductExplorer({ index, initialCat = "", initialQuery = "" }: { index: ClientIndex; initialCat?: string; initialQuery?: string }) {
  const [cat, setCat] = useState(initialCat);
  const [q, setQ] = useState(initialQuery);
  const list = useMemo(() => (q.trim() ? searchIndex(index, q).products : index.products).filter((p) => !cat || p.c === cat), [index, q, cat]);
  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Filter products</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by name, material or use: e.g. mithai, BOPP, 5 ply, courier" className="input !pl-12" />
        </label>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">{CATS.map(([id, n]) => <button key={id} type="button" aria-pressed={cat === id} onClick={() => setCat(id)} className="chip !min-h-11 flex-none !px-4">{n}</button>)}</div>
      </div>
      <p className="mt-4 text-sm text-stone tnum" aria-live="polite">{list.length} products</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((p) => (
          <li key={p.id} className="group flex items-center gap-3 rounded-[20px] border border-line bg-white p-2 pr-3 transition-shadow hover:shadow-[var(--shadow-lift)]">
            <Image src={p.i} alt="" width={120} height={90} className="h-[68px] w-[90px] flex-none rounded-[14px] bg-sand object-cover" />
            <Link href={p.u} className="min-w-0 flex-1"><span className="block font-semibold leading-tight group-hover:text-red">{p.n}</span><span className="mt-1 block truncate text-xs text-stone">{p.s}</span></Link>
            <AddToEnquiry id={p.id} name={p.n} compact />
          </li>
        ))}
      </ul>
      {!list.length && <p className="mt-6 rounded-2xl bg-sand p-6 text-charcoal">Nothing matches. Try another word, or <Link href="/custom-packaging/" className="font-semibold text-red">describe your requirement</Link>.</p>}
    </div>
  );
}
