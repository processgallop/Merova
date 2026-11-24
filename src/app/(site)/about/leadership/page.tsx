import { Users } from "lucide-react";
import { CtaBand, PageHero, SectionHead } from "@/components/ui/blocks";
import { TEAM_FUNCTIONS } from "@/data/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Leadership & Team | Merova Printpack", description: "The functions behind every Merova order: management, production, quality, technical, design and customer service.", path: "/about/leadership/", noindex: true });

export default function Page() {
  return (
    <>
      <PageHero crumbs={[{ name: "About Merova", href: "/about/" }, { name: "Leadership & team", href: "/about/leadership/" }]} eyebrow="Leadership & team" title="The people behind every order." intro="Leadership profiles and photographs will be published here once supplied with consent. Until then, this is how the team is organised." />
      <section className="section bg-sand">
        <div className="wrap wrap-wide">
          <SectionHead eyebrow="Functions" title="Who does what." />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{TEAM_FUNCTIONS.map((t, i) => <div key={t.name} className="reveal rounded-[24px] bg-white p-6" style={{ ["--i" as string]: i % 3 }}><span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-red"><Users className="h-5 w-5" /></span><h3 className="mt-5 h4">{t.name}</h3><p className="mt-2 text-[15px] text-stone">{t.text}</p></div>)}</div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
