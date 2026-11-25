import { requireUser } from "@/lib/auth/session";
import { getTheme } from "@/lib/content";
import { FONT_PAIRS } from "@/lib/theme";
import { ThemePreview } from "@/components/admin/ThemePreview";
import type { FieldDef } from "@/components/admin/types";

export const metadata = { title: "Brand & appearance" };

const colour = (key: string, label: string, hint?: string): FieldDef => ({ key, label, type: "color", hint });

export default async function AppearancePage() {
  await requireUser("theme.edit");
  const theme = await getTheme();
  const fields: FieldDef[] = [
    { key: "brand", label: "Brand colours", type: "group", hint: "Merova Red must remain the dominant brand colour.", fields: [colour("primary", "Primary brand colour (Merova Red)", "Official: #D52B1E"), colour("primaryDeep", "Deep red (hover & accents)"), colour("charcoal", "Charcoal", "Official: #454040"), colour("ink", "Ink (darkest neutral)")] },
    { key: "surfaces", label: "Backgrounds & text", type: "group", fields: [colour("background", "Page background", "Official Cloud Dancer: #FFFAF3"), colour("surface", "Section / card background"), colour("heading", "Heading colour"), colour("body", "Body text colour"), colour("border", "Border colour")] },
    { key: "buttons", label: "Buttons & footer", type: "group", fields: [colour("buttonBg", "Primary button background"), colour("buttonText", "Primary button text"), colour("footerBg", "Footer background"), colour("footerText", "Footer text")] },
    { key: "type", label: "Typography", type: "group", fields: [
      { key: "fontPair", label: "Font pairing", type: "select", required: true, options: Object.entries(FONT_PAIRS).map(([value, f]) => ({ value, label: f.label })) },
      { key: "baseSize", label: "Base text size", type: "select", required: true, options: [15, 16, 17, 18].map((n) => ({ value: String(n), label: `${n}px` })) },
      { key: "headingWeight", label: "Heading weight", type: "select", required: true, options: [{ value: "600", label: "Semibold" }, { value: "700", label: "Bold (recommended)" }, { value: "800", label: "Extra bold" }] },
    ] },
    { key: "layout", label: "Layout presets", type: "group", fields: [
      { key: "radius", label: "Corner radius", type: "select", required: true, options: [{ value: "sharp", label: "Sharp (recommended)" }, { value: "soft", label: "Soft" }, { value: "round", label: "Round" }] },
      { key: "container", label: "Content width", type: "select", required: true, options: [{ value: "standard", label: "Standard (1320px)" }, { value: "wide", label: "Wide (1520px)" }] },
      { key: "spacing", label: "Section spacing", type: "select", required: true, options: [{ value: "compact", label: "Compact" }, { value: "standard", label: "Standard" }, { value: "airy", label: "Airy" }] },
    ] },
    { key: "assets", label: "Brand assets", type: "group", hint: "Use the official Merova artwork only. Never distort the logo.", fields: [{ key: "logoUrl", label: "Header logo URL", type: "text" }, { key: "logoReverseUrl", label: "Reverse logo URL", type: "text" }, { key: "markUrl", label: "Emblem URL", type: "text" }, { key: "faviconUrl", label: "Favicon URL", type: "text" }] },
  ];
  // Flatten grouped fields: the groups are visual only, values live at the top level.
  return <ThemePreview initial={JSON.parse(JSON.stringify({ ...theme, baseSize: String(theme.baseSize), headingWeight: String(theme.headingWeight) }))} groups={fields} />;
}
