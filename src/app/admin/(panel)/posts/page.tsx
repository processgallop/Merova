import { desc } from "drizzle-orm";
import { getDb, schema as t } from "@/db";
import { ListView } from "@/components/admin/ListView";
import { requireUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";

export const metadata = { title: "Knowledge centre" };

export default async function PostsAdmin() {
  const user = await requireUser("content.view");
  const db = await getDb();
  const [posts, cats] = await Promise.all([db.select().from(t.posts).orderBy(desc(t.posts.publishedAt)), db.select().from(t.postCategories)]);
  return (
    <ListView
      title="Knowledge centre"
      intro="Technical guides and articles. Articles stay out of search engines until a named Merova reviewer approves them."
      newHref="/admin/posts/new"
      newLabel="New article"
      columns={["Category", "Review", "Published"]}
      filters={[{ key: "cat", label: "Categories", options: cats.map((c) => ({ value: String(c.id), label: c.name })) }, { key: "review", label: "Review states", options: [{ value: "pending", label: "Pending review" }, { value: "reviewed", label: "Reviewed" }] }]}
      bulkEntity="post"
      canEdit={can(user.role, "content.edit")}
      canPublish={can(user.role, "content.publish")}
      rows={posts.map((p) => ({ id: p.id, title: p.title, subtitle: `/knowledge/${p.slug}`, href: `/admin/posts/${p.id}`, status: p.status, thumb: p.cover?.url ?? null, cols: [cats.find((c) => c.id === p.categoryId)?.name ?? "—", p.reviewStatus === "reviewed" ? `Reviewed${p.reviewer ? ` · ${p.reviewer}` : ""}` : "Pending", p.publishedAt ? p.publishedAt.toLocaleDateString("en-GB") : "—"], filter: { cat: String(p.categoryId ?? ""), review: p.reviewStatus }, search: `${p.title} ${p.slug} ${p.tags.join(" ")}` }))}
    />
  );
}
