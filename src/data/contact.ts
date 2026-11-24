/** Contact enquiry channels (shared by the server contact page and the client form). */
export const CONTACT_TOPICS = [
  { id: "sales", label: "Sales enquiry", hint: "New packaging requirements and quotations." },
  { id: "technical", label: "Technical support", hint: "Specifications, materials and performance questions." },
  { id: "orders", label: "Existing order", hint: "Order status, dispatch and delivery questions." },
  { id: "suppliers", label: "Supplier / partnership", hint: "Material suppliers and service providers." },
  { id: "careers", label: "Careers", hint: "Job applications and general career enquiries." },
  { id: "partnerships", label: "Business partnership", hint: "Distribution, strategic and institutional enquiries." },
] as const;
