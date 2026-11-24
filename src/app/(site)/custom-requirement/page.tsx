import { QuotePageShell } from "@/components/forms/QuotePageShell";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Discuss a Custom Packaging Requirement | Merova Printpack",
  description: "Have a packaging requirement that isn't listed? Share your specifications, drawings, photographs or samples and Merova will assess your application.",
  path: "/custom-requirement",
});

export default function CustomRequirementPage() {
  return (
    <QuotePageShell
      mode="custom"
      crumb={{ name: "Custom Requirement", href: "/custom-requirement" }}
      title="Have a different packaging requirement?"
      intro="Tell us what you are looking for. Share your specifications, drawings, photographs or sample requirements. Our team will assess your application and help identify the appropriate packaging solution."
    />
  );
}
