"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { AlertCircle, Paperclip, X } from "lucide-react";
import { track } from "@/lib/track";

export const ACCEPT = ".pdf,.png,.jpg,.jpeg,.webp,.ai,.eps,.svg,.zip,.doc,.docx,.xls,.xlsx,.cdr";
export const MAX_BYTES = 4 * 1024 * 1024;

export function Field({ id, label, hint, error, required, children }: { id: string; label: string; hint?: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="field">
      <label htmlFor={id} className="label">{label}{required && <span className="text-red"> *</span>}</label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="hint">{hint}</p>}
      {error && <p id={`${id}-err`} className="error" role="alert"><AlertCircle className="h-4 w-4" />{error}</p>}
    </div>
  );
}

export function Files({ files, setFiles, error }: { files: File[]; setFiles: (f: File[]) => void; error?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const total = files.reduce((a, f) => a + f.size, 0);
  return (
    <div className="field">
      <span className="label">Artwork, drawings or reference photos</span>
      <div className="rounded-[var(--radius-input)] border-[1.5px] border-dashed border-line-strong bg-white p-4" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); setFiles([...files, ...Array.from(e.dataTransfer.files)].slice(0, 5)); }}>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="btn btn-outline btn-sm" onClick={() => ref.current?.click()}><Paperclip className="h-4 w-4" /> Attach files</button>
          <span className="text-sm text-stone">or drag them here. Up to 5 files, 4 MB in total. PDF, images, AI, EPS, CDR, ZIP, Office.</span>
        </div>
        <input ref={ref} id="files" type="file" multiple accept={ACCEPT} className="sr-only" onChange={(e) => { setFiles([...files, ...Array.from(e.target.files ?? [])].slice(0, 5)); e.target.value = ""; }} />
        {files.length > 0 && (
          <ul className="mt-3 grid gap-2">
            {files.map((f, i) => <li key={i} className="flex items-center justify-between gap-3 rounded-xl bg-sand px-3 py-2 text-sm"><span className="truncate">{f.name} <span className="text-stone tnum">· {Math.max(1, Math.round(f.size / 1024))} KB</span></span><button type="button" aria-label={`Remove ${f.name}`} onClick={() => setFiles(files.filter((_, k) => k !== i))} className="grid h-7 w-7 place-items-center rounded-full hover:bg-white"><X className="h-4 w-4" /></button></li>)}
          </ul>
        )}
        {total > MAX_BYTES && <p className="error mt-2"><AlertCircle className="h-4 w-4" />Attachments are over 4 MB. Remove a file, or send large files after we reply.</p>}
        {error && <p className="error mt-2"><AlertCircle className="h-4 w-4" />{error}</p>}
      </div>
    </div>
  );
}

export function Honeypot() {
  return <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>;
}

export function Consent({ checked, onChange, error }: { checked: boolean; onChange: (v: boolean) => void; error?: string }) {
  return (
    <div>
      <label className="flex items-start gap-3 text-sm text-charcoal"><input type="checkbox" className="check mt-0.5" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={!!error} /> <span>I agree that Merova Printpack may contact me about this enquiry. My details are used only to respond, as described in the <a href="/privacy-policy/" className="font-semibold text-red underline-offset-2 hover:underline">privacy policy</a>.</span></label>
      {error && <p className="error mt-2"><AlertCircle className="h-4 w-4" />{error}</p>}
    </div>
  );
}

/** Posts to /api/enquiry and shows success only when the server confirms acceptance. */
export function useEnquirySubmit() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const started = useRef(Date.now());
  async function submit(data: Record<string, string>, files: File[], onSuccess?: (ref: string) => void) {
    setBusy(true); setError(""); setFieldErrors({});
    const fd = new FormData();
    for (const [k, v] of Object.entries(data)) fd.append(k, v);
    fd.append("startedAt", String(started.current)); fd.append("page", window.location.pathname); fd.append("referrer", document.referrer);
    const sp = new URLSearchParams(window.location.search); for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) { const v = sp.get(k); if (v) fd.append(k, v); }
    for (const f of files) fd.append("files", f);
    try {
      const res = await fetch("/api/enquiry/", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) { setError(json.error ?? "We couldn't submit your enquiry. Please try again, or contact us directly."); setFieldErrors(json.fields ?? {}); track("rfq_submit_error", { code: json.code ?? res.status }); return false; }
      track("rfq_submit_success", { type: data.type, items: data.items ? JSON.parse(data.items).length : 0 });
      onSuccess?.(json.ref);
      router.push(`/enquiry-received/?ref=${encodeURIComponent(json.ref)}&team=${encodeURIComponent(json.team ?? "")}`);
      return true;
    } catch { setError("Network error. Check your connection and try again."); return false; }
    finally { setBusy(false); }
  }
  return { submit, busy, error, fieldErrors, setFieldErrors };
}
