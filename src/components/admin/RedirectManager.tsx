"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { addRedirectAction, deleteRedirectAction } from "@/app/admin/(panel)/seo/actions";
import { toast } from "./Toast";

export function RedirectManager({ redirects }: { redirects: { id: number; fromPath: string; toPath: string; permanent: boolean; hits: number; note: string | null }[] }) {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [perm, setPerm] = useState(true);
  const [pending, start] = useTransition();
  return (
    <section className="rounded-[3px] border border-line bg-white p-5">
      <h2 className="font-display text-lg font-bold">Redirects ({redirects.length})</h2>
      <p className="mt-1 text-sm">301 redirects are created automatically when a product, segment, industry, page or article URL changes. Add manual redirects for retired pages.</p>
      <form className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto_auto]" onSubmit={(e) => { e.preventDefault(); start(async () => { const r = await addRedirectAction(from, to, perm); toast(r.ok ? r.message ?? "Saved." : r.error, r.ok ? "ok" : "error"); if (r.ok) { setFrom(""); setTo(""); router.refresh(); } }); }}>
        <input aria-label="From path" required className="field !min-h-10 text-sm" placeholder="/old-path" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input aria-label="To path" required className="field !min-h-10 text-sm" placeholder="/new-path" value={to} onChange={(e) => setTo(e.target.value)} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={perm} onChange={(e) => setPerm(e.target.checked)} className="accent-[var(--c-red)]" />Permanent (301)</label>
        <button type="submit" className="btn btn-sm" disabled={pending}><span>Add redirect</span></button>
      </form>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="text-left text-xs uppercase text-muted"><tr><th className="py-2">From</th><th className="py-2">To</th><th className="py-2">Type</th><th className="py-2">Hits</th><th /></tr></thead>
          <tbody className="divide-y divide-line">
            {redirects.map((r) => (
              <tr key={r.id}><td className="py-2 font-mono text-xs">{r.fromPath}</td><td className="py-2 font-mono text-xs">{r.toPath}</td><td className="py-2">{r.permanent ? "301" : "302"}</td><td className="py-2">{r.hits}</td><td className="py-2 text-right"><button type="button" aria-label="Delete redirect" className="p-1 text-muted hover:text-red" onClick={() => start(async () => { const x = await deleteRedirectAction(r.id); toast(x.ok ? x.message ?? "Removed." : x.error, x.ok ? "ok" : "error"); if (x.ok) router.refresh(); })}><Trash2 className="size-4" /></button></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
