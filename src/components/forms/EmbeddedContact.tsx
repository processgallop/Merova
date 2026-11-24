import { Suspense } from "react";
import { ContactForm } from "./ContactForm";
import { site, whatsappHref } from "@/lib/site";

export function EmbeddedContact({ topic }: { topic: string }) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-sm border border-line bg-white" />}>
      <ContactForm defaultTopic={topic} fallback={{ whatsapp: whatsappHref(), email: site.contact.email, phone: site.contact.phone }} />
    </Suspense>
  );
}
