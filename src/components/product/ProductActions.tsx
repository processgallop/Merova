"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Download } from "lucide-react";
import { AddToEnquiry } from "@/components/basket/Basket";
import { track } from "@/lib/track";

export function ProductActions({ id, name, variants, flyer }: { id: string; name: string; variants: string[]; flyer: string }) {
  const [v, setV] = useState<string>("");
  return (
    <div className="grid gap-6">
      {variants.length > 0 && (
        <fieldset>
          <legend className="text-[13px] font-semibold text-ink">Variant <span className="font-normal text-stone">(optional, refine at quotation)</span></legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {variants.map((x) => <button key={x} type="button" aria-pressed={v === x} onClick={() => setV(v === x ? "" : x)} className="chip">{x}</button>)}
          </div>
        </fieldset>
      )}
      <div className="flex flex-wrap gap-3">
        <AddToEnquiry id={id} name={name} variant={v || undefined} className="btn btn-primary btn-lg" />
        <Link href={`/request-a-quote/?add=${id}${v ? `&variant=${encodeURIComponent(v)}` : ""}`} className="btn btn-dark btn-lg">Request a custom quote <ArrowRight className="arrow h-4 w-4" /></Link>
        <a href={flyer} download onClick={() => track("download", { type: "flyer", product: id })} className="btn btn-outline btn-lg"><Download className="h-4 w-4" /> Product flyer</a>
      </div>
    </div>
  );
}
