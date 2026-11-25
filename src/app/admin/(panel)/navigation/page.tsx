import { requireUser } from "@/lib/auth/session";
import { getFooter, getNavigation } from "@/lib/content";
import { NavEditor } from "@/components/admin/NavEditor";
import { SettingsForm } from "@/components/admin/SettingsForm";
import type { FieldDef } from "@/components/admin/types";

export const metadata = { title: "Navigation & footer" };

export default async function NavigationPage() {
  await requireUser("navigation.edit");
  const [nav, footer] = await Promise.all([getNavigation(), getFooter()]);
  const footerFields: FieldDef[] = [
    { key: "statement", label: "Footer statement", type: "textarea" },
    { key: "showSegments", label: "Show product segments column", type: "checkbox" },
    { key: "showIndustries", label: "Show industries column", type: "checkbox" },
    { key: "columns", label: "Link columns", type: "pairs", hint: "Each column's links are edited below as “Label | /path” lines.", addLabel: "Add column", fields: [{ key: "title", label: "Column title", type: "text" }] },
    { key: "legal", label: "Legal & policy links", type: "pairs", addLabel: "Add link", fields: [{ key: "label", label: "Label", type: "text" }, { key: "href", label: "/path", type: "text" }] },
  ];
  return (
    <div className="space-y-12">
      <NavEditor initial={JSON.parse(JSON.stringify(nav))} footer={JSON.parse(JSON.stringify(footer))} />
      <SettingsForm settingKey="footer" title="Footer" intro="Statement, columns and legal links. Product segment and industry columns update automatically from the catalogue." fields={footerFields.filter((f) => f.key !== "columns")} initial={JSON.parse(JSON.stringify(footer))} />
    </div>
  );
}
