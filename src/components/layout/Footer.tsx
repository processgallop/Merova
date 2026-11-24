/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight, Download, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { industries, verticals, DOWNLOADS } from "@/data/catalog";
import { aboutMenu } from "@/data/navigation";
import { site, telHref } from "@/lib/site";
import { CookieSettingsButton } from "@/components/analytics/ConsentBanner";
import { TrackedLink } from "@/components/ui/TrackedLink";

/**
 * Merova Red footer with the official reverse lockup. All text is solid
 * Cloud Dancer on red (contrast ≥ 4.5:1) — no translucent text on red.
 */
export function Footer() {
  const c = site.contact;
  const hasDirect = Boolean(c.phone || c.email);
  return (
    <footer className="surface-red relative overflow-hidden">
      <img src="/assets/brand/merova-mark-cream.svg" alt="" aria-hidden="true" className="pointer-events-none absolute -right-24 top-10 w-[46rem] max-w-none opacity-[0.07]" />

      <div className="container-x relative border-b border-cloud/25 py-12 lg:py-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-display text-[clamp(2rem,1.4rem+2.4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
              Packaging, Perfected.
            </p>
            <p className="mt-2 text-lg">Engineered to Protect. Designed to Perform.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/request-a-quote" className="btn btn-cloud">Request a Quote <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            <TrackedLink href={DOWNLOADS.catalogue} event="catalogue_download" download className="btn btn-ghost-light">
              <Download className="h-4 w-4" aria-hidden /> Product Catalogue
            </TrackedLink>
          </div>
        </div>
      </div>

      <div className="container-x relative grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_repeat(4,1fr)] lg:py-14">
        <div className="max-w-xs">
          <Logo variant="reverse" height={74} />
          <p className="mt-6 text-[0.92rem] leading-relaxed">
            Corrugated, paperboard, foodservice, flexible and custom packaging — specified, sampled and supplied to your application.
          </p>
          <TrackedLink href={DOWNLOADS.profile} event="profile_download" download className="mt-5 inline-flex items-center gap-2 text-[0.92rem] font-semibold underline underline-offset-4">
            <Download className="h-4 w-4" aria-hidden /> Company Profile (PDF)
          </TrackedLink>
        </div>

        <FooterCol title="Products" links={[{ label: "All products", href: "/products" }, ...verticals.map((v) => ({ label: v.name, href: `/${v.slug}` }))]} />
        <FooterCol title="Industries" links={industries.map((i) => ({ label: i.shortName, href: `/industries/${i.slug}` }))} />
        <FooterCol title="About Merova" links={[...aboutMenu[0].items, ...aboutMenu[1].items]} />
        <div>
          <FooterCol
            title="Resources"
            links={[
              { label: "Downloads Centre", href: "/resources/downloads" },
              { label: "Knowledge Centre", href: "/blog" },
              { label: "FAQs", href: "/resources/faqs" },
              { label: "Supplier Registration", href: "/company/suppliers" },
            ]}
          />
          <h2 className="mt-8 text-[0.72rem] font-bold uppercase tracking-[0.16em]">Contact</h2>
          <ul className="mt-3 space-y-2.5 text-[0.92rem]">
            {c.phone && (
              <li>
                <TrackedLink href={telHref(c.phone)!} event="phone_click" className="inline-flex items-center gap-2 hover:underline">
                  <Phone className="h-4 w-4" aria-hidden /> {c.phone}
                </TrackedLink>
              </li>
            )}
            {c.email && (
              <li>
                <TrackedLink href={`mailto:${c.email}`} event="email_click" className="inline-flex items-center gap-2 break-all hover:underline">
                  <Mail className="h-4 w-4 shrink-0" aria-hidden /> {c.email}
                </TrackedLink>
              </li>
            )}
            {c.officeAddress && (
              <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> <span>{c.officeAddress}</span></li>
            )}
            {!hasDirect && <li>Use the enquiry form and the right team will respond.</li>}
            <li><Link href="/contact" className="font-semibold underline underline-offset-4">All contact options</Link></li>
          </ul>
        </div>
      </div>

      <div className="relative bg-red-700">
        <div className="container-x flex flex-col gap-4 py-5 text-[0.82rem] md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {c.legalName}. All rights reserved.
            {c.gstin && <span className="ml-2">GSTIN {c.gstin}</span>}
          </p>
          <p className="max-w-xl md:text-center">Product visuals are studio visualisations or representative imagery unless captioned as Merova photography.</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <li><Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:underline">Terms</Link></li>
            <li><CookieSettingsButton /></li>
            {site.social.linkedin && <li><a href={site.social.linkedin} rel="noopener" target="_blank" className="hover:underline">LinkedIn</a></li>}
            {site.social.instagram && <li><a href={site.social.instagram} rel="noopener" target="_blank" className="hover:underline">Instagram</a></li>}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="text-[0.72rem] font-bold uppercase tracking-[0.16em]">{title}</h2>
      <ul className="mt-3 space-y-2 text-[0.92rem]">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className="underline-offset-4 hover:underline">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
