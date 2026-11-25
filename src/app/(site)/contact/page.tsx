import Link from "next/link";
import { ArrowRight, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Crumbs } from "@/components/ui/blocks";
import { ContactForm } from "@/components/forms/ContactForm";
import { getSiteSettings } from "@/lib/content";
import { meta } from "@/lib/meta";
import { telHref, whatsappHref } from "@/lib/site";

export const revalidate = 3600;
export const metadata = meta({ title: "Contact Merova Printpack", description: "Speak with Merova's sales, technical, order, supplier, careers or partnership teams.", path: "/contact" });

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const [{ topic }, site] = await Promise.all([searchParams, getSiteSettings()]);
  const wa = whatsappHref(site.whatsapp, site.whatsappMessage);
  const channels = [
    site.phone && { icon: Phone, label: "Telephone", value: site.phone, href: telHref(site.phone) },
    site.email && { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    site.salesEmail && { icon: Mail, label: "Sales", value: site.salesEmail, href: `mailto:${site.salesEmail}` },
    wa && { icon: MessageCircle, label: "WhatsApp", value: "Chat with Merova", href: wa },
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href?: string }[];
  return (
    <section>
      <div className="wrap grid gap-12 pb-24 pt-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Crumbs items={[{ name: "Contact", href: "/contact" }]} />
          <p className="eyebrow mt-10">Contact</p>
          <h1 className="t-display mt-5">Let&apos;s Define the Right Packaging Solution for Your Business.</h1>
          <p className="t-lead mt-5">Choose the team you need. Every message is logged with a reference and routed to the right specialist.</p>
          {channels.length ? (
            <ul className="mt-10 divide-y divide-line border-y border-line">
              {channels.map((c) => (
                <li key={c.label}>
                  <a href={c.href} className="group flex items-center gap-4 py-4" {...(c.href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    <c.icon className="size-5 text-red" />
                    <span className="flex-1"><span className="block text-xs text-muted">{c.label}</span><span className="font-semibold text-heading group-hover:text-red">{c.value}</span></span>
                    <ArrowRight className="size-4 text-muted transition-transform group-hover:translate-x-1" />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-10 border-l-2 border-red pl-4 text-sm">Direct phone and email details will be published here once verified. The form reaches the team today.</p>
          )}
          <div className="mt-8 space-y-4 text-sm">
            {site.officeAddress ? <p className="flex gap-3"><MapPin className="size-5 flex-none text-red" /><span><strong className="block text-heading">Office</strong>{site.officeAddress}</span></p> : null}
            {site.plantAddress ? <p className="flex gap-3"><MapPin className="size-5 flex-none text-red" /><span><strong className="block text-heading">Manufacturing</strong>{site.plantAddress}</span></p> : null}
            {site.hours ? <p className="flex gap-3"><Clock className="size-5 flex-none text-red" /><span><strong className="block text-heading">Business hours</strong>{site.hours}</span></p> : null}
            {site.mapUrl && /^https:\/\/(www\.)?google\.[a-z.]+\/maps\/embed/.test(site.mapUrl) ? <iframe src={site.mapUrl} title="Map" className="mt-4 aspect-video w-full border-0" loading="lazy" /> : null}
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <Link href="/request-a-quote" className="btn"><span>Request a Quote</span></Link>
            <Link href="/custom-requirement" className="btn btn-outline"><span>Custom Requirement</span></Link>
          </div>
        </div>
        <div className="lg:col-span-7 lg:pt-24">
          <ContactForm defaultTopic={topic} />
        </div>
      </div>
    </section>
  );
}
