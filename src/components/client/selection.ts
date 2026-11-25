"use client";
import { useCallback, useSyncExternalStore } from "react";
import { track } from "@/lib/track";

/**
 * Products a visitor has selected for one consolidated enquiry. This is a
 * per-visitor convenience held in the browser only; the enquiry itself is
 * stored server-side when submitted.
 */
export interface Picked {
  slug: string;
  name: string;
  segment: string;
  image?: string;
}

const KEY = "merova:selection";
const EVT = "merova:selection";
let cache: Picked[] | null = null;
const EMPTY: Picked[] = [];

function read(): Picked[] {
  if (cache) return cache;
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    cache = Array.isArray(v) ? v.filter((x) => x && typeof x.slug === "string").slice(0, 20) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(list: Picked[]) {
  cache = list;
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable — selection still works for this page view */
  }
  window.dispatchEvent(new Event(EVT));
}

function subscribe(cb: () => void) {
  const on = (e: Event) => {
    if (e instanceof StorageEvent && e.key !== KEY) return;
    if (e instanceof StorageEvent) cache = null;
    cb();
  };
  window.addEventListener(EVT, on);
  window.addEventListener("storage", on);
  return () => {
    window.removeEventListener(EVT, on);
    window.removeEventListener("storage", on);
  };
}

export function useSelection() {
  const list = useSyncExternalStore(subscribe, read, () => EMPTY);
  const toggle = useCallback((p: Picked) => {
    const cur = read();
    const has = cur.some((x) => x.slug === p.slug);
    write(has ? cur.filter((x) => x.slug !== p.slug) : [...cur, p].slice(0, 20));
    track(has ? "product_unselect" : "product_select", { product: p.slug, selected_count: has ? cur.length - 1 : cur.length + 1 });
  }, []);
  const clear = useCallback(() => write([]), []);
  const remove = useCallback((slug: string) => write(read().filter((x) => x.slug !== slug)), []);
  const has = useCallback((slug: string) => list.some((x) => x.slug === slug), [list]);
  return { list, toggle, clear, remove, has };
}
