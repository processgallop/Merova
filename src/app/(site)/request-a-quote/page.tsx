import { EnquiryShell } from "@/components/forms/EnquiryShell";
import { meta } from "@/lib/meta";

export const metadata = meta({ title: "Request a Quote", description: "Request a packaging quotation from Merova Printpack — select one or several products, add specifications and files, and receive a reference immediately.", path: "/request-a-quote" });

export default function QuotePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <EnquiryShell mode="quote" eyebrow="Quotation" title="Request a Quote" intro="Select the products you need — one or several — and we will come back with a specification and quotation." searchParams={searchParams} />;
}
