import { asc } from "drizzle-orm";
import { getDb, schema as t } from "@/db";
import { ListView } from "@/components/admin/ListView";
import { requireUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";

export const metadata = { title: "Pages" };

export default async function PagesAdmin() {
  const user = await requireUser("content.view");
  const db = await getDb();
  const pages = await db.select().from(t.pages).orderBy(asc(t.pages.sortOrder));
  return (
    <ListView
      title="Pages"
      intro="Homepage, corporate pages, legal pages and any new landing pages — each built from approved, responsive content sections."
      newHref="/admin/pages/new"
      newLabel="New page"
      columns={["Path", "Sections", "Updated"]}
      bulkEntity="page"
      reorderEntity="page"
      canEdit={can(user.role, "content.edit")}
      canPublish={can(user.role, "content.publish")}
      rows={pages.map((p) => ({ id: p.id, title: p.slug === "home" ? "Homepage" : p.title, subtitle: p.system ? "System page" : undefined, href: `/admin/pages/${p.id}`, status: p.status, cols: [p.slug === "home" ? "/" : `/${p.slug}`, p.sections.filter((s) => s.enabled).length, `${p.updatedAt.toLocaleDateString("en-GB")}${p.updatedBy ? ` · ${p.updatedBy}` : ""}`], search: `${p.title} ${p.slug}` }))}
    />
  );
}
