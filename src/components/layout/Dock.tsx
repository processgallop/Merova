"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2, MessageCircle, Send, ShoppingBag, Sparkles, X } from "lucide-react";
import type { ClientIndex } from "@/data/catalog";
import { AddToEnquiry, BasketCount } from "@/components/basket/Basket";
import { track } from "@/lib/track";

/** Pages call this to give the WhatsApp button product/industry context. */
export function WhatsAppContext({ message, label }: { message: string; label?: string }) {
  useEffect(() => { window.dispatchEvent(new CustomEvent("merova:wa", { detail: { message, label } })); return () => { window.dispatchEvent(new CustomEvent("merova:wa", { detail: null })); }; }, [message, label]);
  return null;
}

const WaIcon = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={p.className}><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.7.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3M12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.7 15.6 2.2 13.8 2.2 12 2.2 6.6 6.6 2.2 12 2.2c2.6 0 5.1 1 6.9 2.9 1.8 1.8 2.9 4.3 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8m8.4-18.2C18.1 1.3 15.1.1 12 .1 5.5.1.1 5.4.1 12c0 2.1.5 4.1 1.6 5.9L0 24l6.3-1.6c1.7.9 3.7 1.4 5.7 1.4 6.5 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.1-3.5-8.3" /></svg>
);

interface Msg { role: "user" | "assistant"; content: string; products?: string[]; links?: { label: string; href: string }[]; handover?: boolean }
const STARTERS = ["We run a cinema. What do you offer for our concessions counter?", "What packaging do I need for premium mithai boxes and takeaway orders?", "What options are available for courier shipments?", "What's the difference between compostable and recyclable?"];
const SKEY = "merova-mira-v1";

export function Dock({ index, whatsapp }: { index: ClientIndex; whatsapp: string }) {
  const [wa, setWa] = useState<{ message: string; label?: string } | null>(null);
  const [mira, setMira] = useState(false);
  const pathname = usePathname();
  useEffect(() => { const on = (e: Event) => setWa((e as CustomEvent).detail); window.addEventListener("merova:wa", on); const om = () => setMira(true); window.addEventListener("merova:mira", om); return () => { window.removeEventListener("merova:wa", on); window.removeEventListener("merova:mira", om); }; }, []);
  const msg = wa?.message ?? "Hello Merova team, I would like to discuss a packaging requirement.";
  const href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;
  const waClick = () => track("whatsapp_click", { context: wa?.label ?? "general", page: pathname });
  const hideBar = pathname.startsWith("/request-a-quote") || pathname.startsWith("/custom-packaging") || pathname.startsWith("/contact");

  return (
    <>
      {/* Desktop: floating pair */}
      <div className="no-print fixed bottom-6 right-6 z-[55] hidden items-center gap-3 lg:flex" style={{ right: "max(24px, env(safe-area-inset-right))" }}>
        {!mira && <button type="button" onClick={() => { setMira(true); track("mira_open", { page: pathname }); }} className="group flex h-14 items-center gap-2.5 rounded-full bg-ink pl-4 pr-5 text-[15px] font-semibold text-white shadow-[var(--shadow-pop)] transition-transform hover:-translate-y-0.5"><span className="grid h-8 w-8 place-items-center rounded-full bg-red"><Sparkles className="h-4 w-4" /></span>Ask Mira</button>}
        <a href={href} target="_blank" rel="noopener" onClick={waClick} className="group relative grid h-14 w-14 place-items-center rounded-full bg-[#1f9d55] text-white shadow-[var(--shadow-pop)] transition-transform hover:-translate-y-0.5" aria-label={wa?.label ? `Ask about ${wa.label} on WhatsApp` : "Chat with Merova on WhatsApp"}>
          <WaIcon className="h-7 w-7" />
          {wa?.label && <span className="pointer-events-none absolute bottom-full right-0 mb-3 w-max max-w-64 rounded-xl bg-ink px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">Ask about {wa.label} on WhatsApp</span>}
        </a>
      </div>
      {/* Mobile: action bar */}
      {!hideBar && (
        <nav aria-label="Quick actions" className="no-print fixed inset-x-0 bottom-0 z-[55] border-t border-line bg-cloud/95 backdrop-blur lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          <div className="grid grid-cols-[auto_auto_1fr] gap-2 px-3 py-2.5" style={{ paddingInline: "max(12px, env(safe-area-inset-left))" }}>
            <a href={href} target="_blank" rel="noopener" onClick={waClick} className="grid h-12 w-12 place-items-center rounded-full bg-[#1f9d55] text-white" aria-label="WhatsApp"><WaIcon className="h-6 w-6" /></a>
            <button type="button" onClick={() => { setMira(true); track("mira_open", { page: pathname }); }} className="flex h-12 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white"><Sparkles className="h-4 w-4 text-[#ff8c80]" />Mira</button>
            <Link href="/request-a-quote/" className="btn btn-primary relative"><ShoppingBag className="h-4 w-4" />Get a quote<BasketCount className="!right-2 !top-1.5 bg-white !text-red" /></Link>
          </div>
        </nav>
      )}
      {mira && <MiraPanel index={index} onClose={() => setMira(false)} whatsappHref={href} />}
    </>
  );
}

function MiraPanel({ index, onClose, whatsappHref }: { index: ClientIndex; onClose: () => void; whatsappHref: string }) {
  const [msgs, setMsgs] = useState<Msg[]>(() => { try { return JSON.parse(sessionStorage.getItem(SKEY) ?? "[]"); } catch { return []; } });
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"ai" | "guided" | null>(null);
  const [err, setErr] = useState("");
  const log = useRef<HTMLDivElement>(null);
  const byId = Object.fromEntries(index.products.map((p) => [p.id, p]));

  useEffect(() => { fetch("/api/mira").then((r) => r.json()).then((d) => setMode(d.mode)).catch(() => setMode("guided")); }, []);
  useEffect(() => { try { sessionStorage.setItem(SKEY, JSON.stringify(msgs.slice(-20))); } catch {} log.current?.scrollTo({ top: log.current.scrollHeight, behavior: "smooth" }); }, [msgs, busy]);

  async function send(text: string) {
    const q = text.trim(); if (!q || busy) return;
    setErr(""); setInput("");
    const next = [...msgs, { role: "user" as const, content: q }]; setMsgs(next); setBusy(true);
    track("mira_message", { length: q.length });
    try {
      const r = await fetch("/api/mira", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Mira is unavailable right now.");
      setMode(d.mode);
      if (d.handover) track("mira_handover", {});
      setMsgs([...next, { role: "assistant", content: d.text, products: d.products, links: d.links, handover: d.handover }]);
    } catch (e) { setErr(e instanceof Error ? e.message : "Something went wrong."); }
    finally { setBusy(false); }
  }

  return (
    <div className="no-print fixed inset-0 z-[85] flex items-end justify-end lg:inset-auto lg:bottom-6 lg:right-6" role="dialog" aria-label="Mira, Merova packaging assistant">
      <div className="absolute inset-0 bg-ink/30 lg:hidden" onClick={onClose} />
      <div className="pop-in relative flex h-[88dvh] w-full flex-col overflow-hidden rounded-t-[28px] bg-cloud shadow-[var(--shadow-pop)] lg:h-[680px] lg:max-h-[calc(100dvh-48px)] lg:w-[420px] lg:rounded-[28px]">
        <header className="flex items-center gap-3 border-b border-line bg-white px-5 py-4">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-red text-white"><Sparkles className="h-5 w-5" /></span>
          <div className="min-w-0 flex-1"><p className="font-display text-[17px] font-semibold leading-tight">Mira</p><p className="text-xs text-stone">Merova packaging assistant</p></div>
          <span className="badge badge-sand">{mode === "ai" ? "AI" : mode === "guided" ? "Guided" : "…"}</span>
          <button type="button" onClick={onClose} className="icon-btn" aria-label="Close Mira"><X className="h-5 w-5" /></button>
        </header>
        <div ref={log} className="flex-1 space-y-4 overflow-y-auto px-4 py-5" aria-live="polite">
          <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-white px-4 py-3 text-[15px] leading-relaxed shadow-[var(--shadow-rest)]">
            Hi, I&apos;m Mira. Tell me what you pack or what kind of business you run, and I&apos;ll point you to the right packaging across paper, plastic, compostable and corrugated.
          </div>
          {!msgs.length && <div className="grid gap-2">{STARTERS.map((s) => <button key={s} type="button" onClick={() => send(s)} className="rounded-2xl border border-line bg-white px-4 py-2.5 text-left text-sm text-charcoal hover:border-ink">{s}</button>)}</div>}
          {msgs.map((m, i) => m.role === "user" ? (
            <div key={i} className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-ink px-4 py-3 text-[15px] text-white">{m.content}</div>
          ) : (
            <div key={i} className="max-w-[94%] space-y-3">
              <div className="whitespace-pre-line rounded-2xl rounded-bl-md bg-white px-4 py-3 text-[15px] leading-relaxed shadow-[var(--shadow-rest)]">{m.content}</div>
              {!!m.products?.length && (
                <ul className="grid gap-2">
                  {m.products.filter((id) => byId[id]).map((id) => { const p = byId[id]; return (
                    <li key={id} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-2 pr-2.5">
                      <Image src={p.i} alt="" width={80} height={60} className="h-12 w-16 flex-none rounded-xl bg-sand object-cover" />
                      <Link href={p.u} onClick={() => track("mira_recommendation_click", { product: id })} className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{p.n}</span><span className="block truncate text-xs text-stone">{p.s}</span></Link>
                      <AddToEnquiry id={id} name={p.n} compact />
                    </li>
                  ); })}
                </ul>
              )}
              {(!!m.links?.length || m.handover) && (
                <div className="flex flex-wrap gap-2">
                  {m.links?.map((l) => <Link key={l.href} href={l.href} className="chip">{l.label} <ArrowRight className="h-3.5 w-3.5" /></Link>)}
                  {m.handover && <a href={whatsappHref} target="_blank" rel="noopener" className="chip"><MessageCircle className="h-3.5 w-3.5" /> WhatsApp the team</a>}
                </div>
              )}
            </div>
          ))}
          {busy && <div className="flex items-center gap-2 text-sm text-stone"><Loader2 className="h-4 w-4 animate-spin" /> Mira is looking through the catalogue…</div>}
          {err && <p className="error rounded-xl bg-red-50 px-3 py-2">{err} <a href={whatsappHref} target="_blank" rel="noopener" className="font-semibold underline">Ask on WhatsApp</a></p>}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="border-t border-line bg-white p-3" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
          <div className="flex items-end gap-2 rounded-2xl border border-line bg-cloud p-1.5 pl-4 focus-within:border-red">
            <label htmlFor="mira-input" className="sr-only">Message Mira</label>
            <textarea id="mira-input" rows={1} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }} placeholder="Ask about packaging…" className="max-h-28 min-h-10 flex-1 resize-none bg-transparent py-2 text-[15px] outline-none" />
            <button type="submit" disabled={busy || !input.trim()} className="grid h-10 w-10 place-items-center rounded-xl bg-red text-white disabled:opacity-40" aria-label="Send"><Send className="h-4 w-4" /></button>
          </div>
          <p className="mt-2 px-1 text-[11px] leading-snug text-stone">{mode === "ai" ? "Mira is an AI assistant and can make mistakes." : "Mira is in guided mode: answers come straight from the Merova catalogue."} Prices and specifications are confirmed by the Merova team.</p>
        </form>
      </div>
    </div>
  );
}
