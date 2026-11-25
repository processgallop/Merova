"use client";
/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { FileText, Loader2, Search, Upload, X } from "lucide-react";
import { deleteMediaAction, mediaUsageAction, swapMediaAction, updateMediaAction } from "@/app/admin/(panel)/media/actions";
import { MediaPicker, uploadFile, type MediaItem } from "./MediaPicker";
import { toast } from "./Toast";

type Item = MediaItem & { description: string; sourceUrl: string; license: string; createdAt: string };

export function MediaLibrary({ items }: { items: Item[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [folder, setFolder] = useState("");
  const [kind, setKind] = useState("");
  const [sel, setSel] = useState<Item | null>(null);
  const [uploading, setUploading] = useState(false);
  const folders = [...new Set(items.map((i) => i.folder))].sort();
  const visible = useMemo(() => items.filter((i) => (!q || `${i.filename} ${i.title} ${i.alt}`.toLowerCase().includes(q.toLowerCase())) && (!folder || i.folder === folder) && (!kind || (kind === "stock" ? i.isStock : kind === "pdf" ? i.mime === "application/pdf" : kind === "image" ? i.mime.startsWith("image/") : true))), [items, q, folder, kind]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Media library</h1>
          <p className="mt-1 max-w-2xl text-sm">Images, PDFs and video used across the site. Uploads are optimised automatically (WebP, max 2400 px). Stock images are flagged so they are never presented as Merova&apos;s own facilities or products.</p>
        </div>
        <label className="btn btn-sm cursor-pointer">
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}<span>Upload files</span>
          <input type="file" multiple className="sr-only" accept="image/*,application/pdf,video/mp4" onChange={async (e) => { const files = [...(e.target.files ?? [])]; e.target.value = ""; setUploading(true); let n = 0; for (const f of files) if (await uploadFile(f, folder || "general", f.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "))) n++; setUploading(false); if (n) { toast(`${n} file(s) uploaded.`); router.refresh(); } }} />
        </label>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative min-w-[220px] flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search media…" aria-label="Search media" className="field !min-h-10 !pl-9 text-sm" /></div>
        <select value={folder} onChange={(e) => setFolder(e.target.value)} className="field !min-h-10 !w-auto text-sm" aria-label="Folder"><option value="">All folders</option>{folders.map((f) => <option key={f}>{f}</option>)}</select>
        <select value={kind} onChange={(e) => setKind(e.target.value)} className="field !min-h-10 !w-auto text-sm" aria-label="Type"><option value="">All types</option><option value="image">Images</option><option value="pdf">PDFs</option><option value="stock">Stock images</option></select>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
        {visible.map((m) => (
          <li key={m.id}>
            <button type="button" onClick={() => setSel(m)} className="group block w-full text-left">
              <div className="relative aspect-square overflow-hidden border border-line bg-white group-hover:border-red">
                {m.mime.startsWith("image/") ? <img src={m.url} alt="" className="size-full object-cover" loading="lazy" /> : <FileText className="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 text-muted" />}
                {m.isStock ? <span className="absolute left-1 top-1 bg-black/60 px-1.5 py-0.5 text-[9px] uppercase text-white">Stock</span> : null}
                {!m.alt && m.mime.startsWith("image/") ? <span className="absolute bottom-1 left-1 bg-red px-1.5 py-0.5 text-[9px] uppercase text-white">No alt</span> : null}
              </div>
              <p className="mt-1 truncate text-xs text-heading">{m.title || m.filename}</p>
              <p className="text-[10px] text-muted">{m.folder}</p>
            </button>
          </li>
        ))}
      </ul>
      {sel ? <Detail item={sel} onClose={() => setSel(null)} onChanged={() => { setSel(null); router.refresh(); }} /> : null}
    </div>
  );
}

function Detail({ item, onClose, onChanged }: { item: Item; onClose: () => void; onChanged: () => void }) {
  const [d, setD] = useState({ title: item.title, alt: item.alt, description: item.description, credit: item.credit ?? "", sourceUrl: item.sourceUrl, license: item.license, folder: item.folder, isStock: item.isStock });
  const [usage, setUsage] = useState<string[] | null>(null);
  const [swap, setSwap] = useState(false);
  const [pending, start] = useTransition();
  const run = (fn: () => Promise<{ ok: boolean; error?: string; message?: string }>, after?: () => void) => start(async () => { const r = await fn(); toast(r.ok ? r.message ?? "Done." : r.error ?? "Failed.", r.ok ? "ok" : "error"); if (r.ok) after?.(); });
  const isDb = item.url.startsWith("/media/");
  return (
    <div className="fixed inset-0 z-[80] flex justify-end bg-black/40" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Media details" className="h-full w-full max-w-lg overflow-y-auto bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between"><h2 className="font-display text-xl font-bold">Media details</h2><button type="button" onClick={onClose} aria-label="Close"><X className="size-5" /></button></div>
        <div className="mt-4 bg-[#f5f1eb]">{item.mime.startsWith("image/") ? <img src={item.url} alt="" className="mx-auto max-h-64 object-contain" /> : <a href={item.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-6 underline"><FileText className="size-5" />{item.filename}</a>}</div>
        <p className="mt-2 text-xs text-muted">{item.filename} · {item.mime} · {Math.round(item.size / 1024)} KB{item.width ? ` · ${item.width}×${item.height}` : ""}</p>
        <p className="mt-1 break-all text-xs"><span className="text-muted">URL:</span> <code>{item.url}</code></p>
        <div className="mt-5 grid gap-3 text-sm">
          {(["title", "alt", "description", "credit", "sourceUrl", "license", "folder"] as const).map((k) => (
            <label key={k}><span className="field-label">{{ title: "Title", alt: "Alt text", description: "Description", credit: "Credit", sourceUrl: "Source URL", license: "Licence", folder: "Folder" }[k]}</span><input className="field !min-h-10" value={d[k]} onChange={(e) => setD({ ...d, [k]: e.target.value })} /></label>
          ))}
          <label className="flex items-center gap-2"><input type="checkbox" checked={d.isStock} onChange={(e) => setD({ ...d, isStock: e.target.checked })} className="accent-[var(--c-red)]" />Stock / representative image (captioned as representative on the site)</label>
          <button type="button" className="btn btn-sm" disabled={pending} onClick={() => run(() => updateMediaAction(item.id, d), onChanged)}><span>Save details</span></button>
        </div>
        <div className="mt-6 border-t border-line pt-5">
          <p className="font-semibold text-heading">Where it is used</p>
          {usage ? (usage.length ? <ul className="mt-2 list-disc pl-5 text-sm">{usage.map((u) => <li key={u}>{u}</li>)}</ul> : <p className="mt-2 text-sm text-muted">Not used anywhere — safe to delete.</p>) : <button type="button" className="btn btn-outline btn-sm mt-2" onClick={() => start(async () => { const r = await mediaUsageAction(item.id); if (r.ok) setUsage(r.data ?? []); else toast(r.error, "error"); })}><span>Check usage</span></button>}
        </div>
        <div className="mt-6 grid gap-2 border-t border-line pt-5">
          <p className="font-semibold text-heading">Replace</p>
          {isDb ? (
            <label className="btn btn-outline btn-sm cursor-pointer"><Upload className="size-4" /><span>Upload a new version (keeps the same URL)</span><input type="file" className="sr-only" onChange={async (e) => { const f = e.target.files?.[0]; e.target.value = ""; if (!f) return; const fd = new FormData(); fd.set("file", f); fd.set("replaceId", item.id); const res = await fetch("/api/admin/media", { method: "POST", body: fd }); const j = await res.json(); toast(res.ok ? "File replaced everywhere it is used." : j.error, res.ok ? "ok" : "error"); if (res.ok) onChanged(); }} /></label>
          ) : null}
          <button type="button" className="btn btn-outline btn-sm" onClick={() => setSwap(true)}><span>Replace everywhere with another library image</span></button>
          <p className="text-xs text-muted">Use this to swap stock or rendered imagery for authentic Merova photography across every page at once.</p>
          <MediaPicker open={swap} onClose={() => setSwap(false)} accept="any" onPick={(m) => { setSwap(false); if (window.confirm(`Replace every use of “${item.filename}” with “${m.filename}”?`)) run(() => swapMediaAction(item.id, m.id), onChanged); }} />
        </div>
        <div className="mt-6 border-t border-line pt-5">
          <button type="button" className="btn btn-outline btn-sm !text-red" disabled={pending} onClick={() => window.confirm("Delete this file? Files in use cannot be deleted.") && run(() => deleteMediaAction(item.id), onChanged)}><span>Delete file</span></button>
        </div>
      </div>
    </div>
  );
}
