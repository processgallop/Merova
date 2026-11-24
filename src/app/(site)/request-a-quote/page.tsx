import { QuotePageShell } from "@/components/forms/QuotePageShell";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Request a Packaging Quote | Merova Printpack",
  description: "Request a quotation for corrugated boxes, cartons, foodservice packaging, films and custom packaging. A short, product-specific form with optional file uploads.",
  path: "/request-a-quote",
});

export default function RequestQuotePage() {
  return (
    <QuotePageShell
      mode="quote"
      crumb={{ name: "Request a Quote", href: "/request-a-quote" }}
      title="Request a quote"
      intro="Four short steps. The form adapts to the product you choose and asks only for what matters — answer what you know and skip the rest."
    />
  );
}
