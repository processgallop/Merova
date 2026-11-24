import Link from "next/link";
import { Suspense } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/blocks";
import { ContactForm } from "@/components/forms/ContactForm";
import { CONTACT_TOPICS } from "@/data/contact";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { site, telHref, whatsappHref } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Merova Printpack | Sales, Technical, Orders, Suppliers & Careers",
  description: "Contact Merova Printpack. Separate routes for sales enquiries, technical support, existing orders, suppliers, careers and business partnerships.",
  path: "/contact",
});

export default function ContactPage() {
  const c = site.contact;
  const wa = whatsappHref();
  return (
    <section className="py-10 lg:py-14">
      <div className="container-x">
        <Breadcrumbs items={[{ name: "Contact", href: "/contact" }]} />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem]">
          <div>
            <p className="eyebrow">Contact</p>
            <h1 className="t-1 mt-3">Speak with the right Merova team.</h1>
            <p className="lede mt-4 max-w-2xl">Choose your enquiry type and it will be routed to the team that can help. For new packaging requirements, the quote form is the fastest route.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/request-a-quote" className="btn btn-primary">Request a Quote</Link>
              <Link href="/custom-requirement" className="btn btn-outline">Discuss a Custom Requirement</Link>
            </div>
            <div className="mt-10">
              <Suspense fallback={<div className="h-96 animate-pulse rounded-md border border-line bg-white" />}>
                <ContactForm fallback={{ whatsapp: wa, email: c.email, phone: c.phone }} />
              </Suspense>
            </div>
          </div>

          <aside className="grid content-start gap-5">
            <div className="rounded-md border border-line bg-white p-6">
              <h2 className="font-display text-lg font-semibold text-navy-950">Direct contact</h2>
              <ul className="mt-4 grid gap-3 text-[0.92rem]">
                {wa && <li><TrackedLink href={wa} target="_blank" rel="noopener" event="whatsapp_click" className="inline-flex items-center gap-2 font-semibold text-[#177a42]"><MessageCircle className="h-4 w-4" aria-hidden /> Chat with Merova</TrackedLink></li>}
                {c.phone && <li><TrackedLink href={telHref(c.phone)!} event="phone_click" className="inline-flex items-center gap-2 text-navy-800"><Phone className="h-4 w-4" aria-hidden /> {c.phone}</TrackedLink></li>}
                {c.email && <li><TrackedLink href={`mailto:${c.email}`} event="email_click" className="inline-flex items-center gap-2 break-all text-navy-800"><Mail className="h-4 w-4 shrink-0" aria-hidden /> {c.email}</TrackedLink></li>}
                {c.salesEmail && <li><TrackedLink href={`mailto:${c.salesEmail}`} event="email_click" className="inline-flex items-center gap-2 break-all text-navy-800"><Mail className="h-4 w-4 shrink-0" aria-hidden /> Sales: {c.salesEmail}</TrackedLink></li>}
                {c.hours && <li className="flex items-center gap-2 text-ink-2"><Clock className="h-4 w-4" aria-hidden /> {c.hours}</li>}
                {!wa && !c.phone && !c.email && (
                  <li className="text-ink-2">Direct phone, email and WhatsApp details will appear here once confirmed. In the meantime, the form routes your message to the right team.</li>
                )}
              </ul>
            </div>
            {(c.officeAddress || c.plantAddress) && (
              <div className="rounded-md border border-line bg-white p-6">
                <h2 className="font-display text-lg font-semibold text-navy-950">Locations</h2>
                <ul className="mt-4 grid gap-4 text-[0.92rem] text-ink-2">
                  {c.officeAddress && <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /><span><strong className="block text-ink">Office</strong>{c.officeAddress}</span></li>}
                  {c.plantAddress && <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /><span><strong className="block text-ink">Manufacturing facility</strong>{c.plantAddress}</span></li>}
                </ul>
              </div>
            )}
            <div className="rounded-md bg-paper-2 p-6">
              <h2 className="font-display text-base font-semibold text-navy-950">Enquiry channels</h2>
              <ul className="mt-3 grid gap-2.5 text-[0.88rem]">
                {CONTACT_TOPICS.map((t) => (
                  <li key={t.id}>
                    <Link href={`/contact?topic=${t.id}`} scroll={false} className="font-semibold text-navy-800 hover:text-signal-600">{t.label}</Link>
                    <span className="block text-ink-2">{t.hint}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
