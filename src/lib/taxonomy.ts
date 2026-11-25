/**
 * Filter groups derived from product records, so new products added in the
 * admin are classified automatically without hand-maintained filter lists.
 */
export const MATERIAL_GROUPS: { id: string; label: string; re: RegExp }[] = [
  { id: "corrugated", label: "Corrugated board", re: /corrugat|flute|liner|kraft liner|fluted/i },
  { id: "paperboard", label: "Paperboard", re: /paperboard|\bfbb\b|\bsbs\b|duplex|boxboard|carton board|greyboard|rigid board/i },
  { id: "food-board", label: "Food-grade board & cup stock", re: /food-grade|food grade|cup stock|food-contact|pe-coated|pe coated|aqueous/i },
  { id: "kraft-paper", label: "Kraft & paper", re: /\bkraft\b|paper(?!board)/i },
  { id: "bopp", label: "BOPP", re: /\bbopp\b|polypropylene/i },
  { id: "ldpe", label: "LDPE / LLDPE", re: /\bldpe\b|\blldpe\b|polyethylene/i },
  { id: "pof", label: "POF (polyolefin)", re: /\bpof\b|polyolefin/i },
  { id: "pvc", label: "PVC", re: /\bpvc\b/i },
  { id: "laminate", label: "Laminates & barrier films", re: /lamin|barrier|metallised|metallized|foil|evoh|multi-layer/i },
  { id: "compostable", label: "Compostable materials", re: /compostable|pbat|\bpla\b/i },
];

export const APPLICATION_GROUPS: { id: string; label: string; re: RegExp }[] = [
  { id: "transit", label: "Shipping & transit", re: /ship|transit|export|e-?commerce|parcel|distribution|logistic|courier|heavy|industrial/i },
  { id: "retail", label: "Retail & display", re: /retail|shelf|display|point of sale|promotion|merchandis/i },
  { id: "food", label: "Food & beverage service", re: /food|beverage|qsr|cinema|multiplex|popcorn|bakery|takeaway|cafe|café|restaurant|ice cream|drink/i },
  { id: "protection", label: "Protection & inserts", re: /protect|insert|partition|divider|cushion|fragile|component/i },
  { id: "presentation", label: "Presentation & gifting", re: /gift|premium|presentation|luxury|corporate|brand/i },
  { id: "wrapping", label: "Wrapping, films & bags", re: /wrap|film|roll|pouch|bag|shrink|cling|liner/i },
  { id: "pharma", label: "Pharmaceutical & healthcare", re: /pharma|medicin|healthcare|medical|nutraceutical/i },
];

export function groupsFor(text: string, groups: typeof MATERIAL_GROUPS) {
  return groups.filter((g) => g.re.test(text)).map((g) => g.id);
}
