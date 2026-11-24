import Link from "next/link";
import { CtaBand, PageHero, Pending } from "@/components/ui/blocks";
import { IndustryIcon } from "@/components/ui/Icon";
import { industries } from "@/data/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Clients & Partnerships | Merova Printpack",
  description: "How Merova builds client relationships, the industries it serves and its policy on publishing client references.",
  path: "/company/clients",
});

export default function ClientsPage() {
  return (
    <>
      <PageHero
        eyebrow="Clients & partnerships"
        title="Trusted Relationships. Packaging That Performs."
        intro="Long-term packaging relationships are built on consistent specifications, honest communication and problems solved quickly. These are the industries Merova serves."
        crumbs={[{ name: "Company", href: "/company" }, { name: "Clients & Partnerships", href: "/company/clients" }]}
      />
      <section className="py-14 lg:py-20">
        <div className="container-x grid gap-8">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {industries.map((i) => (
              <li key={i.id}>
                <Link href={`/industries/${i.slug}`} className="flex h-full items-center gap-3 rounded-sm border border-line bg-white p-4 font-semibold text-char-950 hover:border-red-500">
                  <IndustryIcon name={i.icon} className="h-5 w-5 text-char-700" /> {i.shortName}
                </Link>
              </li>
            ))}
          </ul>
          <div className="rounded-sm border border-line bg-white p-6 lg:p-8">
            <h2 className="t-3">Our reference policy</h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-ink-2">Merova publishes client logos, testimonials and case studies only with each client&apos;s written permission. We never use placeholder logos or anonymous testimonials. If you need references for your evaluation, ask the team and we will arrange them where clients agree.</p>
          </div>
          <Pending>Approved client logos, testimonials and partnership details are to be supplied by Merova with client permissions.</Pending>
        </div>
      </section>
      <CtaBand title="Evaluating Merova as a supplier?" text="Ask for references, documentation or a sample — we'll respond with what you need for your evaluation." primary={{ label: "Request references", href: "/contact?topic=sales" }} />
    </>
  );
}
