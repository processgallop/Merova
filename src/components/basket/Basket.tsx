"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Plus, ShoppingBag, X } from "lucide-react";
import { track } from "@/lib/track";

export interface BasketItem { id: string; variant?: string; addedAt: number }
interface Ctx {
  items: BasketItem[];
  has: (id: string) => boolean;
  add: (id: string, variant?: string, name?: string) => void;
  addMany: (ids: string[], label?: string) => void;
  remove: (id: string) => void;
  setVariant: (id: string, variant: string) => void;
  clear: () => void;
  context: { industry?: string; operator?: string };
  setContext: (c: { industry?: string; operator?: string }) => void;
  ready: boolean;
}

const KEY = "merova-basket-v1";
const BasketCtx = createContext<Ctx | null>(null);
const read = () => { try { const v = JSON.parse(localStorage.getItem(KEY) ?? "null"); if (v && Array.isArray(v.items) && Date.now() - (v.t ?? 0) < 30 * 864e5) return v; } catch {} return { items: [], context: {} }; };

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [context, setCtx] = useState<{ industry?: string; operator?: string }>({});
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<{ text: string; key: number } | null>(null);

  useEffect(() => {
    const v = read();
    // Hydrate from localStorage (external store) after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(v.items); setCtx(v.context ?? {}); setReady(true);
    const onStorage = (e: StorageEvent) => { if (e.key === KEY) { const n = read(); setItems(n.items); setCtx(n.context ?? {}); } };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  useEffect(() => { if (!ready) return; try { localStorage.setItem(KEY, JSON.stringify({ items, context, t: Date.now() })); } catch {} window.dispatchEvent(new CustomEvent("merova:basket", { detail: items.length })); }, [items, context, ready]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 3200); return () => clearTimeout(t); }, [toast]);

  const add = useCallback((id: string, variant?: string, name?: string) => {
    setItems((cur) => (cur.some((i) => i.id === id) ? cur.map((i) => (i.id === id && variant ? { ...i, variant } : i)) : [...cur, { id, variant, addedAt: Date.now() }]));
    setToast({ text: `${name ?? "Product"} added to your enquiry`, key: Date.now() });
    track("add_to_enquiry", { product: id, variant });
  }, []);
  const addMany = useCallback((ids: string[], label?: string) => {
    setItems((cur) => [...cur, ...ids.filter((id) => !cur.some((i) => i.id === id)).map((id) => ({ id, addedAt: Date.now() }))]);
    setToast({ text: `${ids.length} products added${label ? ` for ${label}` : ""}`, key: Date.now() });
    track("add_to_enquiry", { products: ids.join(","), count: ids.length });
  }, []);
  const value = useMemo<Ctx>(() => ({
    items, ready, context, add, addMany,
    has: (id) => items.some((i) => i.id === id),
    remove: (id) => setItems((cur) => cur.filter((i) => i.id !== id)),
    setVariant: (id, variant) => setItems((cur) => cur.map((i) => (i.id === id ? { ...i, variant } : i))),
    clear: () => { setItems([]); setCtx({}); },
    setContext: (c) => setCtx((cur) => ({ ...cur, ...c })),
  }), [items, ready, context, add, addMany]);

  return (
    <BasketCtx.Provider value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[65] flex justify-center px-4 lg:bottom-8">
        {toast && (
          <div key={toast.key} className="pop-in pointer-events-auto flex items-center gap-3 rounded-full bg-ink py-2 pl-4 pr-2 text-sm text-white shadow-[var(--shadow-pop)]">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-red"><Check className="h-3.5 w-3.5" aria-hidden /></span>
            <span>{toast.text}</span>
            <Link href="/request-a-quote/" className="rounded-full bg-white px-3 py-1.5 font-semibold text-ink">View enquiry</Link>
            <button type="button" onClick={() => setToast(null)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10" aria-label="Dismiss"><X className="h-4 w-4" /></button>
          </div>
        )}
      </div>
    </BasketCtx.Provider>
  );
}

export function useBasket() {
  const c = useContext(BasketCtx);
  if (!c) throw new Error("useBasket must be used inside BasketProvider");
  return c;
}

export function AddToEnquiry({ id, name, variant, className = "btn btn-primary", compact = false }: { id: string; name: string; variant?: string; className?: string; compact?: boolean }) {
  const b = useBasket();
  const inBasket = b.ready && b.has(id);
  if (compact)
    return (
      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!inBasket) b.add(id, variant, name); }} aria-label={inBasket ? `${name} is in your enquiry` : `Add ${name} to enquiry`} title={inBasket ? "In your enquiry" : "Add to enquiry"}
        className={`relative z-10 grid h-11 w-11 flex-none place-items-center rounded-full transition-colors ${inBasket ? "bg-ink text-white" : "bg-red text-white hover:bg-red-700"}`}>
        {inBasket ? <Check className="h-4 w-4" aria-hidden /> : <Plus className="h-5 w-5" aria-hidden />}
      </button>
    );
  return (
    <button type="button" className={className} onClick={() => (inBasket ? b.setVariant(id, variant ?? "") : b.add(id, variant, name))} aria-pressed={inBasket}>
      {inBasket ? <Check className="h-4 w-4" aria-hidden /> : <ShoppingBag className="h-4 w-4" aria-hidden />}
      {inBasket ? "Added to enquiry" : "Add to enquiry"}
    </button>
  );
}

export function AddKit({ ids, label, industry, operator }: { ids: string[]; label: string; industry: string; operator: string }) {
  const b = useBasket();
  const missing = ids.filter((id) => !b.has(id));
  return (
    <button type="button" className="btn btn-primary btn-lg" onClick={() => { b.setContext({ industry, operator }); if (missing.length) b.addMany(missing, label); }} disabled={b.ready && missing.length === 0}>
      <ShoppingBag className="h-4 w-4" aria-hidden />
      {b.ready && missing.length === 0 ? "Complete kit in your enquiry" : `Add the complete kit (${ids.length}) to my enquiry`}
    </button>
  );
}

export function BasketCount({ className = "" }: { className?: string }) {
  const { items, ready } = useBasket();
  const [bump, setBump] = useState(0);
  useEffect(() => { if (ready && items.length) setBump((n) => n + 1); }, [items.length, ready]);
  if (!ready || !items.length) return null;
  return <span key={bump} className={`bump absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-red px-1 text-[11px] font-bold text-white tnum ${className}`}>{items.length}</span>;
}
