import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { CookieSettingsButton } from "@/components/analytics/ConsentBanner";
import { categories, industries, productsIn } from "@/data/catalog";
import { site, telHref } from "@/lib/site";

export function Footer() {
  const c = site.contact;
  return (
    <footer className="no-print bg-graphite text-[#cfc7c0]">
      <div className="wrap wrap-wide pt-16 pb-10 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_2.4fr]">
          <div>
            <span className="inline-block rounded-2xl bg-cloud px-4 py-3"><Logo height={44} /></span>
            <p className="mt-6 max-w-xs font-display text-2xl font-semibold leading-tight text-white">Packaging, Perfected.</p>
            <p className="mt-2 max-w-xs text-sm">Engineered to Protect. Designed to Perform.</p>
            <dl className="mt-8 grid gap-4 text-sm">
              <div><dt className="text-xs uppercase tracking-[0.14em] text-[#8f8681]">Sales</dt><dd className="mt-1"><a href={telHref(c.phone)} className="text-white hover:text-[#ff8c80]">{c.phone}</a><br /><a href={`mailto:${c.salesEmail}`} className="hover:text-white">{c.salesEmail}</a></dd></div>
              <div><dt className="text-xs uppercase tracking-[0.14em] text-[#8f8681]">Office</dt><dd className="mt-1 max-w-xs">{c.officeAddress}</dd></div>
              <div><dt className="text-xs uppercase tracking-[0.14em] text-[#8f8681]">Hours</dt><dd className="mt-1">{c.hours}</dd></div>
            </dl>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <div key={cat.id}>
                <Link href={`/products/${cat.slug}/`} className="flex items-center gap-2 font-semibold text-white hover:text-[#ff8c80]"><span className="mat-dot" style={{ ["--mat" as string]: cat.accent }} />{cat.name}</Link>
                <ul className="mt-4 grid gap-2 text-sm">
                  {productsIn(cat.id).slice(0, 9).map((p) => <li key={p.id}><Link href={p.url} className="hover:text-white">{p.name}</Link></li>)}
                  <li><Link href={`/products/${cat.slug}/`} className="font-semibold text-[#ff8c80]">All {cat.short} →</Link></li>
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 grid gap-10 border-t border-white/10 pt-10 sm:grid-cols-3">
          <div><p className="font-semibold text-white">Industries</p><ul className="mt-4 grid grid-cols-1 gap-2 text-sm">{industries.map((i) => <li key={i.id}><Link href={i.url} className="hover:text-white">{i.name}</Link></li>)}</ul></div>
          <div><p className="font-semibold text-white">Company</p><ul className="mt-4 grid gap-2 text-sm">{[["About Merova", "/about/"], ["Manufacturing", "/about/manufacturing/"], ["Quality", "/about/quality/"], ["Process", "/about/process/"], ["Sustainability", "/about/sustainability/"], ["Careers", "/about/careers/"], ["Partnerships", "/about/partnerships/"], ["Contact", "/contact/"]].map(([t, u]) => <li key={u}><Link href={u} className="hover:text-white">{t}</Link></li>)}</ul></div>
          <div><p className="font-semibold text-white">Resources</p><ul className="mt-4 grid gap-2 text-sm">{[["Download centre", "/resources/downloads/"], ["Product catalogue (PDF)", "/assets/downloads/merova-product-catalogue.pdf"], ["Company profile (PDF)", "/assets/downloads/merova-company-profile.pdf"], ["Technical resources", "/resources/technical/"], ["FAQs", "/resources/faqs/"], ["Insights", "/insights/"], ["Request a Quote", "/request-a-quote/"], ["Custom requirement", "/custom-packaging/"]].map(([t, u]) => <li key={u}><Link href={u} className="hover:text-white">{t}</Link></li>)}</ul></div>
        </div>
        {site.sample && (
          <p className="mt-10 rounded-2xl border border-[#6a5a2a] bg-[#3a3015] px-4 py-3 text-xs leading-relaxed text-[#f2d58a]">
            Preview build. Contact details, facility facts, certifications and specification values shown are <strong>sample data</strong> for review and will be replaced with Merova-verified information before launch. Product images are 3D renders with fictitious sample brands.
          </p>
        )}
        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {c.legalName}. GSTIN {c.gstin}.</p>
          <div className="flex flex-wrap gap-5"><Link href="/privacy-policy/" className="hover:text-white">Privacy policy</Link><Link href="/terms/" className="hover:text-white">Terms</Link><CookieSettingsButton /><Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link></div>
        </div>
      </div>
    </footer>
  );
}
