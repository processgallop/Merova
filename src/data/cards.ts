import { flyerUrl, productUrl, verticalById } from "./catalog";
import type { Product, ProductImage } from "./types";

/** Serializable product card: the minimum a card needs, safe to pass to client components. */
export interface ProductCardData {
  slug: string;
  name: string;
  summary: string;
  vertical: string;
  application: string;
  materials: string;
  image: ProductImage;
  url: string;
  flyer: string;
}

export const toCard = (p: Product): ProductCardData => ({
  slug: p.slug,
  name: p.name,
  summary: p.summary,
  vertical: verticalById[p.vertical].navName,
  application: p.applications.slice(0, 2).join(", "),
  materials: p.materials.slice(0, 2).join(", "),
  image: p.image,
  url: productUrl(p),
  flyer: flyerUrl(p),
});
