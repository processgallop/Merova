import { notFound, permanentRedirect, redirect } from "next/navigation";
import { Sections } from "@/components/sections/Sections";
import { Crumbs } from "@/components/ui/blocks";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";
import { findRedirect, getPage, getPublishedPages } from "@/lib/content";
import { meta } from "@/lib/meta";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const pages = await getPublishedPages();
  return pages.filter((p) => p.slug !== "home").map((p) => ({ slug: p.slug.split("/") }));
}

type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const path = slug.join("/");
  const page = await getPage(path);
  if (!page) return {};
  return meta({ title: page.title, path: `/${path}`, seo: page.seo });
}

/** Renders any CMS page created in /admin/pages. Unknown paths fall back to managed redirects, then 404. */
export default async function CmsPage({ params }: Props) {
  const { slug } = await params;
  const path = slug.map(decodeURIComponent).join("/");
  const page = path === "home" ? null : await getPage(path);
  if (!page) {
    const r = await findRedirect(`/${path}`);
    if (r) (r.permanent ? permanentRedirect : redirect)(r.toPath);
    notFound();
  }
  const trail = slug.map((_, i) => slug.slice(0, i + 1).join("/"));
  const crumbs = await Promise.all(trail.map(async (p) => ({ name: (await getPage(p))?.title ?? p.split("/").pop()!, href: `/${p}` })));
  return (
    <>
      <Sections sections={page.sections} crumbs={<Crumbs items={crumbs} />} />
      <JsonLd data={breadcrumbLd(crumbs)} />
    </>
  );
}
