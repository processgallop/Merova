import Image from "next/image";
import type { ImageRef } from "@/db/types";

const CAPTION: Record<string, string> = {
  render: "Product visualisation",
  representative: "Representative image",
  illustration: "Illustration",
};

/**
 * Image with honest labelling. Static assets go through next/image; uploaded
 * media (served from /media/…) is already optimised on upload.
 */
export function Img({
  image,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  className = "",
  imgClassName = "object-cover",
  priority = false,
  caption = false,
  fill = true,
  width,
  height,
}: {
  image: ImageRef | null | undefined;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  caption?: boolean | "overlay";
  fill?: boolean;
  width?: number;
  height?: number;
}) {
  if (!image?.url) return <div className={`bg-paper ${className}`} aria-hidden />;
  const label = image.caption || CAPTION[image.kind ?? ""];
  const optimisable = image.url.startsWith("/assets/");
  const positioned = /(^|\s)(absolute|fixed|sticky)(\s|$)/.test(className);
  return (
    <figure className={positioned ? className : `relative ${className}`}>
      {fill ? (
        <Image src={image.url} alt={image.alt} fill sizes={sizes} priority={priority} className={imgClassName} unoptimized={!optimisable} />
      ) : (
        <Image src={image.url} alt={image.alt} width={width ?? 1200} height={height ?? 900} sizes={sizes} priority={priority} className={imgClassName} unoptimized={!optimisable} />
      )}
      {caption && label ? (
        <figcaption className={caption === "overlay" ? "absolute bottom-2 left-2 rounded-[2px] bg-black/45 px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-white/90 backdrop-blur-sm" : "media-caption mt-2"}>
          {label}
          {image.credit && image.kind === "representative" ? ` · ${image.credit}` : ""}
        </figcaption>
      ) : null}
    </figure>
  );
}
