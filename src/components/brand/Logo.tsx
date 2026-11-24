/* eslint-disable @next/next/no-img-element */
/**
 * Official Merova logo artwork, exported unaltered from the master file
 * (public/assets/brand/source/Merova_Logo.pdf) by scripts/brand-logos.mjs.
 *  - primary: red mark + charcoal wordmark, for Cloud Dancer / white backgrounds
 *  - reverse: cream mark + wordmark, for Merova Red / charcoal backgrounds
 *  - mark-red / mark-cream: the mark alone
 * Aspect ratios come from the trimmed viewBoxes and must not be changed.
 */
const ART = {
  primary: { src: "/assets/brand/merova-logo-primary.svg", ratio: 843.66 / 375.16 },
  reverse: { src: "/assets/brand/merova-logo-reverse.svg", ratio: 703.69 / 344.39 },
  "mark-red": { src: "/assets/brand/merova-mark-red.svg", ratio: 703.69 / 344.39 },
  "mark-cream": { src: "/assets/brand/merova-mark-cream.svg", ratio: 703.69 / 344.39 },
} as const;

export type LogoVariant = keyof typeof ART;

export function Logo({ variant = "primary", height = 56, className = "" }: { variant?: LogoVariant; height?: number; className?: string }) {
  const a = ART[variant];
  return (
    <img
      src={a.src}
      alt="Merova"
      width={Math.round(height * a.ratio)}
      height={height}
      className={`block h-auto max-w-none ${className}`}
      style={{ height, width: Math.round(height * a.ratio) }}
      decoding="async"
    />
  );
}

/** Mark only (legacy name kept for existing imports). */
export function Glyph({ className = "", tone = "red" }: { className?: string; tone?: "red" | "cream"; color?: string }) {
  const a = ART[tone === "red" ? "mark-red" : "mark-cream"];
  return <img src={a.src} alt="" aria-hidden="true" className={className} style={{ aspectRatio: String(a.ratio) }} />;
}
