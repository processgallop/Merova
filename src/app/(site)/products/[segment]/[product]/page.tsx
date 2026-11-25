import { notFound, permanentRedirect } from "next/navigation";
import { ProductView } from "@/components/product/ProductView";
import { findRedirect, getProductBySlugs, getProducts, getSegments, productUrl } from "@/lib/content";
import { meta } from "@/lib/meta";

export const revalidate = 3600;
type Props = { params: Promise<{ segment: string; product: string }> };

export async function generateStaticParams() {
  const [segs, prods] = await Promise.all([getSegments(), getProducts()]);
  return prods.map((p) => ({ segment: segs.find((s) => s.id === p.segmentId)!.slug, product: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { segment, product } = await params;
  const r = await getProductBySlugs(segment, product);
  if (!r) return {};
  return meta({ title: r.product.name, description: r.product.summary, path: productUrl(r.segment.slug, r.product), seo: r.product.seo, image: r.product.images[0]?.url });
}


export default async function ProductPage({ params }: Props) {
  const { segment, product: slug } = await params;
  const r = await getProductBySlugs(segment, slug);
  if (!r) {
    const red = await findRedirect(`/products/${segment}/${slug}`);
    if (red) permanentRedirect(red.toPath);
    notFound();
  }
  return <ProductView r={r} />;
}
