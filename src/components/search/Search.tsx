"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Search as SearchIcon, X } from "lucide-react";
import type { ClientIndex } from "@/data/catalog";
import { track } from "@/lib/track";

const CAT_NAME: Record<string, string> = { paper: "Paper", plastic: "Plastic & Films", compostable: "Compostable", corrugated: "Corrugated" };

/** Scores products and operators against a query (name > keywords > description). Shared with the search page. */
export function searchIndex(index: ClientIndex, q: string) {
  const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return { products: [], operators: [] };
  const score = (name: string, extra: string) => terms.reduce((s, t) => { const n = name.toLowerCase(); if (n.startsWith(t)) return s + 6; if (n.includes(t)) return s + 4; if (extra.includes(t)) return s + 2; return s - 3; }, 0);
  const products = index.products.map((p) => ({ p, s: score(p.n, `${p.k} ${p.d.toLowerCase()} ${CAT_NAME[p.c].toLowerCase()}`) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).map((x) => x.p);
  const operators = index.operators.map((o) => ({ o, s: score(o.n, o.ind.toLowerCase()) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).map((x) => x.o);
  return { products, operators };
}

export function SearchDialog({ index }: { index: ClientIndex }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); } if (e.key === "Escape") setOpen(false); };
    window.addEventListener("merova:search", onOpen); window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("merova:search", onOpen); window.removeEventListener("keydown", onKey); };
  }, []);
  useEffect(() => { if (open) setTimeout(() => input.current?.focus(), 20); else setQ(""); }, [open]);
  useEffect(() => { if (q.length > 2) { const t = setTimeout(() => track("search", { term: q }), 800); return () => clearTimeout(t); } }, [q]);

  const res = useMemo(() => searchIndex(index, q), [index, q]);
  const flat = [...res.products.slice(0, 7).map((p) => ({ u: p.u, n: p.n })), ...res.operators.slice(0, 4).map((o) => ({ u: o.u, n: o.n }))];
  const go = (u: string, n: string) => { track("search_click", { term: q, result: n }); setOpen(false); router.push(u); };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center p-3 pt-[8vh] sm:p-6 sm:pt-[12vh]" role="dialog" aria-modal="true" aria-label="Search">
      <div className="fade-in absolute inset-0 bg-ink/45 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
      <div className="pop-in relative w-full max-w-2xl overflow-hidden rounded-[24px] bg-cloud shadow-[var(--shadow-pop)]">
        <div className="flex items-center gap-3 border-b border-line px-5">
          <SearchIcon className="h-5 w-5 text-stone" aria-hidden />
          <input ref={input} value={q} onChange={(e) => { setQ(e.target.value); setSel(0); }} placeholder="Search products, materials or your business…" className="h-16 flex-1 bg-transparent text-lg outline-none placeholder:text-stone" aria-label="Search"
            onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, flat.length - 1)); } if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); } if (e.key === "Enter") { if (flat[sel]) go(flat[sel].u, flat[sel].n); else if (q) { setOpen(false); router.push(`/search/?q=${encodeURIComponent(q)}`); } } }} />
          <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label="Close search"><X className="h-5 w-5" /></button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {!q && (
            <div className="p-3">
              <p className="eyebrow eyebrow-muted">Popular</p>
              <div className="mt-3 flex flex-wrap gap-2">{["Popcorn tubs", "BOPP HST", "5 ply box", "Sweet box", "Compostable bags", "Paper cups", "Labels", "Cinema"].map((t) => <button key={t} type="button" className="chip" onClick={() => setQ(t)}>{t}</button>)}</div>
            </div>
          )}
          {q && !flat.length && <p className="p-4 text-sm text-stone">No matches for “{q}”. Try a material (paper, film, corrugated) or <Link href="/custom-packaging/" onClick={() => setOpen(false)} className="font-semibold text-red">describe your requirement</Link>.</p>}
          {res.products.length > 0 && <p className="eyebrow eyebrow-muted px-3 pb-2 pt-3">Products</p>}
          <ul>
            {res.products.slice(0, 7).map((p, i) => (
              <li key={p.id}>
                <button type="button" onClick={() => go(p.u, p.n)} onMouseEnter={() => setSel(i)} className={`flex w-full items-center gap-4 rounded-2xl p-2 text-left ${sel === i ? "bg-white shadow-[var(--shadow-rest)]" : ""}`}>
                  <Image src={p.i} alt="" width={96} height={72} className="h-14 w-[72px] flex-none rounded-xl bg-sand object-cover" />
                  <span className="min-w-0 flex-1"><span className="block font-semibold text-ink">{p.n}</span><span className="block truncate text-sm text-stone">{CAT_NAME[p.c]} · {p.s}</span></span>
                  <ArrowRight className="h-4 w-4 text-red" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
          {res.operators.length > 0 && <p className="eyebrow eyebrow-muted px-3 pb-2 pt-4">Packaging for your business</p>}
          <ul>
            {res.operators.slice(0, 4).map((o, j) => { const i = Math.min(res.products.length, 7) + j; return (
              <li key={o.id}><button type="button" onClick={() => go(o.u, o.n)} onMouseEnter={() => setSel(i)} className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left ${sel === i ? "bg-white shadow-[var(--shadow-rest)]" : ""}`}><span><span className="font-semibold">{o.n}</span> <span className="text-sm text-stone">· {o.ind}</span></span><ArrowRight className="h-4 w-4 text-red" /></button></li>
            ); })}
          </ul>
          {q && <Link href={`/search/?q=${encodeURIComponent(q)}`} onClick={() => setOpen(false)} className="mt-2 block rounded-2xl px-4 py-3 text-sm font-semibold text-red hover:bg-white">See all results for “{q}” →</Link>}
        </div>
        <p className="border-t border-line px-5 py-3 text-xs text-stone">Tip: press <kbd className="rounded border border-line bg-white px-1.5">Ctrl</kbd> <kbd className="rounded border border-line bg-white px-1.5">K</kbd> to search from anywhere.</p>
      </div>
    </div>
  );
}
