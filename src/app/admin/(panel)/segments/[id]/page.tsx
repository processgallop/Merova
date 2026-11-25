import { notFound } from "next/navigation";
import { EntityForm } from "@/components/admin/EntityForm";
import { requireUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import { loadForEdit } from "@/lib/admin/entities";
import { segmentTabs } from "@/lib/admin/forms";

export const metadata = { title: "Edit segment" };

export default async function SegmentEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser("catalog.view");
  const isNew = id === "new";
  const row = isNew ? null : await loadForEdit("segment", Number(id));
  if (!isNew && !row) notFound();
  const initial = row ?? { name: "", navName: "", code: "", slug: "", headline: "", intro: "", description: "", technologies: [], families: [], image: null, banner: null, faqs: [], seo: {}, sortOrder: 99, status: "draft" };
  const r = row as { slug?: string; name?: string } | null;
  return (
    <EntityForm entity="segment" id={isNew ? null : Number(id)} initial={JSON.parse(JSON.stringify(initial))} tabs={segmentTabs()} title={isNew ? "New segment" : r?.name ?? ""}
      canEdit={can(user.role, "catalog.edit")} canPublish={can(user.role, "catalog.publish")} canDelete={can(user.role, "catalog.publish")}
      listHref="/admin/segments" publicHref={r ? `/products/${r.slug}` : undefined} />
  );
}
