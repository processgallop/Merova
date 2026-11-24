"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { AddKit } from "@/components/basket/Basket";
import { track } from "@/lib/track";

export interface FinderData {
  industries: { id: string; name: string; url: string; ops: { id: string; name: string; url: string; primary: string[]; secondary: string[] }[] }[];
  products: Record<string, { n: string; u: string; i: string; c: string }>;
  cats: { id: string; name: string; accent: string }[];
}

export function IndustryFinder({ data }: { data: FinderData }) {
  const [ind, setInd] = useState(0);
  const [op, setOp] = useState(2);
  const I = data.industries[ind];
  const O = I.ops[Math.min(op, I.ops.length - 1)];
  return (
    <div className="grid min-w-0 grid-cols-1 gap-6">
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="Industry">
        {data.industries.map((d, i) => (
          <button key={d.id} type="button" aria-pressed={i === ind} className="chip !min-h-11 flex-none !px-5 !text-[14px]" onClick={() => { setInd(i); setOp(0); track("industry_select", { industry: d.id }); }}>{d.name}</button>
        ))}
      </div>
      <div className="rounded-[28px] border border-line bg-white p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Business type">
          {I.ops.map((o, i) => (
            <button key={o.id} type="button" onClick={() => setOp(i)} className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${O.id === o.id ? "border-red bg-red text-white" : "border-line bg-cloud hover:border-ink"}`}>{o.name}</button>
          ))}
        </div>
        <div key={O.id} className="fade-in mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {data.cats.map((c) => {
            const pr = O.primary.filter((id) => data.products[id]?.c === c.id);
            const se = O.secondary.filter((id) => data.products[id]?.c === c.id);
            return (
              <div key={c.id} className="mat-rule rounded-[20px] bg-cloud p-5" style={{ ["--mat" as string]: c.accent }}>
                <p className="flex items-center gap-2 text-[13px] font-semibold"><span className="mat-dot" style={{ ["--mat" as string]: c.accent }} />{c.name}</p>
                {pr.length + se.length === 0 ? <p className="mt-4 text-sm text-stone">Not typically needed.</p> : (
                  <ul className="mt-4 grid gap-2">
                    {pr.map((id) => (
                      <li key={id}><Link href={data.products[id].u} className="group flex items-center gap-3 rounded-xl bg-white p-1.5 pr-3 shadow-[var(--shadow-rest)] hover:shadow-[var(--shadow-lift)]"><Image src={data.products[id].i} alt="" width={72} height={54} className="h-11 w-14 flex-none rounded-lg object-cover" /><span className="text-[14px] font-medium leading-tight group-hover:text-red">{data.products[id].n}</span></Link></li>
                    ))}
                    {se.length > 0 && <li className="pt-1 text-[12.5px] text-stone">Also: {se.map((id, k) => <span key={id}>{k > 0 && ", "}<Link href={data.products[id].u} className="underline-offset-2 hover:text-red hover:underline">{data.products[id].n}</Link></span>)}</li>}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href={O.url} className="link-arrow">See the full guide for {O.name.toLowerCase()} <ArrowRight className="h-4 w-4" /></Link>
          <AddKit ids={O.primary} label={O.name} industry={I.name} operator={O.name} />
        </div>
      </div>
    </div>
  );
}
