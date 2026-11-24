"use client";
import Image from "next/image";
import { useState } from "react";
import { Download } from "lucide-react";
import { track } from "@/lib/track";

export function DownloadFilter({ items, cats }: { items: { id: string; n: string; c: string; href: string; size?: string; i: string }[]; cats: { id: string; n: string }[] }) {
  const [c, setC] = useState("");
  const list = items.filter((x) => !c || x.c === c);
  return (
    <>
      <div className="flex flex-wrap gap-2">{[{ id: "", n: "All" }, ...cats].map((x) => <button key={x.id} type="button" aria-pressed={c === x.id} onClick={() => setC(x.id)} className="chip">{x.n}</button>)}</div>
      <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((x) => <li key={x.id}><a href={x.href} download onClick={() => track("download", { type: "flyer", product: x.id })} className="group flex items-center gap-3 rounded-2xl bg-white p-2 pr-4 hover:shadow-[var(--shadow-lift)]"><Image src={x.i} alt="" width={80} height={60} className="h-12 w-16 rounded-xl object-cover" /><span className="min-w-0 flex-1"><span className="block truncate font-semibold group-hover:text-red">{x.n}</span><span className="text-xs text-stone">Flyer · PDF{x.size ? ` · ${x.size}` : ""}</span></span><Download className="h-4 w-4 text-red" /></a></li>)}
      </ul>
    </>
  );
}
