import Link from "next/link";
import { Emblem, Logo } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-cloud">
      <div className="wrap py-6"><Link href="/" aria-label="Merova home"><Logo height={28} /></Link></div>
      <Emblem mode="draw" strokeWidth={1.5} className="pointer-events-none absolute -right-[10%] top-1/4 w-[80%] opacity-20" />
      <div className="wrap relative flex flex-1 flex-col justify-center pb-24">
        <p className="eyebrow">Error 404</p>
        <h1 className="t-hero mt-6 max-w-3xl">This page took a different route.</h1>
        <p className="t-lead mt-6 max-w-xl">The page you were looking for has moved or no longer exists. Start from your industry, browse the portfolio, or tell us what you need.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/industries" className="btn"><span>Find packaging for your industry</span></Link>
          <Link href="/products" className="btn btn-outline"><span>Explore products</span></Link>
          <Link href="/contact" className="btn btn-outline"><span>Contact us</span></Link>
        </div>
      </div>
    </div>
  );
}
