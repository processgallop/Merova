export type Opt = { value: string; label: string };

export type FieldDef =
  | { key: string; label: string; type: "text" | "textarea" | "markdown" | "slug" | "number" | "url" | "color" | "date"; hint?: string; required?: boolean; placeholder?: string; rows?: number; maxLength?: number; from?: string; prefix?: string }
  | { key: string; label: string; type: "select"; options: Opt[]; hint?: string; required?: boolean }
  | { key: string; label: string; type: "checkbox"; hint?: string }
  | { key: string; label: string; type: "list"; hint?: string; placeholder?: string }
  | { key: string; label: string; type: "pairs"; hint?: string; addLabel?: string; fields: { key: string; label: string; type: "text" | "textarea" | "select" | "checkbox" | "image"; options?: Opt[] }[] }
  | { key: string; label: string; type: "image" | "images"; hint?: string }
  | { key: string; label: string; type: "link"; hint?: string }
  | { key: string; label: string; type: "products" | "industries" | "resources"; hint?: string }
  | { key: string; label: string; type: "segmentRef"; hint?: string }
  | { key: string; label: string; type: "file"; accept?: string; hint?: string }
  | { key: string; label: string; type: "seo"; hint?: string }
  | { key: string; label: string; type: "group"; fields: FieldDef[]; hint?: string };

export interface AdminRefs {
  products: { slug: string; name: string; segment: string }[];
  industries: { slug: string; name: string }[];
  segments: { slug: string; name: string }[];
  resources: { slug: string; title: string }[];
}

export interface FormTab {
  id: string;
  title: string;
  fields: FieldDef[];
}
