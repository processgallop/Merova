import Link from "next/link";
import { Suspense } from "react";
import { Clock, FileCheck2, Lock, MessageCircle, Phone, Mail } from "lucide-react";
import { QuoteEngine, type QuoteProduct } from "./QuoteEngine";
import { Breadcrumbs } from "@/components/ui/blocks";
import { industries, products, verticals } from "@/data/catalog";
import { site, whatsappHref } from "@/lib/site";

export function QuotePageShell({ mode, title, intro, crumb }: { mode: "quote" | "custom"; title: string; intro: string; crumb: { name: string; href: string } }) {
  const list: QuoteProduct[] = products.map((p) => ({ slug: p.slug, name: p.name, vertical: p.vertical, profile: p.quoteProfile }));
  const wa = whatsappHref(mode === "custom" ? "Hello Merova Team, I have a custom packaging requirement I would like to discuss." : undefined);
  const c = site.contact;
  return (
    <section className="py-10 lg:py-14">
      <div className="container-x">
        <Breadcrumbs items={[crumb]} />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_20rem] xl:grid-cols-[1fr_22rem]">
          <div>
            <p className="eyebrow">{mode === "quote" ? "Request a quote" : "Custom requirement"}</p>
            <h1 className="t-1 mt-3">{title}</h1>
            <p className="lede mt-4 max-w-2xl">{intro}</p>
            <div className="mt-10">
              <Suspense fallback={<div className="h-96 animate-pulse rounded-md border border-line bg-white" />}>
                <QuoteEngine
                  mode={mode}
                  products={list}
                  verticals={verticals.map((v) => ({ id: v.id, name: v.name }))}
                  industries={industries.map((i) => ({ id: i.id, name: i.name }))}
                  turnstileSiteKey={site.turnstileSiteKey}
                  fallback={{ whatsapp: wa, email: c.salesEmail ?? c.email, phone: c.phone }}
                />
              </Suspense>
            </div>
          </div>
          <aside className="grid content-start gap-5 lg:sticky lg:top-28">
            <div className="rounded-md border border-line bg-white p-6">
              <h2 className="font-display text-lg font-semibold text-navy-950">What happens next</h2>
              <ol className="mt-4 grid gap-4 text-[0.9rem] text-ink-2">
                <li className="flex gap-3"><FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-signal" aria-hidden />Your enquiry is recorded with a reference number and routed to the team for your product.</li>
                <li className="flex gap-3"><MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-signal" aria-hidden />A specialist reviews it and contacts you to confirm details and recommend a specification.</li>
                <li className="flex gap-3"><Clock className="mt-0.5 h-5 w-5 shrink-0 text-signal" aria-hidden />You receive a quotation, with samples arranged where appropriate.</li>
              </ol>
            </div>
            <div className="rounded-md bg-navy-900 p-6 text-white">
              <p className="flex items-center gap-2 font-semibold"><Lock className="h-4 w-4" aria-hidden /> Confidential</p>
              <p className="mt-2 text-[0.88rem] leading-relaxed text-white/75">Drawings, artwork and specifications you share are used only to assess and respond to your requirement. Mention it if you need an NDA.</p>
            </div>
            <div className="rounded-md border border-line bg-white p-6">
              <h2 className="font-display text-base font-semibold text-navy-950">Prefer to talk?</h2>
              <ul className="mt-3 grid gap-2 text-[0.9rem]">
                {wa && <li><a href={wa} target="_blank" rel="noopener" className="inline-flex items-center gap-2 font-semibold text-[#177a42]"><MessageCircle className="h-4 w-4" aria-hidden /> Chat with Merova on WhatsApp</a></li>}
                {c.phone && <li><a href={`tel:${c.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-2 text-navy-800"><Phone className="h-4 w-4" aria-hidden /> {c.phone}</a></li>}
                {(c.salesEmail ?? c.email) && <li><a href={`mailto:${c.salesEmail ?? c.email}`} className="inline-flex items-center gap-2 break-all text-navy-800"><Mail className="h-4 w-4 shrink-0" aria-hidden /> {c.salesEmail ?? c.email}</a></li>}
                <li><Link href="/contact" className="font-semibold text-navy-800 underline underline-offset-2">All contact options</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
