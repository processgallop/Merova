import type { QuoteProfile } from "./types";

/**
 * Product-dependent quote form fields. The quote engine renders the "Technical
 * requirements" step from these definitions, and the API validates submitted
 * keys against the same list so the two can never drift apart.
 */
export interface QuoteField {
  name: string;
  label: string;
  type: "text" | "select" | "number" | "textarea";
  options?: string[];
  placeholder?: string;
  hint?: string;
}

const DIMENSIONS: QuoteField = {
  name: "dimensions",
  label: "Dimensions",
  type: "text",
  placeholder: "e.g. 300 × 200 × 150 mm (internal L × W × H)",
  hint: "Approximate is fine. Mention if internal or external.",
};

const PRINT: QuoteField = {
  name: "printing",
  label: "Printing",
  type: "select",
  options: ["Plain / unprinted", "1 colour", "2–4 colours", "Full colour", "Not sure yet"],
};

const NOT_SURE = "Not sure — please advise";

export const quoteFields: Record<QuoteProfile, QuoteField[]> = {
  corrugated: [
    DIMENSIONS,
    { name: "ply", label: "Ply", type: "select", options: ["3-ply", "5-ply", "7-ply", NOT_SURE] },
    { name: "flute", label: "Flute", type: "select", options: ["E flute", "B flute", "C flute", "BC flute", "EB flute", NOT_SURE] },
    { name: "boxStyle", label: "Box style", type: "select", options: ["Regular slotted (RSC)", "Die-cut", "Tray", "Telescopic", "Partitions / inserts", "Other", NOT_SURE] },
    { name: "boardStrength", label: "Board strength / load", type: "text", placeholder: "e.g. product weight 12 kg, stacked 6 high, or BF/GSM spec", hint: "Product weight and stacking height help us recommend construction." },
    PRINT,
  ],
  carton: [
    DIMENSIONS,
    { name: "cartonStyle", label: "Carton style", type: "select", options: ["Tuck-end", "Crash-lock / auto-lock", "Sleeve", "Tray and lid", "Window carton", "Gift / rigid box", NOT_SURE] },
    { name: "board", label: "Board preference", type: "select", options: ["FBB", "SBS", "Duplex", "Kraft", NOT_SURE] },
    { name: "gsm", label: "Board GSM (if known)", type: "text", placeholder: "e.g. 300 GSM" },
    PRINT,
    { name: "finish", label: "Finish", type: "select", options: ["None", "Varnish", "Lamination (gloss/matt)", "Foil / emboss", "Window patching", NOT_SURE] },
  ],
  cup: [
    { name: "capacity", label: "Capacity", type: "text", placeholder: "e.g. 8 oz / 250 ml" },
    { name: "application", label: "Hot or cold", type: "select", options: ["Hot beverages", "Cold beverages", "Ice cream / frozen", "Mixed"] },
    { name: "wall", label: "Wall construction", type: "select", options: ["Single wall", "Double wall", "Ripple wall", NOT_SURE] },
    { name: "paperSpec", label: "Paper / cup stock specification (if known)", type: "text", placeholder: "e.g. GSM, PE coated" },
    { name: "lids", label: "Lids required?", type: "select", options: ["Yes", "No", "Not sure"] },
    PRINT,
  ],
  foodservice: [
    { name: "format", label: "Product format", type: "text", placeholder: "e.g. 85 oz popcorn tub, nachos tray with dip well" },
    DIMENSIONS,
    { name: "foodType", label: "Food and temperature", type: "text", placeholder: "e.g. hot buttered popcorn, cold dessert", hint: "Helps us specify food-contact materials and barriers." },
    { name: "foodContact", label: "Direct food contact?", type: "select", options: ["Yes — direct contact", "No — food is wrapped/bagged", "Not sure"] },
    PRINT,
  ],
  film: [
    { name: "material", label: "Material", type: "select", options: ["BOPP", "LDPE", "LLDPE", "POF", "PVC cling", "Laminate", "Barrier film", "Compostable", NOT_SURE] },
    { name: "micron", label: "Thickness (micron)", type: "text", placeholder: "e.g. 19 micron" },
    { name: "width", label: "Width", type: "text", placeholder: "e.g. 450 mm" },
    { name: "format", label: "Format", type: "select", options: ["Roll", "Centre-fold roll", "Pouch / bag", "Sheet", NOT_SURE] },
    { name: "machine", label: "Packing machine (if any)", type: "text", placeholder: "e.g. L-sealer and shrink tunnel, VFFS" },
    PRINT,
  ],
  pouch: [
    { name: "pouchType", label: "Pouch type", type: "select", options: ["Stand-up", "Three-side seal", "Centre-seal", "Gusseted", "Flat-bottom", NOT_SURE] },
    DIMENSIONS,
    { name: "fill", label: "Product and fill weight", type: "text", placeholder: "e.g. 250 g roasted coffee beans" },
    { name: "features", label: "Features", type: "text", placeholder: "e.g. zip, tear notch, window, valve" },
    { name: "barrier", label: "Barrier / shelf life needs", type: "text", placeholder: "e.g. 6 months, moisture sensitive" },
    PRINT,
  ],
  custom: [
    { name: "productDescription", label: "What needs packing?", type: "textarea", placeholder: "Describe the product, its size and weight, and how it is shipped, stored and sold." },
    DIMENSIONS,
    { name: "currentPackaging", label: "Current packaging (if any)", type: "text", placeholder: "What do you use today, and what isn't working?" },
    { name: "priorities", label: "Priorities", type: "select", options: ["Protection", "Presentation", "Cost reduction", "Sustainability", "Speed of packing", "Several of these"] },
  ],
};

export const ENQUIRY_TYPES = {
  quote: "Request a quote",
  custom: "Custom requirement",
  sales: "Sales enquiry",
  technical: "Technical support",
  orders: "Existing order",
  suppliers: "Supplier / partnership",
  careers: "Careers",
  partnerships: "Business partnership",
} as const;
export type EnquiryType = keyof typeof ENQUIRY_TYPES;

export const QUANTITY_BANDS = ["Under 1,000", "1,000 – 5,000", "5,000 – 25,000", "25,000 – 1,00,000", "Over 1,00,000", "Ongoing monthly requirement", "Not sure yet"];
export const TIMELINES = ["As soon as possible", "Within 2 weeks", "Within a month", "1–3 months", "Planning / budgeting stage"];

export const UPLOAD_LIMITS = {
  maxFiles: 5,
  maxTotalBytes: 4 * 1024 * 1024, // stays under the 4.5 MB serverless request limit
  accept: [".pdf", ".png", ".jpg", ".jpeg", ".webp", ".ai", ".eps", ".svg", ".dxf", ".dwg", ".zip", ".xlsx", ".docx"],
};
