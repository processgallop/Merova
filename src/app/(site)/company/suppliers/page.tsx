import { PageHero, SectionHeading } from "@/components/ui/blocks";
import { EmbeddedContact } from "@/components/forms/EmbeddedContact";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Supplier Registration | Merova Printpack",
  description: "Register as a supplier to Merova Printpack — paper and board, films, inks and adhesives, consumables, machinery, logistics and services.",
  path: "/company/suppliers",
});

const CATS = ["Paper, kraft and paperboard", "Films and resins", "Inks, coatings and adhesives", "Tooling, dies and plates", "Machinery, spares and maintenance", "Logistics and warehousing", "Testing and certification services", "Other services"];

export default function SuppliersPage() {
  return (
    <>
      <PageHero
        eyebrow="Supplier partnerships"
        title="Supply the materials behind better packaging."
        intro="Merova works with suppliers who can document grades, origins and consistency. Register your interest and share your capabilities."
        crumbs={[{ name: "Company", href: "/company" }, { name: "Supplier Registration", href: "/company/suppliers" }]}
      />
      <section className="py-14 lg:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionHeading eyebrow="Categories" title="What we source" />
            <ul className="mt-6 grid gap-2">
              {CATS.map((c) => <li key={c} className="rounded border border-line bg-white px-4 py-3 text-[0.94rem] text-ink-2">{c}</li>)}
            </ul>
            <p className="mt-6 text-[0.92rem] leading-relaxed text-ink-2">Please include your product range, grades and specifications, certifications, locations served and a company profile (attach as PDF).</p>
          </div>
          <EmbeddedContact topic="suppliers" />
        </div>
      </section>
    </>
  );
}
