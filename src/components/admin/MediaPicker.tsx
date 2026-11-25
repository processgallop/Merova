"use client";
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from "react";
import { Check, FileText, Loader2, Search, Upload, X } from "lucide-react";
import { toast } from "./Toast";

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  mime: string;
  alt: string;
  title: string;
  folder: string;
  isStock: boolean;
  credit: string | null;
  size: number;
  width: number | null;
  height: number | null;
}

export async function uploadFile(file: File, folder = "general", alt = ""): Promise<MediaItem | null> {
  const fd = new FormData();
  fd.set("file", file);
  fd.set("folder", folder);
  fd.set("alt", alt);
  const res = await fetch("/api/admin/media", { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    toast(data.error || "Upload failed.", "error");
    return null;
  }
  return data.item as MediaItem;
}

/** Modal to choose an existing asset or upload a new one. */
export function MediaPicker({ open, onClose, onPick, accept = "image" }: { open: boolean; onClose: () => void; onPick: (m: MediaItem) => void; accept?: "image" | "pdf" | "any" }) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setBusy(true);
    const res = await fetch(`/api/admin/media?q=${encodeURIComponent(q)}&type=${accept}`);
    const data = await res.json().catch(() => ({ items: [] }));
    setItems(data.items ?? []);
    setBusy(false);
  }, [q, accept]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(load, 200);
    return () => clearTimeout(t);
  }, [open, load]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Choose media" className="flex max-h-[85vh] w-full max-w-4xl flex-col bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-line p-4">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search media…" className="field !min-h-10 !pl-9" aria-label="Search media" />
          </div>
          <label className="btn btn-sm cursor-pointer">
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}<span>Upload</span>
            <input
              type="file"
              className="sr-only"
              accept={accept === "pdf" ? "application/pdf" : accept === "image" ? "image/*" : undefined}
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (!f) return;
                setUploading(true);
                const m = await uploadFile(f, accept === "pdf" ? "documents" : "general", f.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
                setUploading(false);
                if (m) {
                  toast("Uploaded.");
                  onPick(m);
                }
              }}
            />
          </label>
          <button type="button" onClick={onClose} className="flex size-10 items-center justify-center" aria-label="Close"><X className="size-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {busy ? <p className="flex items-center gap-2 text-sm text-muted"><Loader2 className="size-4 animate-spin" /> Loading…</p> : null}
          {!busy && !items.length ? <p className="text-sm text-muted">No media found. Upload a file to add it to the library.</p> : null}
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {items.map((m) => (
              <li key={m.id}>
                <button type="button" onClick={() => onPick(m)} className="group block w-full text-left">
                  <div className="relative aspect-square overflow-hidden border border-line bg-[#f5f1eb] group-hover:border-red">
                    {m.mime.startsWith("image/") ? <img src={m.url} alt="" className="size-full object-cover" loading="lazy" /> : <FileText className="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 text-muted" />}
                    {m.isStock ? <span className="absolute left-1 top-1 bg-black/60 px-1.5 py-0.5 text-[9px] uppercase text-white">Stock</span> : null}
                    <span className="absolute inset-0 hidden items-center justify-center bg-red/70 text-white group-hover:flex"><Check className="size-6" /></span>
                  </div>
                  <p className="mt-1 truncate text-xs">{m.title || m.filename}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
