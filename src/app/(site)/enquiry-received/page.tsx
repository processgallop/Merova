import { Suspense } from "react";
import { EnquiryReceived } from "./EnquiryReceived";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Enquiry Received | Merova Printpack", description: "Your enquiry has been received by Merova Printpack.", path: "/enquiry-received", noindex: true });

export default function Page() {
  return (
    <Suspense fallback={<div className="container-x py-24" />}>
      <EnquiryReceived />
    </Suspense>
  );
}
