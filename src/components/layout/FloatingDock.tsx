"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MessageCircle, Sparkles, X } from "lucide-react";
import { track } from "@/lib/track";
import { MiraPanel } from "@/components/mira/MiraPanel";

const DEFAULT_MESSAGE =
  "Hello Merova Team, I am interested in your packaging solutions. I would like to discuss my requirements.";

export function waLink(number: string | undefined, message: string) {
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : undefined;
}

/**
 * Persistent bottom-right dock: "Chat with Merova" (WhatsApp) and Mira.
 * The WhatsApp message is contextualised from the current route using a
 * server-built map of product and industry pages.
 */
export function FloatingDock({
  whatsapp,
  contextMap,
  phone,
  email,
}: {
  whatsapp?: string;
  contextMap: Record<string, string>;
  phone?: string;
  email?: string;
}) {
  const pathname = usePathname();
  const [fallback, setFallback] = useState(false);
  const [mira, setMira] = useState(false);
  const message = contextMap[pathname] ?? DEFAULT_MESSAGE;
  const href = waLink(whatsapp, message);

  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setFallback(false);
  }

  useEffect(() => {
    const open = () => setMira(true);
    window.addEventListener("merova:open-mira", open);
    return () => window.removeEventListener("merova:open-mira", open);
  }, []);

  if (pathname.startsWith("/print")) return null;

  return (
    <div className="no-print fixed bottom-4 right-4 z-[55] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {mira && <MiraPanel onClose={() => setMira(false)} whatsappHref={href} />}

      {fallback && !href && (
        <div role="dialog" aria-label="Contact options" className="w-[min(20rem,calc(100vw-2rem))] rounded-sm border border-line bg-white p-4 shadow-lift">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold text-char-950">Chat with Merova</p>
            <button type="button" aria-label="Close" onClick={() => setFallback(false)} className="-m-1 p-1 text-muted hover:text-ink">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1.5 text-[0.85rem] leading-relaxed text-ink-2">
            Our WhatsApp line is being set up. You can reach the team right now through:
          </p>
          <div className="mt-3 grid gap-2">
            <Link href="/request-a-quote" className="btn btn-primary btn-sm">Request a Quote</Link>
            <Link href="/contact" className="btn btn-outline btn-sm">Contact the team</Link>
            {phone && <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="btn btn-outline btn-sm" onClick={() => track("phone_click")}>Call {phone}</a>}
            {email && <a href={`mailto:${email}`} className="btn btn-outline btn-sm" onClick={() => track("email_click")}>Email us</a>}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setMira((m) => !m);
            if (!mira) track("mira_open");
          }}
          aria-expanded={mira}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-char-900 px-4 text-sm font-semibold text-cloud shadow-lift transition-colors hover:bg-char-700"
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          <span>Ask Mira</span>
        </button>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener"
            onClick={() => track("whatsapp_click", { context: message.slice(0, 80) })}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-red-500 px-4 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgb(213_43_30/0.8)] transition-colors hover:bg-red-600"
            aria-label="Chat with Merova on WhatsApp"
          >
            <MessageCircle className="h-5 w-5" aria-hidden />
            <span className="hidden sm:inline">Chat with Merova</span>
          </a>
        ) : (
          <button
            type="button"
            onClick={() => {
              setFallback((f) => !f);
              track("whatsapp_click", { configured: false });
            }}
            aria-expanded={fallback}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-red-500 px-4 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgb(213_43_30/0.8)] transition-colors hover:bg-red-600"
            aria-label="Chat with Merova"
          >
            <MessageCircle className="h-5 w-5" aria-hidden />
            <span className="hidden sm:inline">Chat with Merova</span>
          </button>
        )}
      </div>
    </div>
  );
}
