import { CtaBand, PageHero, SectionHead } from "@/components/ui/blocks";
import { CLIENT_SERVICE } from "@/data/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Client Servicing | Merova Printpack", description: "A named coordinator, technical help, artwork management, sample approvals, order updates, dispatch communication and complaint resolution.", path: "/about/client-servicing/" });

export default function Page() {
  return (
    <>
      <PageHero crumbs={[{ name: "About Merova", href: "/about/" }, { name: "Client servicing", href: "/about/client-servicing/" }]} eyebrow="Client servicing" title="A named person from enquiry to repeat order." intro="Enquiries, specifications, artwork, samples, orders and dispatch are coordinated by one team, so you always know who to call." />
      <section className="section bg-sand">
        <div className="wrap wrap-wide">
          <SectionHead eyebrow="What you get" title="How enquiries and orders are run." />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{CLIENT_SERVICE.map((c, i) => <div key={c.name} className={`reveal rounded-[24px] p-6 ${i === 0 ? "bg-graphite text-white md:col-span-2" : "bg-white"}`} style={{ ["--i" as string]: i % 4 }}><h3 className={`h4 ${i === 0 ? "text-white" : ""}`}>{c.name}</h3><p className={`mt-2 text-[15px] ${i === 0 ? "text-[#cfc7c0]" : "text-stone"}`}>{c.text}</p></div>)}</div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
