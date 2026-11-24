import { Suspense } from "react";
import { Clock, FileCheck, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/blocks";
import { QuoteForm, type QuoteProduct } from "@/components/forms/QuoteForm";
import { categoryById, products } from "@/data/catalog";
import { pageMetadata } from "@/lib/seo";
import { site, telHref, whatsappHref } from "@/lib/site";

export const metadata = pageMetadata({ title: "Request a Quote | Merova Printpack", description: "Build one packaging enquiry for products across paper, plastic, compostable and corrugated. Add quantities and files; the Merova team replies with a quotation.", path: "/request-a-quote/" });

const qp: QuoteProduct[] = products.map((p) => ({ id: p.id, n: p.name, c: p.category, cn: categoryById[p.category].name, s: p.subcategory, i: p.image, u: p.url, v: p.variants, f: p.rfqFields }));

export default function QuotePage() {
  return (
    <section className="bg-sand">
      <div className="wrap wrap-wide pt-8"><Breadcrumbs items={[{ name: "Request a Quote", href: "/request-a-quote/" }]} /></div>
      <div className="wrap wrap-wide grid gap-10 pb-20 pt-8 lg:grid-cols-[1.6fr_1fr] lg:pb-28">
        <div className="rounded-[32px] bg-cloud p-5 sm:p-8 lg:p-10">
          <p className="eyebrow">Request a Quote</p>
          <h1 className="h1 mt-3">Build your packaging enquiry.</h1>
          <p className="lede mt-4">Products from any category, one request. Approximate quantities are enough to start; we confirm specifications with you.</p>
          <div className="mt-10"><Suspense fallback={<p className="text-stone">Loading your enquiry…</p>}><QuoteForm products={qp} /></Suspense></div>
        </div>
        <aside className="grid content-start gap-4 lg:sticky lg:top-24">
          <div className="rounded-[28px] bg-graphite p-7 text-white">
            <h2 className="h3 text-white">What happens next</h2>
            <ol className="mt-6 grid gap-5 text-[15px] text-[#cfc7c0]">
              {[[FileCheck, "Your enquiry is logged with a reference and routed to the team for those materials."], [Clock, "A packaging specialist reviews it and contacts you, typically within one working day."], [ShieldCheck, "You receive a recommended specification, samples where needed, and a quotation."]].map(([Icon, t], i) => { const I = Icon as typeof Clock; return <li key={i} className="flex gap-4"><span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-red"><I className="h-4 w-4" /></span><span className="pt-1.5">{t as string}</span></li>; })}
            </ol>
          </div>
          <div className="rounded-[28px] bg-white p-7">
            <h2 className="h4">Prefer to talk?</h2>
            <div className="mt-4 grid gap-2">
              <a href={whatsappHref("Hello Merova team, I'd like a quotation for packaging.")} target="_blank" rel="noopener" className="btn btn-outline justify-start"><MessageCircle className="h-4 w-4" /> WhatsApp the sales team</a>
              <a href={telHref(site.contact.phone)} className="btn btn-outline justify-start"><Phone className="h-4 w-4" /> {site.contact.phone}</a>
            </div>
            <p className="mt-4 text-sm text-stone">{site.contact.hours}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
