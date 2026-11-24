/* eslint-disable @next/next/no-img-element */
/** Merova logo, rendered from the supplied artwork (public/assets/brand/master), never redrawn or recoloured. */
type Variant = "primary" | "reverse";
const SRC = {
  lockup: { primary: "/assets/brand/master/merova-lockup-primary-transparent.svg", reverse: "/assets/brand/master/merova-lockup-reverse-transparent.svg" },
  mark: { primary: "/assets/brand/master/merova-mark-primary-transparent.svg", reverse: "/assets/brand/master/merova-mark-reverse-transparent.svg" },
};
// Intrinsic ratios of the cropped artwork (viewBox width / height)
const RATIO = { lockup: { primary: 817.3 / 350.3, reverse: 676.3 / 316.3 }, mark: { primary: 676.3 / 316.3, reverse: 676.3 / 316.3 } };

export function Logo({ kind = "lockup", variant = "primary", height = 44, className, alt = "Merova Printpack" }: { kind?: "lockup" | "mark"; variant?: Variant; height?: number; className?: string; alt?: string }) {
  return <img src={SRC[kind][variant]} alt={alt} height={height} width={Math.round(height * RATIO[kind][variant])} className={className} style={{ height, width: "auto" }} />;
}
