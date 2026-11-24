import Link from "next/link";
import { Download, FileText } from "lucide-react";
import { CtaBand, PageHero } from "@/components/ui/blocks";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { DOWNLOADS, flyerUrl, productUrl, productsInVertical, verticals } from "@/data/catalog";
import { pageMetadata } from "@/lib/seo";
import { pdfSizes } from "@/lib/files";

export const metadata = pageMetadata({
  title: "Downloads Centre | Product Flyers, Catalogue & Company Profile | Merova Printpack",
  description: "Download Merova product flyers, the complete product catalogue, company profile, manufacturing capabilities brochure and sustainability approach.",
  path: "/resources/downloads",
});

export default function DownloadsPage() {
  const sizes = pdfSizes();
  const docs = [
    { title: "Complete Product Catalogue", text: "Every Merova product with formats, materials and specifications.", href: DOWNLOADS.catalogue, event: "catalogue_download" as const },
    { title: "Company Profile", text: "Who we are, how we work and what we supply.", href: DOWNLOADS.profile, event: "profile_download" as const },
    { title: "Manufacturing Capabilities", text: "Processes, quality stages and capabilities by vertical.", href: DOWNLOADS.capabilities, event: "document_download" as const },
    { title: "Sustainability Approach", text: "Material choices, waste reduction and how claims are made.", href: DOWNLOADS.sustainability, event: "document_download" as const },
  ];
  return (
    <>
      <PageHero eyebrow="Downloads Centre" title="Product flyers, catalogue and company documents." intro="All documents are PDFs, readable on desktop and mobile. Each product flyer includes a QR code linking back to its product page." crumbs={[{ name: "Resources", href: "/resources" }, { name: "Downloads", href: "/resources/downloads" }]} />
      <section className="py-14 lg:py-20">
        <div className="container-x">
          <h2 className="t-2">Company documents</h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {docs.map((d) => (
              <li key={d.href} className="flex flex-col rounded-sm border border-line bg-white p-6">
                <FileText className="h-7 w-7 text-red-500" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-4 font-display text-lg font-semibold text-char-950">{d.title}</h3>
                <p className="mt-2 flex-1 text-[0.9rem] leading-relaxed text-ink-2">{d.text}</p>
                <TrackedLink href={d.href} download event={d.event} className="btn btn-navy btn-sm mt-5"><Download className="h-4 w-4" aria-hidden /> PDF{sizes[d.href] ? ` · ${sizes[d.href]}` : ""}</TrackedLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section id="flyers" className="border-t border-line bg-white py-14 lg:py-20">
        <div className="container-x">
          <h2 className="t-2">Individual product flyers</h2>
          <div className="mt-8 grid gap-8">
            {verticals.map((v) => (
              <div key={v.id}>
                <h3 className="font-display text-lg font-semibold text-char-950">{v.name}</h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {productsInVertical(v.id).map((p) => (
                    <li key={p.slug} className="flex items-center justify-between gap-3 rounded border border-line px-4 py-3">
                      <Link href={productUrl(p)} className="text-[0.92rem] font-semibold text-char-900 hover:text-red-600">{p.name}</Link>
                      <TrackedLink href={flyerUrl(p)} download event="flyer_download" params={{ product: p.slug }} className="inline-flex shrink-0 items-center gap-1 text-[0.82rem] font-semibold text-char-700 hover:text-red-600" aria-label={`Download ${p.name} flyer (PDF)`}>
                        <Download className="h-3.5 w-3.5" aria-hidden /> PDF
                      </TrackedLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-10 rounded-sm bg-paper-2 p-5 text-[0.9rem] text-ink-2">
            <strong className="text-ink">Technical data sheets:</strong> each product flyer includes its specification table. Order-specific technical data sheets are issued with your quotation once the specification is confirmed.
          </p>
        </div>
      </section>
      <CtaBand title="Ready to discuss a requirement?" text="Use the quote form to share specifications and files with the right team." />
    </>
  );
}
