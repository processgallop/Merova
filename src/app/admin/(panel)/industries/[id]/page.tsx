import { notFound } from "next/navigation";
import { EntityForm } from "@/components/admin/EntityForm";
import { requireUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import { loadForEdit } from "@/lib/admin/entities";
import { getAdminRefs, industryTabs } from "@/lib/admin/forms";

export const metadata = { title: "Edit industry" };

export default async function IndustryEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser("catalog.view");
  const refs = await getAdminRefs();
  const isNew = id === "new";
  const row = isNew ? null : await loadForEdit("industry", Number(id));
  if (!isNew && !row) notFound();
  const initial = row ?? { name: "", shortName: "", slug: "", sectorSlug: refs.sectors[0]?.slug ?? "", icon: "Boxes", headline: "", intro: "", subIndustries: [], challenges: [], considerations: [], faqs: [], image: null, banner: null, isCatchAll: false, seo: {}, sortOrder: 99, status: "draft", productLinks: [] };
  const r = row as { slug?: string; name?: string } | null;
  return (
    <EntityForm entity="industry" id={isNew ? null : Number(id)} initial={JSON.parse(JSON.stringify(initial))} tabs={industryTabs(refs)} refs={refs} title={isNew ? "New industry" : r?.name ?? ""}
      canEdit={can(user.role, "catalog.edit")} canPublish={can(user.role, "catalog.publish")} canDelete={can(user.role, "catalog.publish")}
      listHref="/admin/industries" publicHref={r ? `/industries/${r.slug}` : undefined} />
  );
}
