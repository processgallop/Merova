import Image from "next/image";
import type { ProductImage } from "@/data/types";

export function Media({
  image,
  sizes,
  priority,
  className = "",
  caption = true,
  aspect = "aspect-[4/3]",
}: {
  image: ProductImage;
  sizes: string;
  priority?: boolean;
  className?: string;
  caption?: boolean;
  aspect?: string;
}) {
  return (
    <figure className={`relative overflow-hidden bg-paper-2 ${aspect} ${className}`}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        unoptimized={image.src.endsWith(".svg")}
      />
      {caption && (
        <figcaption className="absolute bottom-2 left-2 rounded-sm bg-white/85 px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.08em] text-muted backdrop-blur">
          {image.kind === "illustration" ? "Format illustration" : "Representative image"}
        </figcaption>
      )}
    </figure>
  );
}

