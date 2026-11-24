import Link from "next/link";
import { CtaBand, PageHero, Pending } from "@/components/ui/blocks";
import { productsInVertical, productUrl, verticals } from "@/data/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Packaging Capabilities by Format | Merova Printpack",
  description: "Merova's packaging capabilities by material vertical — formats, material technologies, printing and finishing, and customisation options.",
  path: "/manufacturing/capabilities",
});

export default function CapabilitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Capabilities"
        title="Capabilities, organised by material and format."
        intro="What Merova can specify in each vertical — formats, material technologies, print and finishing, and customisation. Production routes (in-house or qualified partner) and equipment specifics are confirmed for each order."
        crumbs={[{ name: "Manufacturing", href: "/manufacturing" }, { name: "Capabilities", href: "/manufacturing/capabilities" }]}
      />
      <section className="py-14 lg:py-20">
        <div className="container-x grid gap-8">
          {verticals.map((v) => {
            const list = productsInVertical(v.id);
            const printing = Array.from(new Set(list.flatMap((p) => p.printing))).slice(0, 6);
            const custom = Array.from(new Set(list.flatMap((p) => p.customisation))).slice(0, 8);
            return (
              <article key={v.id} className="overflow-hidden rounded-md border border-line bg-white">
                <header className="flex flex-col gap-2 border-b border-line bg-paper-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="font-display text-xl font-semibold text-navy-950">{v.name}</h2>
                  <Link href={`/${v.slug}`} className="text-sm font-semibold text-navy-800 hover:text-signal-600">{list.length} product pages →</Link>
                </header>
                <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">
                  <Col title="Formats">{list.map((p) => <li key={p.slug}><Link href={productUrl(p)} className="hover:text-signal-600">{p.shortName ?? p.name}</Link></li>)}</Col>
                  <Col title="Material technologies">{v.technologies.map((t) => <li key={t.name}>{t.name}</li>)}</Col>
                  <Col title="Printing & finishing">{printing.map((t) => <li key={t}>{t}</li>)}</Col>
                  <Col title="Customisation">{custom.map((t) => <li key={t}>{t}</li>)}</Col>
                </div>
              </article>
            );
          })}
          <Pending>Equipment models, sheet and reel sizes, colour stations and capacity figures will be added once supplied and verified by Merova.</Pending>
        </div>
      </section>
      <CtaBand title="Need a capability confirmed?" text="Tell us the format and specification and the technical team will confirm feasibility." primary={{ label: "Contact Technical Support", href: "/contact?topic=technical" }} secondary={{ label: "Request a Quote", href: "/request-a-quote" }} />
    </>
  );
}

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted">{title}</h3>
      <ul className="mt-3 grid gap-1.5 text-[0.9rem] text-ink-2">{children}</ul>
    </div>
  );
}
