import Link from "next/link";
import { Glyph } from "@/components/brand/Logo";
import { SiteChrome } from "@/components/layout/SiteChrome";

export default function NotFound() {
  return (
    <SiteChrome>
    <section className="container-x py-24 text-center lg:py-32">
      <Glyph className="mx-auto h-8 w-auto" />
      <p className="eyebrow mt-8">404</p>
      <h1 className="t-1 mt-3">This page isn&apos;t here.</h1>
      <p className="lede mx-auto mt-4 max-w-xl">It may have moved. Find what you need from one of these starting points.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/products" className="btn btn-navy">Browse products</Link>
        <Link href="/industries" className="btn btn-outline">Solutions by industry</Link>
        <Link href="/request-a-quote" className="btn btn-primary">Request a Quote</Link>
      </div>
    </section>
    </SiteChrome>
  );
}
