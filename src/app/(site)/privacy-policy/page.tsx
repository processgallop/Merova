import { PageHero } from "@/components/ui/blocks";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Privacy Policy | Merova Printpack", description: "How Merova Printpack collects, uses and protects personal information submitted through this website.", path: "/privacy-policy" });

export default function PrivacyPage() {
  const c = site.contact;
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" intro={`How ${c.legalName} handles personal information submitted through ${site.url.replace(/^https?:\/\//, "")}.`} crumbs={[{ name: "Privacy Policy", href: "/privacy-policy" }]} />
      <section className="py-14">
        <div className="container-x prose-merova max-w-3xl">
          <h2>Information we collect</h2>
          <p>When you submit a quote request, custom requirement or contact form we collect the details you provide: name, company, business email, phone number, location, your enquiry, product and industry selections, technical requirements and any files you attach. We also record the page you submitted from, the referring page and campaign parameters (UTM tags) so we can understand how enquiries reach us.</p>
          <h2>How we use it</h2>
          <ul>
            <li>To respond to your enquiry, prepare quotations and arrange samples.</li>
            <li>To route your enquiry to the relevant team and keep a record of it in our enquiry management system.</li>
            <li>To send you an acknowledgement and follow-up communication about your enquiry.</li>
          </ul>
          <p>We do not sell your personal information, and we do not use enquiry data for unrelated marketing without your consent.</p>
          <h2>Service providers</h2>
          <p>We use trusted providers to operate this website: hosting, email delivery, our customer relationship management system and, where enabled, spam protection. If you use Mira, the AI assistant, your messages are processed by our AI provider to generate replies; please do not share sensitive personal information in the chat. WhatsApp conversations are subject to WhatsApp&apos;s own terms and privacy policy.</p>
          <h2 id="cookies">Cookies and analytics</h2>
          <p>Essential operation of this site does not require cookies. If analytics is enabled, analytics cookies (Google Analytics / Google Tag Manager) are set only after you accept them in the cookie banner. You can change your choice at any time using &ldquo;Cookie settings&rdquo; in the footer. We store your choice in your browser&apos;s local storage.</p>
          <h2>Retention</h2>
          <p>We keep enquiry records for as long as needed to respond, maintain a business relationship and meet legal obligations, and then delete or anonymise them.</p>
          <h2>Your rights</h2>
          <p>Subject to applicable law, including India&apos;s Digital Personal Data Protection Act, 2023, you may ask to access, correct or delete your personal information, or withdraw consent. To make a request, use the contact form and select &ldquo;Sales enquiry&rdquo;, or email us{c.email ? <> at <a href={`mailto:${c.email}`}>{c.email}</a></> : ""}.</p>
          <h2>Security</h2>
          <p>Forms are submitted over encrypted connections. Access to enquiry data is limited to staff and providers who need it to respond to you.</p>
          <h2>Changes</h2>
          <p>We may update this policy as our services change. The current version is always published on this page.</p>
        </div>
      </section>
    </>
  );
}
