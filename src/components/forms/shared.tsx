"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";

export function useStartedAt() {
  const ref = useRef<number>(0);
  useEffect(() => {
    ref.current = Date.now();
  }, []);
  return ref;
}

/** Honeypot field: invisible to people, attractive to bots. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
    </div>
  );
}

export function Turnstile() {
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!key) return null;
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      <div className="cf-turnstile mt-4" data-sitekey={key} />
    </>
  );
}

export function Field({ label, name, error, hint, required, children }: { label: string; name: string; error?: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className="field-label">{label}{required ? <span className="text-red"> *</span> : null}</label>
      {children}
      {hint && !error ? <p className="mt-1.5 text-xs text-muted">{hint}</p> : null}
      {error ? <p id={`${name}-error`} className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red"><AlertCircle className="size-3.5" />{error}</p> : null}
    </div>
  );
}

export function FormError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div role="alert" className="flex gap-3 border-l-4 border-red bg-red-tint p-4 text-sm text-heading">
      <AlertCircle className="mt-0.5 size-4 flex-none text-red" />
      <p>{message}</p>
    </div>
  );
}

export function utmFields() {
  if (typeof window === "undefined") return {};
  const sp = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    const v = sp.get(k);
    if (v) out[k] = v;
  }
  return out;
}

export async function submitEnquiry(fd: FormData): Promise<{ ok: true; ref: string } | { ok: false; message: string; fields?: Record<string, string> }> {
  fd.set("page", window.location.pathname + window.location.search);
  fd.set("referrer", document.referrer.slice(0, 300));
  for (const [k, v] of Object.entries(utmFields())) fd.set(k, v);
  try {
    const res = await fetch("/api/enquiry", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok && data.ref) return { ok: true, ref: data.ref };
    return { ok: false, message: data.message || `We could not submit your enquiry (error ${res.status}). Please try again or contact us directly.`, fields: data.fields };
  } catch {
    return { ok: false, message: "We could not reach our server. Please check your connection and try again." };
  }
}

export function useFileList(max: number, maxBytes: number) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const add = (list: FileList | null) => {
    if (!list) return;
    const next = [...files, ...Array.from(list)].slice(0, max);
    const total = next.reduce((a, f) => a + f.size, 0);
    if (total > maxBytes) {
      setError(`Attachments must total under ${Math.round(maxBytes / 1024 / 1024)} MB. Larger files can be sent after we reply.`);
      return;
    }
    setError("");
    setFiles(next);
  };
  const remove = (i: number) => setFiles(files.filter((_, j) => j !== i));
  return { files, add, remove, error };
}
