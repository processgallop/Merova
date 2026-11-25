import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Emblem } from "@/components/brand/Logo";

export const metadata = { title: "Enquiry received", robots: { index: false } };

export default async function Received({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams;
  const valid = ref && /^MRV-\d{8}-[A-F0-9]{6}$/.test(ref);
  return (
    <section className="relative overflow-hidden">
      <Emblem mode="draw" strokeWidth={1.4} className="pointer-events-none absolute -right-[10%] top-10 w-[70%] opacity-20" />
      <div className="wrap relative py-24">
        <CheckCircle2 className="size-12 text-red" />
        <p className="eyebrow mt-8">Enquiry received</p>
        <h1 className="t-display mt-5 max-w-3xl">Thank you — your enquiry is with our team.</h1>
        {valid ? (
          <p className="mt-8 inline-flex items-center gap-3 border border-line bg-surface px-5 py-3 text-heading">Your reference: <strong className="font-display text-xl tracking-tight">{ref}</strong></p>
        ) : null}
        <div className="mt-10 max-w-2xl space-y-3">
          <p className="font-semibold text-heading">What happens next</p>
          <ol className="prose-m"><li>The team reviews your requirement and any files you attached.</li><li>A specialist contacts you to confirm details and recommend a specification.</li><li>Samples and a quotation are arranged where appropriate.</li></ol>
          <p className="text-sm text-muted">Please quote your reference in any follow-up.</p>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/industries" className="btn btn-outline"><span>Continue exploring</span></Link>
          <Link href="/resources" className="btn btn-outline"><span>Download the catalogue</span></Link>
        </div>
      </div>
    </section>
  );
}
