import { notFound } from "next/navigation";
import { and, asc, eq, inArray } from "drizzle-orm";
import { getDb, schema as t } from "@/db";
import { requireUser } from "@/lib/auth/session";
import { Sections } from "@/components/sections/Sections";
import { ProductView } from "@/components/product/ProductView";
import { RichText } from "@/components/ui/RichText";
import { getCatalog } from "@/lib/content";
import { blocksToText } from "@/lib/admin/entities";

export const dynamic = "force-dynamic";
export const metadata = { title: "Preview", robots: { index: false, follow: false } };

/** Draft preview for signed-in staff: renders the saved record regardless of publication status. */
export default async function Preview({ params }: { params: Promise<{ type: string; id: string }> }) {
  const { type, id } = await params;
  await requireUser("content.view");
  const db = await getDb();
  const n = Number(id);
  const banner = <div className="sticky top-[var(--header-h)] z-40 bg-amber-400 px-4 py-2 text-center text-sm font-semibold text-ink">Preview — this view may include unpublished content.</div>;
  if (type === "page") {
    const [p] = await db.select().from(t.pages).where(eq(t.pages.id, n));
    if (!p) notFound();
    return <>{banner}<Sections sections={p.sections} /></>;
  }
  if (type === "product") {
    const [product] = await db.select().from(t.products).where(eq(t.products.id, n));
    if (!product) notFound();
    const [segment] = await db.select().from(t.segments).where(eq(t.segments.id, product.segmentId));
    const { cards } = await getCatalog();
    const rel = await db.select().from(t.productRelations).where(eq(t.productRelations.productId, n)).orderBy(asc(t.productRelations.sortOrder));
    const links = await db.select().from(t.productIndustries).where(eq(t.productIndustries.productId, n));
    const industries = links.length ? await db.select().from(t.industries).where(and(inArray(t.industries.id, links.map((l) => l.industryId)))) : [];
    return <>{banner}<ProductView r={{ product, segment, related: rel.map((r) => cards.find((c) => c.id === r.relatedId)).filter((c): c is (typeof cards)[number] => Boolean(c)), industries }} /></>;
  }
  if (type === "post") {
    const [p] = await db.select().from(t.posts).where(eq(t.posts.id, n));
    if (!p) notFound();
    return (
      <>
        {banner}
        <article className="wrap max-w-3xl py-16">
          <h1 className="t-display">{p.title}</h1>
          <p className="t-lead mt-6">{p.intro}</p>
          <div className="mt-10">{p.body.map((s, i) => <section key={i}><RichText text={`## ${s.heading}\n\n${blocksToText(s.blocks)}`} /></section>)}</div>
        </article>
      </>
    );
  }
  notFound();
}
