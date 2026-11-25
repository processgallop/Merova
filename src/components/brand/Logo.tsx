/* eslint-disable @next/next/no-img-element */
import { EMBLEM_PATH, EMBLEM_TRANSFORM, EMBLEM_VIEWBOX } from "./emblem-path";

const LOCKUPS = {
  horizontal: { src: "/assets/brand/merova-lockup-horizontal.svg", ratio: 1585 / 303 },
  "horizontal-light": { src: "/assets/brand/merova-lockup-horizontal-light.svg", ratio: 1585 / 303 },
  "horizontal-reverse": { src: "/assets/brand/merova-lockup-horizontal-reverse.svg", ratio: 1585 / 303 },
  primary: { src: "/assets/brand/merova-logo-primary.svg", ratio: 843.66 / 375.16 },
  reverse: { src: "/assets/brand/merova-logo-reverse.svg", ratio: 703.69 / 344.39 },
} as const;

export type LogoVariant = keyof typeof LOCKUPS;

/** Official Merova artwork. `src` lets the admin-managed logo override the default file. */
export function Logo({ variant = "horizontal", height = 34, src, className = "" }: { variant?: LogoVariant; height?: number; src?: string; className?: string }) {
  const a = LOCKUPS[variant];
  return (
    <img
      src={src || a.src}
      alt="Merova Printpack"
      width={Math.round(height * a.ratio)}
      height={height}
      className={`block max-w-none ${className}`}
      style={{ height, width: src ? "auto" : Math.round(height * a.ratio) }}
      decoding="async"
    />
  );
}

/**
 * The Merova emblem as inline SVG, using the exact master path.
 * - `mode="fill"`: solid emblem (watermarks, compositions)
 * - `mode="draw"`: the outline traces itself, then fills — the signature motion
 * - `mode="outline"`: static outline
 */
export function Emblem({
  className = "",
  color = "var(--c-red)",
  mode = "fill",
  strokeWidth = 3,
  title,
}: {
  className?: string;
  color?: string;
  mode?: "fill" | "draw" | "line" | "outline";
  strokeWidth?: number;
  title?: string;
}) {
  const stroke = mode !== "fill";
  return (
    <svg viewBox={EMBLEM_VIEWBOX} className={`${mode === "draw" ? "emblem-draw filled" : mode === "line" ? "emblem-draw" : ""} ${className}`} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title} preserveAspectRatio="xMidYMid meet">
      <path
        d={EMBLEM_PATH}
        transform={EMBLEM_TRANSFORM}
        fill={mode === "outline" || mode === "line" ? "none" : color}
        stroke={stroke ? color : "none"}
        strokeWidth={stroke ? strokeWidth : 0}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={mode === "draw" || mode === "line" ? ({ "--len": 2600 } as React.CSSProperties) : undefined}
      />
    </svg>
  );
}
