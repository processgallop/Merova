"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { ArrowDown, ArrowUp, FileText, GripVertical, ImagePlus, Plus, Trash2, Upload, X } from "lucide-react";
import type { ImageRef } from "@/db/types";
import { MediaPicker, uploadFile } from "./MediaPicker";
import type { AdminRefs, FieldDef } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Obj = Record<string, any>;

export const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 80);

export function Fields({ fields, value, onChange, refs, disabled }: { fields: FieldDef[]; value: Obj; onChange: (v: Obj) => void; refs?: AdminRefs; disabled?: boolean }) {
  return (
    <div className="grid gap-5">
      {fields.map((f) => (
        <FieldInput key={f.key} f={f} value={value?.[f.key]} all={value} refs={refs} disabled={disabled} onChange={(v) => onChange({ ...value, [f.key]: v })} />
      ))}
    </div>
  );
}

function Label({ f, htmlFor }: { f: FieldDef; htmlFor?: string }) {
  return (
    <div className="mb-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-semibold text-heading">{f.label}{"required" in f && f.required ? <span className="text-red"> *</span> : null}</label>
      {f.hint ? <p className="text-xs text-muted">{f.hint}</p> : null}
    </div>
  );
}

const input = "field !min-h-10 !py-2 text-[15px]";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FieldInput({ f, value, onChange, all, refs, disabled }: { f: FieldDef; value: any; onChange: (v: any) => void; all?: Obj; refs?: AdminRefs; disabled?: boolean }) {
  const id = `f-${f.key}`;
  switch (f.type) {
    case "text":
    case "url":
    case "number":
    case "date":
      return (
        <div>
          <Label f={f} htmlFor={id} />
          <input id={id} disabled={disabled} type={f.type === "number" ? "number" : f.type === "date" ? "datetime-local" : f.type === "url" ? "text" : "text"} className={input} value={value ?? ""} placeholder={f.placeholder} maxLength={f.maxLength} onChange={(e) => onChange(f.type === "number" ? (e.target.value === "" ? null : Number(e.target.value)) : e.target.value)} />
        </div>
      );
    case "slug":
      return (
        <div>
          <Label f={f} htmlFor={id} />
          <div className="flex items-center gap-2">
            {f.prefix ? <span className="whitespace-nowrap text-sm text-muted">{f.prefix}</span> : null}
            <input id={id} disabled={disabled} className={input} value={value ?? ""} onChange={(e) => onChange(e.target.value.toLowerCase().replace(/[^a-z0-9/-]/g, "-"))} />
            {f.from && all?.[f.from] ? <button type="button" className="btn btn-outline btn-sm" onClick={() => onChange(slugify(String(all[f.from!])))}>Generate</button> : null}
          </div>
        </div>
      );
    case "color":
      return (
        <div>
          <Label f={f} htmlFor={id} />
          <div className="flex items-center gap-2">
            <input type="color" aria-label={f.label} disabled={disabled} value={/^#[0-9a-f]{6}$/i.test(value ?? "") ? value : "#000000"} onChange={(e) => onChange(e.target.value)} className="h-10 w-12 cursor-pointer border border-line bg-white p-1" />
            <input id={id} disabled={disabled} className={`${input} font-mono uppercase`} value={value ?? ""} maxLength={7} onChange={(e) => onChange(e.target.value)} />
          </div>
        </div>
      );
    case "textarea":
    case "markdown":
      return (
        <div>
          <Label f={f} htmlFor={id} />
          <textarea id={id} disabled={disabled} rows={f.rows ?? (f.type === "markdown" ? 10 : 3)} className={`${input} ${f.type === "markdown" ? "font-mono text-sm" : ""}`} value={value ?? ""} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />
          {f.type === "markdown" ? <p className="mt-1 text-xs text-muted">Formatting: ## Heading · **bold** · *italic* · [link](/path) · lines starting with “- ” become a list · “&gt; ” for a highlighted note.</p> : null}
        </div>
      );
    case "select":
      return (
        <div>
          <Label f={f} htmlFor={id} />
          <select id={id} disabled={disabled} className={input} value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
            {!f.required ? <option value="">—</option> : null}
            {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      );
    case "checkbox":
      return (
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" disabled={disabled} checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="mt-1 size-4 accent-[var(--c-red)]" />
          <span><span className="text-[13px] font-semibold text-heading">{f.label}</span>{f.hint ? <span className="block text-xs text-muted">{f.hint}</span> : null}</span>
        </label>
      );
    case "list":
      return <ListField f={f} value={Array.isArray(value) ? value : []} onChange={onChange} disabled={disabled} />;
    case "pairs":
      return <PairsField f={f} value={Array.isArray(value) ? value : []} onChange={onChange} disabled={disabled} />;
    case "image":
      return (
        <div>
          <Label f={f} />
          <ImageField value={value ?? null} onChange={onChange} disabled={disabled} />
        </div>
      );
    case "images":
      return <ImagesField f={f} value={Array.isArray(value) ? value : []} onChange={onChange} disabled={disabled} />;
    case "link":
      return (
        <div>
          <Label f={f} />
          <div className="grid gap-2 sm:grid-cols-2">
            <input aria-label={`${f.label} label`} disabled={disabled} className={input} placeholder="Button label" value={value?.label ?? ""} onChange={(e) => onChange({ ...value, label: e.target.value })} />
            <input aria-label={`${f.label} destination`} disabled={disabled} className={input} placeholder="/request-a-quote" value={value?.href ?? ""} onChange={(e) => onChange({ ...value, href: e.target.value })} />
          </div>
        </div>
      );
    case "products":
    case "industries":
    case "resources": {
      const opts = f.type === "products" ? (refs?.products ?? []).map((p) => ({ value: p.slug, label: `${p.name} · ${p.segment}` })) : f.type === "industries" ? (refs?.industries ?? []).map((i) => ({ value: i.slug, label: i.name })) : (refs?.resources ?? []).map((r) => ({ value: r.slug, label: r.title }));
      return <MultiRef f={f} opts={opts} value={Array.isArray(value) ? value : []} onChange={onChange} disabled={disabled} />;
    }
    case "segmentRef":
      return (
        <div>
          <Label f={f} htmlFor={id} />
          <select id={id} disabled={disabled} className={input} value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
            <option value="">All segments</option>
            {(refs?.segments ?? []).map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
          </select>
        </div>
      );
    case "file":
      return (
        <div>
          <Label f={f} />
          <FileField value={value ?? null} onChange={onChange} disabled={disabled} />
        </div>
      );
    case "seo":
      return (
        <fieldset className="grid gap-4 border border-line bg-white p-4">
          <legend className="px-1 text-[13px] font-semibold text-heading">{f.label}</legend>
          <SeoField value={value ?? {}} onChange={onChange} disabled={disabled} />
        </fieldset>
      );
    case "group":
      return (
        <fieldset className="grid gap-4 border border-line bg-white p-4">
          <legend className="px-1 text-[13px] font-semibold text-heading">{f.label}</legend>
          <Fields fields={f.fields} value={value ?? {}} onChange={onChange} refs={refs} disabled={disabled} />
        </fieldset>
      );
  }
}

export function SeoField({ value, onChange, disabled }: { value: Obj; onChange: (v: Obj) => void; disabled?: boolean }) {
  const t = String(value.title ?? "");
  const d = String(value.description ?? "");
  return (
    <>
      <div>
        <label className="text-[13px] font-semibold text-heading" htmlFor="seo-title">SEO title</label>
        <input id="seo-title" disabled={disabled} className={input} value={t} onChange={(e) => onChange({ ...value, title: e.target.value })} />
        <p className={`mt-1 text-xs ${t.length > 65 ? "text-red" : "text-muted"}`}>{t.length}/60 characters {t ? "" : "· falls back to the page name"}</p>
      </div>
      <div>
        <label className="text-[13px] font-semibold text-heading" htmlFor="seo-desc">Meta description</label>
        <textarea id="seo-desc" disabled={disabled} rows={2} className={input} value={d} onChange={(e) => onChange({ ...value, description: e.target.value })} />
        <p className={`mt-1 text-xs ${d.length > 165 || (d && d.length < 70) ? "text-red" : "text-muted"}`}>{d.length}/155 characters {d ? "" : "· missing — add one for search results"}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="text-[13px] font-semibold text-heading" htmlFor="seo-ogt">Social share title</label><input id="seo-ogt" disabled={disabled} className={input} value={value.ogTitle ?? ""} onChange={(e) => onChange({ ...value, ogTitle: e.target.value })} /></div>
        <div><label className="text-[13px] font-semibold text-heading" htmlFor="seo-ogi">Social share image URL</label><input id="seo-ogi" disabled={disabled} className={input} value={value.ogImage ?? ""} onChange={(e) => onChange({ ...value, ogImage: e.target.value })} /></div>
      </div>
      <div><label className="text-[13px] font-semibold text-heading" htmlFor="seo-ogd">Social share description</label><input id="seo-ogd" disabled={disabled} className={input} value={value.ogDescription ?? ""} onChange={(e) => onChange({ ...value, ogDescription: e.target.value })} /></div>
      <div><label className="text-[13px] font-semibold text-heading" htmlFor="seo-can">Canonical URL (optional override)</label><input id="seo-can" disabled={disabled} className={input} placeholder="Leave blank to use this page's own URL" value={value.canonical ?? ""} onChange={(e) => onChange({ ...value, canonical: e.target.value })} /></div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" disabled={disabled} checked={Boolean(value.noindex)} onChange={(e) => onChange({ ...value, noindex: e.target.checked })} className="size-4 accent-[var(--c-red)]" />Hide from search engines (noindex)</label>
    </>
  );
}

function move<T>(arr: T[], i: number, d: number) {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

/** Sortable list with drag-and-drop plus accessible up/down buttons. */
export function Sortable<T>({ items, onChange, render, keyOf, disabled }: { items: T[]; onChange: (v: T[]) => void; render: (item: T, i: number) => React.ReactNode; keyOf: (item: T, i: number) => string; disabled?: boolean }) {
  const [drag, setDrag] = useState<number | null>(null);
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li
          key={keyOf(it, i)}
          draggable={!disabled}
          onDragStart={() => setDrag(i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (drag === null || drag === i) return;
            const next = [...items];
            const [m] = next.splice(drag, 1);
            next.splice(i, 0, m);
            onChange(next);
            setDrag(null);
          }}
          className={`flex items-start gap-2 border border-line bg-white p-2 ${drag === i ? "opacity-50" : ""}`}
        >
          <span className="mt-2 cursor-grab text-muted" aria-hidden><GripVertical className="size-4" /></span>
          <div className="min-w-0 flex-1">{render(it, i)}</div>
          {!disabled ? (
            <span className="flex flex-col">
              <button type="button" className="p-1 text-muted hover:text-heading disabled:opacity-30" disabled={i === 0} onClick={() => onChange(move(items, i, -1))} aria-label="Move up"><ArrowUp className="size-3.5" /></button>
              <button type="button" className="p-1 text-muted hover:text-heading disabled:opacity-30" disabled={i === items.length - 1} onClick={() => onChange(move(items, i, 1))} aria-label="Move down"><ArrowDown className="size-3.5" /></button>
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function ListField({ f, value, onChange, disabled }: { f: FieldDef; value: string[]; onChange: (v: string[]) => void; disabled?: boolean }) {
  const [draft, setDraft] = useState("");
  return (
    <div>
      <Label f={f} />
      <Sortable
        items={value}
        onChange={onChange}
        disabled={disabled}
        keyOf={(_, i) => String(i)}
        render={(it, i) => (
          <div className="flex items-center gap-2">
            <input aria-label={`${f.label} ${i + 1}`} disabled={disabled} className={`${input} !min-h-9`} value={it} onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))} />
            {!disabled ? <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="p-1.5 text-muted hover:text-red" aria-label="Remove"><X className="size-4" /></button> : null}
          </div>
        )}
      />
      {!disabled ? (
        <div className="mt-2 flex gap-2">
          <input className={`${input} !min-h-9`} placeholder={"placeholder" in f && f.placeholder ? f.placeholder : "Add an item and press Enter"} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (draft.trim()) { onChange([...value, draft.trim()]); setDraft(""); } } }} aria-label={`Add to ${f.label}`} />
          <button type="button" className="btn btn-outline btn-sm" onClick={() => { if (draft.trim()) { onChange([...value, draft.trim()]); setDraft(""); } }}><Plus className="size-4" /></button>
        </div>
      ) : null}
    </div>
  );
}

function PairsField({ f, value, onChange, disabled }: { f: Extract<FieldDef, { type: "pairs" }>; value: Obj[]; onChange: (v: Obj[]) => void; disabled?: boolean }) {
  return (
    <div>
      <Label f={f} />
      <Sortable
        items={value}
        onChange={onChange}
        disabled={disabled}
        keyOf={(_, i) => String(i)}
        render={(it, i) => (
          <div className="flex items-start gap-2">
            <div className={`grid flex-1 gap-2 ${f.fields.length === 2 && f.fields.every((x) => x.type === "text") ? "sm:grid-cols-2" : f.fields.length >= 3 ? "sm:grid-cols-3" : ""}`}>
              {f.fields.map((sf) =>
                sf.type === "textarea" ? (
                  <textarea key={sf.key} aria-label={sf.label} placeholder={sf.label} disabled={disabled} rows={2} className={`${input} sm:col-span-full`} value={it[sf.key] ?? ""} onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, [sf.key]: e.target.value } : x)))} />
                ) : sf.type === "select" ? (
                  <select key={sf.key} aria-label={sf.label} disabled={disabled} className={input} value={it[sf.key] ?? ""} onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, [sf.key]: e.target.value } : x)))}>
                    {sf.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : sf.type === "checkbox" ? (
                  <label key={sf.key} className="flex items-center gap-2 text-sm"><input type="checkbox" disabled={disabled} checked={Boolean(it[sf.key])} onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, [sf.key]: e.target.checked } : x)))} className="size-4 accent-[var(--c-red)]" />{sf.label}</label>
                ) : sf.type === "image" ? (
                  <div key={sf.key} className="sm:col-span-full"><ImageField value={it[sf.key] ?? null} disabled={disabled} onChange={(img) => onChange(value.map((x, j) => (j === i ? { ...x, [sf.key]: img } : x)))} /></div>
                ) : (
                  <input key={sf.key} aria-label={sf.label} placeholder={sf.label} disabled={disabled} className={input} value={it[sf.key] ?? ""} onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, [sf.key]: e.target.value } : x)))} />
                ),
              )}
            </div>
            {!disabled ? <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="mt-1.5 p-1.5 text-muted hover:text-red" aria-label="Remove"><Trash2 className="size-4" /></button> : null}
          </div>
        )}
      />
      {!disabled ? (
        <button type="button" className="btn btn-outline btn-sm mt-2" onClick={() => onChange([...value, Object.fromEntries(f.fields.map((x) => [x.key, x.type === "select" ? x.options?.[0]?.value ?? "" : x.type === "checkbox" ? false : x.type === "image" ? null : ""]))])}>
          <Plus className="size-4" /><span>{f.addLabel ?? "Add"}</span>
        </button>
      ) : null}
    </div>
  );
}

export function ImageField({ value, onChange, disabled }: { value: ImageRef | null; onChange: (v: ImageRef | null) => void; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-wrap items-start gap-4">
      <div className="relative size-28 flex-none overflow-hidden border border-line bg-[#f5f1eb]">
        {value?.url ? <img src={value.url} alt="" className="size-full object-cover" /> : <ImagePlus className="absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 text-muted" />}
      </div>
      <div className="grid min-w-[220px] flex-1 gap-2">
        <input aria-label="Alt text" disabled={disabled || !value} className={input} placeholder="Alt text (describe the image)" value={value?.alt ?? ""} onChange={(e) => value && onChange({ ...value, alt: e.target.value })} />
        <div className="flex flex-wrap items-center gap-2">
          <select aria-label="Image type" disabled={disabled || !value} className={`${input} !w-auto`} value={value?.kind ?? "representative"} onChange={(e) => value && onChange({ ...value, kind: e.target.value as ImageRef["kind"] })}>
            <option value="original">Original Merova photography</option>
            <option value="render">Product visualisation (render)</option>
            <option value="representative">Representative / stock image</option>
            <option value="illustration">Illustration</option>
          </select>
          {!disabled ? <button type="button" className="btn btn-outline btn-sm" onClick={() => setOpen(true)}><span>{value ? "Replace" : "Choose image"}</span></button> : null}
          {!disabled && value ? <button type="button" className="btn btn-outline btn-sm" onClick={() => onChange(null)}><span>Remove</span></button> : null}
        </div>
        {!value?.alt && value ? <p className="text-xs font-semibold text-red">Alt text is missing.</p> : null}
      </div>
      <MediaPicker open={open} onClose={() => setOpen(false)} onPick={(m) => { onChange({ url: m.url, alt: m.alt || value?.alt || "", mediaId: m.id, kind: m.isStock ? "representative" : value?.kind ?? "original", credit: m.credit ?? undefined }); setOpen(false); }} />
    </div>
  );
}

function ImagesField({ f, value, onChange, disabled }: { f: FieldDef; value: ImageRef[]; onChange: (v: ImageRef[]) => void; disabled?: boolean }) {
  return (
    <div>
      <Label f={f} />
      <Sortable items={value} onChange={onChange} disabled={disabled} keyOf={(it, i) => `${it.url}-${i}`} render={(it, i) => (
        <div>
          {i === 0 ? <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-red">Primary image</p> : null}
          <div className="flex items-start gap-2">
            <div className="flex-1"><ImageField value={it} disabled={disabled} onChange={(img) => onChange(img ? value.map((x, j) => (j === i ? img : x)) : value.filter((_, j) => j !== i))} /></div>
          </div>
        </div>
      )} />
      {!disabled ? <AddImage onAdd={(img) => onChange([...value, img])} /> : null}
    </div>
  );
}

function AddImage({ onAdd }: { onAdd: (i: ImageRef) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="btn btn-outline btn-sm mt-2" onClick={() => setOpen(true)}><Plus className="size-4" /><span>Add image</span></button>
      <MediaPicker open={open} onClose={() => setOpen(false)} onPick={(m) => { onAdd({ url: m.url, alt: m.alt, mediaId: m.id, kind: m.isStock ? "representative" : "original", credit: m.credit ?? undefined }); setOpen(false); }} />
    </>
  );
}

function FileField({ value, onChange, disabled }: { value: { url: string; mediaId?: string; updatedAt?: string } | null; onChange: (v: unknown) => void; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-3 border border-line bg-white p-3">
      <FileText className="size-5 text-red" />
      <span className="min-w-0 flex-1 truncate text-sm">{value?.url ? <a href={value.url} target="_blank" rel="noreferrer" className="underline">{value.url.split("/").pop()}</a> : <span className="text-muted">No file</span>}{value?.updatedAt ? <span className="ml-2 text-xs text-muted">replaced {new Date(value.updatedAt).toLocaleDateString()}</span> : null}</span>
      {!disabled ? (
        <>
          <label className="btn btn-sm cursor-pointer">
            <Upload className="size-4" /><span>{busy ? "Uploading…" : value ? "Replace PDF" : "Upload PDF"}</span>
            <input type="file" accept="application/pdf" className="sr-only" onChange={async (e) => { const f = e.target.files?.[0]; e.target.value = ""; if (!f) return; setBusy(true); const m = await uploadFile(f, "documents", f.name); setBusy(false); if (m) onChange({ url: m.url, mediaId: m.id, updatedAt: new Date().toISOString() }); }} />
          </label>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => setOpen(true)}><span>From library</span></button>
        </>
      ) : null}
      <MediaPicker open={open} accept="pdf" onClose={() => setOpen(false)} onPick={(m) => { onChange({ url: m.url, mediaId: m.id, updatedAt: new Date().toISOString() }); setOpen(false); }} />
    </div>
  );
}

function MultiRef({ f, opts, value, onChange, disabled }: { f: FieldDef; opts: { value: string; label: string }[]; value: string[]; onChange: (v: string[]) => void; disabled?: boolean }) {
  const [q, setQ] = useState("");
  const label = (v: string) => opts.find((o) => o.value === v)?.label ?? `${v} (missing)`;
  const avail = opts.filter((o) => !value.includes(o.value) && o.label.toLowerCase().includes(q.toLowerCase())).slice(0, 8);
  return (
    <div>
      <Label f={f} />
      <Sortable items={value} onChange={onChange} disabled={disabled} keyOf={(v) => v} render={(v) => (
        <div className="flex items-center justify-between gap-2 text-sm"><span className={label(v).endsWith("(missing)") ? "text-red" : ""}>{label(v)}</span>{!disabled ? <button type="button" onClick={() => onChange(value.filter((x) => x !== v))} className="p-1 text-muted hover:text-red" aria-label="Remove"><X className="size-4" /></button> : null}</div>
      )} />
      {!disabled ? (
        <div className="mt-2">
          <input className={`${input} !min-h-9`} placeholder="Search to add…" value={q} onChange={(e) => setQ(e.target.value)} aria-label={`Add to ${f.label}`} />
          {q ? (
            <ul className="mt-1 max-h-56 overflow-y-auto border border-line bg-white">
              {avail.map((o) => <li key={o.value}><button type="button" className="block w-full px-3 py-2 text-left text-sm hover:bg-[#f5f1eb]" onClick={() => { onChange([...value, o.value]); setQ(""); }}>{o.label}</button></li>)}
              {!avail.length ? <li className="px-3 py-2 text-sm text-muted">No matches</li> : null}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
