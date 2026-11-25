export const ENQUIRY_STATUS_LABEL = {
  new: "New",
  contacted: "Contacted",
  under_review: "Requirement under review",
  quotation_in_progress: "Quotation in progress",
  quotation_sent: "Quotation sent",
  negotiation: "Negotiation",
  converted: "Converted",
  closed_lost: "Closed – not converted",
} as const;
export type EnquiryStatus = keyof typeof ENQUIRY_STATUS_LABEL;
