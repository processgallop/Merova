import { PageHero } from "@/components/ui/blocks";
import { ContactForm } from "@/components/forms/SimpleForms";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Business Partnerships | Suppliers & Partners | Merova Printpack", description: "Supplier, distribution, institutional and commercial partnership enquiries for Merova Printpack.", path: "/about/partnerships/" });

export default function Page() {
  return (
    <>
      <PageHero crumbs={[{ name: "About Merova", href: "/about/" }, { name: "Business partnerships", href: "/about/partnerships/" }]} eyebrow="Business partnerships" title="Partner with Merova." intro="Material suppliers, distributors, institutional buyers and service providers: tell us how you'd like to work together." />
      <section className="section-tight bg-sand">
        <div className="wrap wrap-wide grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="grid content-start gap-4">{[["Material suppliers", "Board, paper, film, resin, ink and adhesive suppliers who can document grade and origin."], ["Distribution partners", "Regional distributors serving foodservice, retail and industrial buyers."], ["Institutional buyers", "Hospitals, universities, government and large-campus procurement."]].map(([t, d]) => <div key={t} className="rounded-[24px] bg-white p-6"><h2 className="h4">{t}</h2><p className="mt-2 text-[15px] text-stone">{d}</p></div>)}</div>
          <div className="rounded-[32px] bg-cloud p-5 sm:p-8"><h2 className="h3">Get in touch</h2><div className="mt-6"><ContactForm defaultTopic="partnerships" /></div></div>
        </div>
      </section>
    </>
  );
}
