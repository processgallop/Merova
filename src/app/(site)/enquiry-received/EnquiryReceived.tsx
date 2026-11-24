"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Download, FileText } from "lucide-react";
import { Glyph } from "@/components/brand/Logo";

/**
 * Confirmation page. It is only reached by redirect after the API confirmed
 * acceptance. Visited directly without a reference, it says so instead of
 * claiming a submission.
 */
export function EnquiryReceived() {
  const p = useSearchParams();
  const ref = p.get("ref");
  const team = p.get("team");
  const ack = p.get("ack") === "1";
  const valid = ref && /^MRV-\d{8}-[0-9A-F]{6}$/.test(ref);

  if (!valid) {
    return (
      <section className="container-x py-20 text-center">
        <h1 className="t-2">No enquiry reference found</h1>
        <p className="lede mx-auto mt-4 max-w-xl">This page confirms submitted enquiries. If you meant to send one, please use the quote form.</p>
        <Link href="/request-a-quote" className="btn btn-primary mt-8">Request a Quote</Link>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container-x max-w-3xl">
        <div className="rounded-md border border-line bg-white p-8 text-center sm:p-12">
          <Glyph className="mx-auto h-8 w-auto" />
          <CheckCircle2 className="mx-auto mt-8 h-12 w-12 text-ok" aria-hidden />
          <h1 className="t-2 mt-5">Thank you — your enquiry has been received.</h1>
          <p className="mt-6 inline-block rounded bg-paper-2 px-4 py-2 font-mono text-sm text-navy-900">Reference: <strong>{ref}</strong></p>
          <p className="lede mx-auto mt-6 max-w-xl">
            It has been routed to our <strong>{team || "sales"}</strong> team, who will review your requirement and contact you to confirm details and next steps.
          </p>
          {ack ? (
            <p className="mt-3 text-sm text-muted">A confirmation email with your reference has been sent to you.</p>
          ) : (
            <p className="mt-3 text-sm text-muted">Please keep your reference number for any follow-up.</p>
          )}
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <Link href="/products" className="btn btn-outline">Browse products</Link>
            <a href="/assets/downloads/merova-product-catalogue.pdf" download className="btn btn-outline"><Download className="h-4 w-4" aria-hidden /> Catalogue</a>
            <a href="/assets/downloads/merova-company-profile.pdf" download className="btn btn-outline"><FileText className="h-4 w-4" aria-hidden /> Company profile</a>
          </div>
        </div>
      </div>
    </section>
  );
}
