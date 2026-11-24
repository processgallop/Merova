import Link from "next/link";
import { CtaBand, PageHero, Pending } from "@/components/ui/blocks";
import { pageMetadata } from "@/lib/seo";

// noindex until genuine, client-approved case studies are published (avoids thin content).
export const metadata = pageMetadata({
  title: "Case Studies | Merova Printpack",
  description: "Client-approved Merova packaging case studies: the challenge, the approach, the specification and the verified result.",
  path: "/company/case-studies",
  noindex: true,
});

const FRAMEWORK = [
  { k: "Challenge", v: "The product, route and problem — damage, cost, presentation, compliance or speed." },
  { k: "Approach", v: "Options considered, materials and structures proposed, and why." },
  { k: "Specification", v: "The approved construction, materials, print and quality checks." },
  { k: "Result", v: "The measured outcome, verified with the client before publication." },
];

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Case studies"
        title="Packaging problems solved — documented with our clients."
        intro="Every Merova case study follows the same structure and is published only with the client's approval of both the content and the results."
        crumbs={[{ name: "Company", href: "/company" }, { name: "Case Studies", href: "/company/case-studies" }]}
      />
      <section className="py-14 lg:py-20">
        <div className="container-x grid gap-8">
          <ol className="grid gap-5 md:grid-cols-4">
            {FRAMEWORK.map((f, i) => (
              <li key={f.k} className="rounded-sm border border-line bg-white p-6">
                <span className="font-display text-2xl font-semibold text-red-500">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-2 font-display text-lg font-semibold text-char-950">{f.k}</h2>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-2">{f.v}</p>
              </li>
            ))}
          </ol>
          <Pending>No case studies are published yet. They will appear here once prepared with, and approved by, Merova clients.</Pending>
          <p className="text-ink-2">Meanwhile, explore <Link href="/industries" className="font-semibold text-char-800 underline underline-offset-2">solutions by industry</Link> or our <Link href="/blog" className="font-semibold text-char-800 underline underline-offset-2">technical guides</Link>.</p>
        </div>
      </section>
      <CtaBand title="Have a packaging challenge like these?" text="Describe the problem and the team will propose an approach." primary={{ label: "Discuss Your Requirement", href: "/custom-requirement" }} />
    </>
  );
}
