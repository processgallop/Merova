import { requireUser } from "@/lib/auth/session";

export const metadata = { title: "Admin guide" };

const SECTIONS: [string, string[]][] = [
  ["Publishing workflow", ["Every record has a status: Draft → Pending review → Approved → Published → Archived.", "Editors without publishing rights can save drafts and submit for review; Product, Content and Super Administrators publish.", "Set a future publish date to schedule publication. Drafts, pending and archived content never appear on the website or in the sitemap.", "Every save keeps a revision. Open “Revision history” in any editor to restore an earlier version."]],
  ["Products & industries", ["A product exists once. Add industries on the product's “Industries & related” tab, or add products on an industry's “Product mapping” tab — both edit the same relationship.", "Removing an industry from a product removes it from that industry page only; the product is untouched.", "Changing a product's URL offers an automatic 301 redirect from the old address.", "Use the availability classification honestly: “Capability pending” shows a notice on the website."]],
  ["Homepage & pages", ["Pages are built from approved sections. Add, reorder (drag or arrows), hide, duplicate or remove sections; layouts adapt automatically to desktop, tablet and mobile.", "Statistics, testimonials and client logos appear only when ticked as verified/approved.", "Use the device buttons to preview the last saved version at different widths."]],
  ["Images & documents", ["Upload once in the Media library; uploads are optimised automatically.", "Mark stock imagery as stock — the website captions it as a representative image.", "“Replace everywhere” swaps an image across the whole site, ideal for replacing stock photos with authentic Merova photography.", "Replace a product flyer or catalogue PDF from the product or resource editor; all download links update."]],
  ["Enquiries", ["Every website form submission is stored with its products, specifications, files and source page.", "Assign enquiries, change status, add internal notes and export filtered lists to CSV.", "Email notifications require email delivery (Resend) to be configured by your developer."]],
  ["Brand & navigation", ["Brand colours, fonts and layout presets apply through site-wide design tokens. Merova Red should remain the primary colour.", "Use “Load defaults” to return to the official palette.", "The navigation should keep five primary items; the Products and Industries mega menus build themselves from the catalogue."]],
  ["Security", ["Turn on two-step verification in My account.", "Accounts lock for 15 minutes after five failed sign-ins.", "Super Administrators manage users, reset passwords and can review the audit log."]],
];

export default async function HelpPage() {
  await requireUser();
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-bold">Admin guide</h1>
      <p className="mt-1 text-sm">How to manage the Merova website day to day. The full guide is in docs/ADMIN-GUIDE.md in the project repository.</p>
      <div className="mt-8 space-y-6">
        {SECTIONS.map(([h, items]) => (
          <section key={h} className="rounded-[3px] border border-line bg-white p-5">
            <h2 className="font-display text-lg font-bold">{h}</h2>
            <ul className="prose-m mt-3 !text-sm"><>{items.map((i) => <li key={i}>{i}</li>)}</></ul>
          </section>
        ))}
      </div>
    </div>
  );
}
