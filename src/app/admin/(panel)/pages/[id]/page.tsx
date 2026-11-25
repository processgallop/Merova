import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb, schema as t } from "@/db";
import { PageBuilder } from "@/components/admin/PageBuilder";
import { requireUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import { loadForEdit } from "@/lib/admin/entities";
import { getAdminRefs } from "@/lib/admin/forms";

export const metadata = { title: "Edit page" };

export default async function PageEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id: raw } = await params;
  const user = await requireUser("content.view");
  const refs = await getAdminRefs();
  let id: number | null = raw === "new" ? null : Number(raw);
  if (raw === "home") {
    const db = await getDb();
    const [home] = await db.select({ id: t.pages.id }).from(t.pages).where(eq(t.pages.slug, "home"));
    id = home?.id ?? null;
  }
  const row = id ? await loadForEdit("page", id) : null;
  if (id && !row) notFound();
  const initial = row ?? { slug: "new-page", title: "", navLabel: null, template: "standard", sections: [], seo: {}, status: "draft", publishedAt: "" };
  return <PageBuilder id={id} initial={JSON.parse(JSON.stringify(initial))} refs={refs} canEdit={can(user.role, "content.edit")} canPublish={can(user.role, "content.publish")} />;
}
