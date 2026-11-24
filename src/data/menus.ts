import { industries, products, verticals, productUrl } from "./catalog";

/** Catalogue-derived menus, built on the server and passed to the client header as props. */
export function buildMenus() {
  const productMenu = verticals.map((v) => {
    const items = products.filter((p) => p.vertical === v.id);
    return {
      title: v.navName,
      href: `/${v.slug}`,
      count: items.length,
      items: items.slice(0, 7).map((p) => ({ label: p.shortName ?? p.name, href: productUrl(p) })),
    };
  });
  const industryMenu = industries.map((i) => ({
    label: i.name,
    short: i.shortName,
    href: `/industries/${i.slug}`,
    icon: i.icon,
  }));
  return { productMenu, industryMenu };
}

export type Menus = ReturnType<typeof buildMenus>;
