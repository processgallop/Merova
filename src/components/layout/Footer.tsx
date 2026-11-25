import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { Emblem, Logo } from "@/components/brand/Logo";
import { getCatalog, getFooter, getSiteSettings, industryUrl, segmentUrl } from "@/lib/content";
import { telHref } from "@/lib/site";

export async function Footer() {
  const [footer, site, { segments, industries }] = await Promise.all([getFooter(), getSiteSettings(), getCatalog()]);
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-footer text-footer-text">
      {/* Closing CTA strip */}
      <div className="surface-red relative overflow-hidden">
        <Emblem className="pointer-events-none absolute -right-24 -top-10 w-[560px] opacity-[0.12]" color="#fff" />
        <div className="wrap relative flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
          <p className="max-w-2xl font-display text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-tight tracking-tight text-white">Have a packaging requirement? Let&apos;s specify it properly.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/request-a-quote" className="btn btn-light"><span>Request a Quote</span><ArrowRight className="btn-arrow size-4" /></Link>
            <Link href="/contact" className="btn btn-ghost-light"><span>Speak With Our Team</span></Link>
          </div>
        </div>
      </div>

      <Emblem className="pointer-events-none absolute -bottom-40 -left-40 w-[900px] opacity-[0.04]" color="#fff" />
      <div className="wrap relative grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo variant="horizontal-light" height={30} />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-footer-text/70">{footer.statement}</p>
          <p className="mt-6 font-display text-lg font-bold text-white">{site.tagline}</p>
          <ul className="mt-6 space-y-2.5 text-sm">
            {site.email ? <li><a href={`mailto:${site.email}`} className="flex items-center gap-2.5 hover:text-white"><Mail className="size-4 text-red" />{site.email}</a></li> : null}
            {site.phone ? <li><a href={telHref(site.phone)} className="flex items-center gap-2.5 hover:text-white"><Phone className="size-4 text-red" />{site.phone}</a></li> : null}
            {site.officeAddress ? <li className="flex gap-2.5"><MapPin className="mt-0.5 size-4 flex-none text-red" /><span className="text-footer-text/80">{site.officeAddress}</span></li> : null}
            {!site.email && !site.phone ? <li><Link href="/contact" className="link text-footer-text hover:text-white">Contact the Merova team <ArrowRight className="size-4" /></Link></li> : null}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8">
          {footer.showSegments ? (
            <FooterCol title="Products" links={[...segments.map((s) => ({ id: s.slug, label: s.navName, href: segmentUrl(s) })), { id: "all", label: "All products", href: "/products" }]} />
          ) : null}
          {footer.showIndustries ? (
            <FooterCol title="Industries" links={[...industries.filter((i) => !i.isCatchAll).slice(0, 8).map((i) => ({ id: i.slug, label: i.shortName || i.name, href: industryUrl(i) })), { id: "all", label: "All industries", href: "/industries" }]} />
          ) : null}
          {footer.columns.map((c) => (
            <FooterCol key={c.id} title={c.title} links={c.links} />
          ))}
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="wrap flex flex-col gap-4 py-6 text-xs text-footer-text/60 md:flex-row md:items-center md:justify-between">
          <p>© {year} {site.legalName}. All rights reserved.{site.gstin ? ` GSTIN ${site.gstin}.` : ""}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footer.legal.map((l) => (
              <li key={l.id}><Link href={l.href} className="hover:text-white">{l.label}</Link></li>
            ))}
            {site.social.map((s) => (
              <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-white">{s.label}</a></li>
            ))}
            <li><button type="button" data-cookie-settings className="hover:text-white">Cookie settings</button></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { id: string; label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white">{title}</p>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.id}><Link href={l.href} className="text-footer-text/70 transition-colors hover:text-white">{l.label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
