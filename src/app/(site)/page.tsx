import { notFound } from "next/navigation";
import { Sections } from "@/components/sections/Sections";
import { getPage } from "@/lib/content";
import { meta } from "@/lib/meta";

export const revalidate = 3600;

export async function generateMetadata() {
  const page = await getPage("home");
  return meta({ title: "Merova Printpack — Packaging, Perfected.", path: "/", seo: page?.seo, absoluteTitle: true });
}

export default async function Home() {
  const page = await getPage("home");
  if (!page) notFound();
  return <Sections sections={page.sections} />;
}
