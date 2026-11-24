import { CtaBand, PageHero } from "@/components/ui/blocks";
import { CLIENT_SERVICE } from "@/data/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Client Servicing | Merova Printpack",
  description: "Dedicated coordination, technical assistance, artwork management, sample approvals, order updates, dispatch communication and complaint resolution.",
  path: "/company/client-service",
});

export default function ClientServicePage() {
  return (
    <>
      <PageHero
        eyebrow="Client servicing"
        title="A Responsive Packaging Partner. Before, During and After Production."
        intro="Packaging projects involve artwork, samples, approvals, schedules and deliveries. Merova's client servicing keeps each of those visible and accountable."
        crumbs={[{ name: "Company", href: "/company" }, { name: "Client Servicing", href: "/company/client-service" }]}
      />
      <section className="py-14 lg:py-20">
        <ul className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CLIENT_SERVICE.map((c, i) => (
            <li key={c.name} className="rounded-sm border border-line bg-white p-6">
              <span className="font-display text-2xl font-semibold text-red-500">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="mt-2 font-display text-lg font-semibold text-char-950">{c.name}</h2>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-2">{c.text}</p>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand title="Existing customer with a question?" text="Use the contact form and choose 'Existing order' so your message reaches customer service directly." primary={{ label: "Contact Customer Service", href: "/contact?topic=orders" }} secondary={{ label: "Request a Quote", href: "/request-a-quote" }} />
    </>
  );
}
