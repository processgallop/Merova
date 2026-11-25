import { getCatalog, getNavigation, getResources, getTheme, industryUrl, segmentUrl } from "@/lib/content";
import { HeaderNav, type MegaData } from "./HeaderNav";

export async function Header() {
  const [nav, theme, { segments, cards, industries, sectors }, resources] = await Promise.all([getNavigation(), getTheme(), getCatalog(), getResources()]);
  const data: MegaData = {
    segments: segments.map((s) => ({
      code: s.code,
      name: s.name,
      navName: s.navName,
      intro: s.intro,
      href: segmentUrl(s),
      image: s.image,
      count: cards.filter((c) => c.segment.id === s.id).length,
      families: s.families
        .map((f) => ({ name: f.name, products: cards.filter((c) => c.segment.id === s.id && c.family === f.name).map((c) => ({ name: c.shortName, href: c.url })) }))
        .concat([{ name: "More", products: cards.filter((c) => c.segment.id === s.id && !s.families.some((f) => f.name === c.family)).map((c) => ({ name: c.shortName, href: c.url })) }])
        .filter((f) => f.products.length),
    })),
    sectors: sectors
      .map((sec) => ({ name: sec.name, industries: industries.filter((i) => i.sectorId === sec.id && !i.isCatchAll).map((i) => ({ name: i.shortName || i.name, href: industryUrl(i), icon: i.icon })) }))
      .filter((s) => s.industries.length),
    otherIndustry: industries.find((i) => i.isCatchAll) ? industryUrl(industries.find((i) => i.isCatchAll)!) : "/custom-requirement",
    profileHref: resources.find((r) => r.kind === "profile")?.fileUrl ?? "/resources",
    catalogueHref: resources.find((r) => r.kind === "catalogue")?.fileUrl ?? "/resources",
  };
  return <HeaderNav nav={nav.filter((n) => n.enabled)} data={data} logo={theme.logoUrl} />;
}
