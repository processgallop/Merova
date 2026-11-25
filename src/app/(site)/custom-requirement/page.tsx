import { EnquiryShell } from "@/components/forms/EnquiryShell";
import { meta } from "@/lib/meta";

export const metadata = meta({ title: "Discuss a Custom Packaging Requirement", description: "Share specifications, drawings, photographs or samples. Merova assesses your application and develops the right packaging through sampling.", path: "/custom-requirement" });

export default function CustomPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <EnquiryShell mode="custom" eyebrow="Have a different packaging requirement?" title="Your Requirements. Our Packaging Expertise." intro="Tell us what you are looking for. Share your specifications, drawings, photographs or existing samples. Our team will assess your application and help identify an appropriate packaging solution." searchParams={searchParams} />;
}
