import "server-only";
import { getCatalog, industryUrl } from "./content";
import { APPLICATION_GROUPS, groupsFor, MATERIAL_GROUPS } from "./taxonomy";
import type { CardData } from "@/components/product/ProductCard";
import type { ImageRef } from "@/db/types";

export interface DiscoveryProduct extends CardData {
  id: number;
  materialGroups: string[];
  applicationGroups: string[];
  search: string;
}
export interface DiscoveryIndustry {
  id: number;
  slug: string;
  name: string;
  shortName: string;
  sectorId: number | null;
  icon: string;
  intro: string;
  image: ImageRef | null;
  sub: string[];
  url: string;
  isCatchAll: boolean;
  /** Ordered product ids (primary relevance first) with optional application context. */
  products: { id: number; context: string | null }[];
}
export interface DiscoveryData {
  sectors: { id: number; name: string }[];
  segments: { id: number; code: string; name: string; navName: string }[];
  industries: DiscoveryIndustry[];
  products: DiscoveryProduct[];
  materials: { id: string; label: string }[];
  applications: { id: string; label: string }[];
}

/** Everything the industry discovery engine needs, generated from the central product/industry records. */
export async function getDiscoveryData(): Promise<DiscoveryData> {
  const { segments, sectors, industries, cards, links } = await getCatalog();
  const products: DiscoveryProduct[] = cards.map((c) => {
    const text = [c.name, c.family, c.summary, ...c.materials].join(" ");
    const appText = [c.name, c.family, ...c.applications, ...c.formats].join(" ");
    return {
      id: c.id,
      slug: c.slug,
      name: c.name,
      shortName: c.shortName,
      summary: c.summary,
      family: c.family,
      segment: c.segment,
      image: c.image,
      url: c.url,
      flyer: c.flyer,
      code: c.code,
      availability: c.availability,
      materials: c.materials,
      materialGroups: groupsFor(text, MATERIAL_GROUPS),
      applicationGroups: groupsFor(appText, APPLICATION_GROUPS),
      search: [c.name, c.shortName, c.family, c.segment.name, ...c.materials, ...c.applications].join(" ").toLowerCase(),
    };
  });
  return {
    sectors: sectors.map((s) => ({ id: s.id, name: s.name })),
    segments: segments.map((s) => ({ id: s.id, code: s.code, name: s.name, navName: s.navName })),
    industries: industries.map((i) => ({
      id: i.id,
      slug: i.slug,
      name: i.name,
      shortName: i.shortName || i.name,
      sectorId: i.sectorId,
      icon: i.icon,
      intro: i.intro,
      image: i.banner ?? i.image,
      sub: i.subIndustries,
      url: industryUrl(i),
      isCatchAll: i.isCatchAll,
      products: links
        .filter((l) => l.industryId === i.id)
        .sort((a, b) => (a.relevance === b.relevance ? a.sortOrder - b.sortOrder : a.relevance === "primary" ? -1 : 1))
        .map((l) => ({ id: l.productId, context: l.context })),
    })),
    products,
    materials: MATERIAL_GROUPS.filter((g) => products.some((p) => p.materialGroups.includes(g.id))).map(({ id, label }) => ({ id, label })),
    applications: APPLICATION_GROUPS.filter((g) => products.some((p) => p.applicationGroups.includes(g.id))).map(({ id, label }) => ({ id, label })),
  };
}
