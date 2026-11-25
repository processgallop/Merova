import type { FontPair, ThemeSettings } from "@/db/types";

export const FONT_PAIRS: Record<FontPair, { label: string; display: string }> = {
  "manrope-inter": { label: "Manrope + Inter (recommended)", display: "var(--font-manrope)" },
  "sora-inter": { label: "Sora + Inter", display: "var(--font-sora)" },
  "jakarta-inter": { label: "Plus Jakarta Sans + Inter", display: "var(--font-jakarta)" },
  "dmsans-inter": { label: "DM Sans + Inter", display: "var(--font-dmsans)" },
};

const HEX = /^#[0-9a-f]{6}$/i;
const hex = (v: string, fallback: string) => (HEX.test(v) ? v : fallback);

/** Converts theme settings into CSS custom properties. Values are validated so admin input cannot inject CSS. */
export function themeToCss(t: ThemeSettings): string {
  const radius = { sharp: "2px", soft: "8px", round: "16px" }[t.radius] ?? "2px";
  const container = t.container === "wide" ? "1520px" : "1320px";
  const spacing = { compact: "clamp(3.5rem, 7vw, 6rem)", standard: "clamp(4.5rem, 9vw, 8.5rem)", airy: "clamp(5.5rem, 11vw, 10.5rem)" }[t.spacing] ?? "clamp(4.5rem, 9vw, 8.5rem)";
  const vars: Record<string, string> = {
    "--c-red": hex(t.primary, "#d52b1e"),
    "--c-red-deep": hex(t.primaryDeep, "#a91f15"),
    "--c-charcoal": hex(t.charcoal, "#454040"),
    "--c-ink": hex(t.ink, "#1f1b1b"),
    "--c-bg": hex(t.background, "#fffaf3"),
    "--c-surface": hex(t.surface, "#ffffff"),
    "--c-heading": hex(t.heading, "#1f1b1b"),
    "--c-body": hex(t.body, "#454040"),
    "--c-border": hex(t.border, "#e7ddd0"),
    "--c-btn-bg": hex(t.buttonBg, "#d52b1e"),
    "--c-btn-text": hex(t.buttonText, "#ffffff"),
    "--c-footer-bg": hex(t.footerBg, "#1f1b1b"),
    "--c-footer-text": hex(t.footerText, "#f4ece1"),
    "--radius": radius,
    "--container": container,
    "--section-y": spacing,
    "--base-size": `${[15, 16, 17, 18].includes(Number(t.baseSize)) ? t.baseSize : 16}px`,
    "--heading-weight": String([600, 700, 800].includes(Number(t.headingWeight)) ? t.headingWeight : 700),
    "--font-display": `${(FONT_PAIRS[t.fontPair] ?? FONT_PAIRS["manrope-inter"]).display}, ui-sans-serif, system-ui, sans-serif`,
  };
  return `:root{${Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(";")}}`;
}
