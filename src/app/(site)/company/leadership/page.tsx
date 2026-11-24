import { CtaBand, PageHero, Pending } from "@/components/ui/blocks";
import { TEAM_FUNCTIONS } from "@/data/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Leadership & Team | Merova Printpack",
  description: "The functions behind every Merova packaging solution: management, production, quality, technical specialists, design and customer service.",
  path: "/company/leadership",
});

export default function LeadershipPage() {
  return (
    <>
      <PageHero
        eyebrow="Leadership & team"
        title="The People, Experience and Expertise Behind Every Packaging Solution."
        intro="Every Merova project draws on six functions, each accountable for its part of the outcome — from the first conversation to the delivered pallet."
        crumbs={[{ name: "Company", href: "/company" }, { name: "Leadership & Team", href: "/company/leadership" }]}
      />
      <section className="py-14 lg:py-20">
        <div className="container-x grid gap-8">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM_FUNCTIONS.map((t) => (
              <li key={t.name} className="rounded-sm border border-line bg-white p-6">
                <h2 className="font-display text-lg font-semibold text-char-950">{t.name}</h2>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-2">{t.text}</p>
              </li>
            ))}
          </ul>
          <Pending>Named leadership profiles, photographs and experience are published only once supplied and approved by the individuals concerned.</Pending>
        </div>
      </section>
      <CtaBand title="Want to work with the team?" text="Start with your packaging requirement, or explore careers at Merova." secondary={{ label: "Careers", href: "/company/careers" }} />
    </>
  );
}
