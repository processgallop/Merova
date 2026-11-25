import { notFound } from "next/navigation";
import { EntityForm } from "@/components/admin/EntityForm";
import { requireUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import { loadForEdit } from "@/lib/admin/entities";
import { getAdminRefs, postTabs } from "@/lib/admin/forms";

export const metadata = { title: "Edit article" };

export default async function PostEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser("content.view");
  const refs = await getAdminRefs();
  const isNew = id === "new";
  const row = isNew ? null : await loadForEdit("post", Number(id));
  if (!isNew && !row) notFound();
  const initial = row ?? { title: "", slug: "", categorySlug: refs.categories[0]?.slug ?? "", excerpt: "", intro: "", author: "Merova Technical Team", tags: [], publishedAt: "", bodyText: [{ heading: "", text: "" }], recommendations: [], faqs: [], cover: null, videoUrl: "", relatedProducts: [], relatedPosts: [], reviewStatus: "pending", reviewer: "", seo: {}, status: "draft" };
  const r = row as { slug?: string; title?: string } | null;
  return (
    <EntityForm entity="post" id={isNew ? null : Number(id)} initial={JSON.parse(JSON.stringify(initial))} tabs={postTabs(refs)} refs={refs} title={isNew ? "New article" : r?.title ?? ""}
      canEdit={can(user.role, "content.edit")} canPublish={can(user.role, "content.publish")} canDelete={can(user.role, "content.publish")}
      listHref="/admin/posts" publicHref={r ? `/knowledge/${r.slug}` : undefined} previewHref={isNew ? undefined : `/preview/post/${id}`} />
  );
}
