import { Suspense } from "react";
import { PageHero } from "@/components/ui/blocks";
import { SearchResults } from "./Results";
import { clientIndex } from "@/data/catalog";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata({ title: "Search | Merova Printpack", description: "Search Merova packaging products and industries.", path: "/search/", noindex: true });
export default function Page() { return <><PageHero crumbs={[{ name: "Search", href: "/search/" }]} title="Search products and industries." /><section className="section-tight bg-sand"><div className="wrap wrap-wide"><Suspense><SearchResults index={clientIndex} /></Suspense></div></section></>; }
