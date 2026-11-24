import { CtaBand, PageHero } from "@/components/ui/blocks";
import { PROCESS_STEPS } from "@/data/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Our Packaging Process: Brief to Delivery | Merova Printpack",
  description: "Consultation, design, engineering, sampling, approval, manufacturing, quality inspection, dispatch and client support — how Merova delivers packaging projects.",
  path: "/process",
});

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Process excellence"
        title="From Your First Brief to Final Delivery. Every Stage Has a Purpose."
        intro="Nine stages, each with a clear output and a sign-off before the next begins. It is how a specification agreed on day one is still the specification on the hundredth repeat order."
        crumbs={[{ name: "Company", href: "/company" }, { name: "Process Excellence", href: "/process" }]}
      />
      <section className="py-14 lg:py-20">
        <ol className="container-x relative grid gap-5">
          {PROCESS_STEPS.map((s, i) => (
            <li key={s.name} className="grid gap-4 rounded-sm border border-line bg-white p-6 md:grid-cols-[6rem_14rem_1fr] md:items-baseline lg:p-8">
              <span className="font-display text-4xl font-semibold text-red-500">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="font-display text-xl font-semibold text-char-950">{s.name}</h2>
              <p className="leading-relaxed text-ink-2">{s.detail}</p>
            </li>
          ))}
        </ol>
      </section>
      <CtaBand title="Start at stage one." text="Tell us what you pack, how it ships and how many you need — that is the consultation brief." />
    </>
  );
}
