import { notFound } from "next/navigation";
import { EntityForm } from "@/components/admin/EntityForm";
import { requireUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import { loadForEdit } from "@/lib/admin/entities";
import { getAdminRefs, productTabs } from "@/lib/admin/forms";

export const metadata = { title: "Edit product" };

export default async function ProductEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser("catalog.view");
  const refs = await getAdminRefs();
  const isNew = id === "new";
  const row = isNew ? null : await loadForEdit("product", Number(id));
  if (!isNew && !row) notFound();
  const initial = row ?? {
    name: "", shortName: "", code: "", slug: "", segmentSlug: refs.segments[0]?.slug ?? "", family: "", headline: "", summary: "",
    overview: [], highlights: [], applications: [], formats: [], materials: [], specs: [], printing: [], customisation: [], quality: [], faqs: [],
    images: [], videoUrl: "", flyer: null, quoteProfile: "custom", availability: "pending", verification: "unverified", moq: "", leadTime: "", specNote: "",
    keywords: [], seo: {}, sortOrder: 999, status: "draft", publishedAt: "", industryLinks: [], related: [],
  };
  const p = row as { segmentSlug?: string; slug?: string; name?: string } | null;
  return (
    <EntityForm
      entity="product"
      id={isNew ? null : Number(id)}
      initial={JSON.parse(JSON.stringify(initial))}
      tabs={productTabs(refs)}
      refs={refs}
      title={isNew ? "New product" : p?.name ?? ""}
      canEdit={can(user.role, "catalog.edit")}
      canPublish={can(user.role, "catalog.publish")}
      canDelete={can(user.role, "catalog.publish")}
      listHref="/admin/products"
      publicHref={p ? `/products/${p.segmentSlug}/${p.slug}` : undefined}
      previewHref={isNew ? undefined : `/preview/product/${id}`}
      aside={<div className="rounded-[3px] border border-line bg-white p-4 text-xs leading-relaxed"><p className="font-semibold text-heading">Accuracy rules</p><p className="mt-1">Publish only verified specifications. Unconfirmed values should use “Confirmed at quotation”. Use “Capability pending” for anything management has not confirmed.</p></div>}
    />
  );
}
