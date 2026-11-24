import { PageHero } from "@/components/ui/blocks";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Terms and Conditions | Merova Printpack", description: "Terms of use for the Merova Printpack website.", path: "/terms" });

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms and Conditions" intro={`Terms governing your use of the ${site.name} website.`} crumbs={[{ name: "Terms", href: "/terms" }]} />
      <section className="py-14">
        <div className="container-x prose-merova max-w-3xl">
          <h2>Website information</h2>
          <p>Content on this website is provided for general information about Merova&apos;s packaging products and services. Specifications marked as industry reference are general technical information. Specifications marked &ldquo;confirmed at quotation&rdquo; are confirmed for each order and are not offers or guarantees until stated in a written quotation.</p>
          <h2>Images</h2>
          <p>Product visuals are format illustrations or representative imagery unless stated otherwise, and may not show the exact appearance, colour or construction of the packaging you order.</p>
          <h2>Quotations and orders</h2>
          <p>Submitting an enquiry does not create a contract. Prices, specifications, quantities, lead times and delivery terms apply only when confirmed in a written quotation and accepted order.</p>
          <h2>AI assistant</h2>
          <p>Mira is an AI assistant that provides general guidance based on information published on this website. It can make mistakes and cannot make commitments on Merova&apos;s behalf. Always confirm requirements with the Merova team.</p>
          <h2>Downloads</h2>
          <p>Flyers, catalogues and brochures may be shared for evaluating Merova&apos;s products. They may not be altered or presented as another company&apos;s material.</p>
          <h2>Intellectual property</h2>
          <p>The Merova name, logo, website design and content belong to {site.contact.legalName} or its licensors. Designs, drawings and artwork you submit remain yours and are used only to respond to your enquiry.</p>
          <h2>Liability</h2>
          <p>We take care to keep information accurate, but we do not warrant that the website is error-free or always available. To the extent permitted by law, we are not liable for losses arising from reliance on general website information.</p>
          <h2>Governing law</h2>
          <p>These terms are governed by the laws of India.</p>
        </div>
      </section>
    </>
  );
}
