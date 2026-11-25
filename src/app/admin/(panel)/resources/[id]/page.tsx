import { notFound } from "next/navigation";
import { EntityForm } from "@/components/admin/EntityForm";
import { requireUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import { loadForEdit } from "@/lib/admin/entities";
import { resourceTabs } from "@/lib/admin/forms";

export const metadata = { title: "Edit resource" };

export default async function ResourceEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser("content.view");
  const isNew = id === "new";
  const row = isNew ? null : await loadForEdit("resource", Number(id));
  if (!isNew && !row) notFound();
  const initial = row ?? { title: "", slug: "", kind: "brochure", description: "", file: null, sortOrder: 99, status: "published" };
  return (
    <EntityForm entity="resource" id={isNew ? null : Number(id)} initial={JSON.parse(JSON.stringify(initial))} tabs={resourceTabs()} title={isNew ? "New resource" : (row as { title?: string }).title ?? ""}
      canEdit={can(user.role, "content.edit")} canPublish={can(user.role, "content.publish")} canDelete={can(user.role, "content.publish")} listHref="/admin/resources" publicHref="/resources" />
  );
}
