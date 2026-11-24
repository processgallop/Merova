import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { industries, verticals, DOWNLOADS } from "@/data/catalog";
import { companyMenu } from "@/data/navigation";
import { site, telHref } from "@/lib/site";
import { CookieSettingsButton } from "@/components/analytics/ConsentBanner";
import { TrackedLink } from "@/components/ui/TrackedLink";

export function Footer() {
  const c = site.contact;
  const hasDirect = Boolean(c.phone || c.email);
  return (
    <footer className="bg-navy-950 text-white/80">
      <div className="container-x grid gap-10 py-14 lg:grid-cols-[1.3fr_repeat(4,1fr)] lg:py-20">
        <div className="max-w-sm">
          <Logo tone="light" />
          <p className="mt-5 font-display text-xl font-semibold text-white">{site.tagline}</p>
          <p className="mt-1 text-sm text-white/65">{site.proposition}</p>
          <p className="mt-5 text-sm leading-relaxed">
            Corrugated, paperboard, foodservice, flexible and custom packaging — specified, sampled and supplied to your application.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/request-a-quote" className="btn btn-primary btn-sm">Request a Quote</Link>
            <TrackedLink href={DOWNLOADS.profile} event="profile_download" className="btn btn-ghost-light btn-sm" download>
              Company Profile (PDF)
            </TrackedLink>
          </div>
        </div>

        <FooterCol title="Products" links={[{ label: "All products", href: "/products" }, ...verticals.map((v) => ({ label: v.name, href: `/${v.slug}` }))]} />
        <FooterCol title="Industries" links={[...industries.map((i) => ({ label: i.shortName, href: `/industries/${i.slug}` }))]} />
        <FooterCol
          title="Company"
          links={[
            ...companyMenu.slice(0, 7),
            { label: "Manufacturing", href: "/manufacturing" },
            { label: "Quality", href: "/quality" },
            { label: "Sustainability", href: "/sustainability" },
          ]}
        />
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
          <h2 className="mt-8 font-mono text-[0.7rem] font-medium uppercase tracking-[0.16em] text-white/50">Contact</h2>
          <ul className="mt-3 space-y-2.5 text-sm">
            {c.phone && (
              <li>
                <TrackedLink href={telHref(c.phone)!} event="phone_click" className="inline-flex items-center gap-2 hover:text-white">
                  <Phone className="h-4 w-4" aria-hidden /> {c.phone}
                </TrackedLink>
              </li>
            )}
            {c.email && (
              <li>
                <TrackedLink href={`mailto:${c.email}`} event="email_click" className="inline-flex items-center gap-2 break-all hover:text-white">
                  <Mail className="h-4 w-4 shrink-0" aria-hidden /> {c.email}
                </TrackedLink>
              </li>
            )}
            {c.officeAddress && (
              <li className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> <span>{c.officeAddress}</span>
              </li>
            )}
            {!hasDirect && <li className="text-white/65">Use the enquiry form and the right team will respond.</li>}
            <li>
              <Link href="/contact" className="font-semibold text-white hover:text-signal">
                All contact options →
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-4 py-6 text-[0.8rem] text-white/55 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {c.legalName}. All rights reserved.
            {c.gstin && <span className="ml-2">GSTIN {c.gstin}</span>}
          </p>
          <p className="max-w-xl md:text-center">
            Product visuals are format illustrations or representative imagery unless captioned as Merova photography.
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
            <li><CookieSettingsButton /></li>
            {site.social.linkedin && <li><a href={site.social.linkedin} rel="noopener" target="_blank" className="hover:text-white">LinkedIn</a></li>}
            {site.social.instagram && <li><a href={site.social.instagram} rel="noopener" target="_blank" className="hover:text-white">Instagram</a></li>}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.16em] text-white/50">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className="hover:text-white">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
