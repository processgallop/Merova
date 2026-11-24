"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProductExplorer } from "@/components/product/Explorer";
import { searchIndex } from "@/components/search/Search";
import type { ClientIndex } from "@/data/catalog";

export function SearchResults({ index }: { index: ClientIndex }) {
  const q = useSearchParams().get("q") ?? "";
  const ops = searchIndex(index, q).operators;
  return (
    <div className="grid gap-8">
      {ops.length > 0 && <div><p className="eyebrow">Packaging for your business</p><div className="mt-3 flex flex-wrap gap-2">{ops.slice(0, 8).map((o) => <Link key={o.id} href={o.u} className="chip">{o.n}</Link>)}</div></div>}
      <ProductExplorer key={q} index={index} initialQuery={q} />
    </div>
  );
}
