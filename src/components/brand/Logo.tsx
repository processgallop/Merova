import { GLYPH_PATH, GLYPH_VIEWBOX } from "./glyph";

/**
 * Merova logo lockup: the existing red glyph (unaltered proportions) with the
 * "Merova" wordmark in Sora, as used on the previous site, and the
 * "PRINTPACK" descriptor.
 */
export function Glyph({ className = "", color = "#D52B1E" }: { className?: string; color?: string }) {
  return (
    <svg viewBox={GLYPH_VIEWBOX} className={className} aria-hidden="true" focusable="false">
      <path d={GLYPH_PATH} fill={color} />
    </svg>
  );
}

export function Logo({
  tone = "dark",
  descriptor = true,
  className = "",
}: {
  tone?: "dark" | "light";
  descriptor?: boolean;
  className?: string;
}) {
  const text = tone === "dark" ? "text-navy-950" : "text-white";
  const sub = tone === "dark" ? "text-muted" : "text-white/70";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Glyph className="h-[22px] w-auto shrink-0" color={tone === "dark" ? "#D52B1E" : "#FFFAF3"} />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[1.32rem] font-semibold tracking-[-0.03em] ${text}`}>
          Merova<sup aria-hidden="true" className="ml-0.5 align-super text-[0.5rem] font-medium tracking-normal opacity-70">TM</sup>
        </span>
        {descriptor && (
          <span className={`mt-1 font-mono text-[0.56rem] font-medium tracking-[0.32em] ${sub}`}>PRINTPACK</span>
        )}
      </span>
    </span>
  );
}
