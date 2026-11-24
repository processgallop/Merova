"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function Received() {
  const sp = useSearchParams();
  const ref = sp.get("ref"); const team = sp.get("team");
  return (
    <section className="section">
      <div className="wrap max-w-3xl text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-red" />
        <h1 className="h1 mt-6">{ref ? "We've received your enquiry." : "Thank you."}</h1>
        {ref && <p className="mx-auto mt-6 inline-block rounded-2xl bg-sand px-5 py-3 text-lg">Your reference: <strong className="tnum">{ref}</strong></p>}
        <p className="lede mx-auto mt-6">{team ? `It has been routed to our ${team} team. ` : ""}A packaging specialist will review it and contact you to confirm details, recommend a specification and arrange a quotation.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3"><Link href="/products/" className="btn btn-dark">Keep browsing <ArrowRight className="arrow h-4 w-4" /></Link><Link href="/resources/downloads/" className="btn btn-outline">Download the catalogue</Link></div>
      </div>
    </section>
  );
}
