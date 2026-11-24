import type { ProductImage, SpecRow } from "../types";

export const ill = (name: string, alt: string): ProductImage => ({
  src: `/assets/products/illustrations/${name}.svg`,
  alt,
  kind: "illustration",
});

export const photo = (file: string, alt: string): ProductImage => ({
  src: `/assets/products/${file}`,
  alt,
  kind: "representative",
});

export const PER_ORDER = "Specified per order — confirmed at quotation";

export const opt = (label: string, value: string): SpecRow => ({ label, value, status: "option" });
export const ref = (label: string, value: string): SpecRow => ({ label, value, status: "reference" });
export const tbc = (label: string, value = PER_ORDER): SpecRow => ({ label, value, status: "confirm" });

export const CORRUGATED_PRINT = [
  "Plain (unprinted) boxes",
  "Single-colour and multi-colour print (process confirmed at quotation)",
  "Handling symbols, part numbers and shipping marks",
  "Inside print on selected formats",
];

export const CORRUGATED_QUALITY = [
  "Board grade and ply verified against the agreed specification",
  "Dimensional checks on internal size and crease positions",
  "Joint strength and flap alignment checked on samples",
  "Print legibility and position checked against approved artwork",
];

export const CARTON_PRINT = [
  "Multi-colour print to approved artwork and colour references",
  "Gloss, matt or aqueous varnish",
  "Film lamination options",
  "Hot-foil stamping, embossing and debossing (subject to project confirmation)",
  "Window patching where specified",
];

export const CARTON_QUALITY = [
  "Artwork proof approval before production",
  "Colour checked against the approved proof or reference",
  "Crease, cut and glue quality checked on run samples",
  "Dimensional checks against the agreed dieline",
];

export const FOOD_QUALITY = [
  "Food-contact material documentation confirmed per material at quotation",
  "Capacity and dimensional checks against the approved sample",
  "Seam, rim or glue integrity checked on run samples",
  "Print checked for position, colour and rub resistance",
];

export const FOOD_PRINT = [
  "Brand print to approved artwork",
  "Plain and stock designs where suitable",
  "Promotional and seasonal designs",
  "Food-safe inks and coatings specified per application",
];

export const FILM_QUALITY = [
  "Thickness (micron) checked against the agreed specification",
  "Width, roll length or pouch dimensions verified",
  "Seal integrity checked on pouches and bags",
  "Visual inspection for gels, holes, wrinkles and print defects",
];

export const FILM_PRINT = [
  "Plain (unprinted) film",
  "Printed film or pouches (process and colours confirmed at quotation)",
  "Batch, date or lot information areas",
];
