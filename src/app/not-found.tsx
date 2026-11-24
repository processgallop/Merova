import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-cloud px-4 py-20 text-center">
      <div>
        <Link href="/" aria-label="Merova Printpack home"><Logo height={56} className="mx-auto" /></Link>
        <p className="eyebrow mt-12">404</p>
        <h1 className="h1 mt-4">This page isn&apos;t here.</h1>
        <p className="lede mx-auto mt-5">It may have moved when the product range was reorganised. Start from one of these.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/products/" className="btn btn-dark">Browse products</Link>
          <Link href="/industries/" className="btn btn-outline">Find by industry</Link>
          <Link href="/request-a-quote/" className="btn btn-primary">Request a Quote</Link>
        </div>
      </div>
    </main>
  );
}
