import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero, SampleBadge } from "@/components/ui/blocks";
import { ContactForm } from "@/components/forms/SimpleForms";
import { pageMetadata } from "@/lib/seo";
import { site, telHref, whatsappHref } from "@/lib/site";

export const metadata = pageMetadata({ title: "Contact Merova Printpack | Sales, Technical & Partnerships", description: "Contact Merova Printpack for packaging enquiries, quotations, technical questions, existing orders, supplier and partnership enquiries.", path: "/contact/" });

export default function ContactPage() {
  const c = site.contact;
  const rows = [
    { icon: Phone, label: "Sales", value: c.phone, href: telHref(c.phone) },
    { icon: MessageCircle, label: "WhatsApp", value: "Chat with the sales team", href: whatsappHref() },
    { icon: Mail, label: "Email", value: c.salesEmail, href: `mailto:${c.salesEmail}` },
    { icon: Clock, label: "Hours", value: c.hours },
    { icon: MapPin, label: "Office", value: c.officeAddress },
    { icon: MapPin, label: "Plant", value: c.plantAddress },
  ];
  return (
    <>
      <PageHero crumbs={[{ name: "Contact", href: "/contact/" }]} eyebrow="Contact" title="Speak to our packaging team." intro="For quotations, the fastest route is the enquiry builder. For everything else, use the form or reach us directly." />
      <section className="section-tight bg-sand">
        <div className="wrap wrap-wide grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="grid content-start gap-4">
            <div className="rounded-[28px] bg-white p-7">
              <div className="flex items-center justify-between gap-3"><h2 className="h3">Direct contact</h2>{site.sample && <SampleBadge />}</div>
              <dl className="mt-6 grid gap-5">{rows.map(({ icon: I, label, value, href }) => <div key={label} className="flex gap-4"><span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-red-50 text-red"><I className="h-4 w-4" /></span><div><dt className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">{label}</dt><dd className="mt-1 text-[15px]">{href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="font-semibold hover:text-red">{value}</a> : value}</dd></div></div>)}</dl>
            </div>
            <div className="overflow-hidden rounded-[28px] bg-graphite p-7 text-white"><p className="eyebrow !text-[#ff8c80]">Map</p><p className="mt-3 text-[15px] text-[#cfc7c0]">An interactive map appears here once the verified office address is confirmed.</p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.officeAddress)}`} target="_blank" rel="noopener" className="btn btn-cloud btn-sm mt-5">Open in Google Maps</a></div>
          </div>
          <div className="rounded-[32px] bg-cloud p-5 sm:p-8 lg:p-10"><h2 className="h3">Send a message</h2><div className="mt-8"><ContactForm /></div></div>
        </div>
      </section>
    </>
  );
}
