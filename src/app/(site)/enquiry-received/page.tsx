import { Suspense } from "react";
import { Received } from "./Received";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata({ title: "Enquiry received | Merova Printpack", description: "Your enquiry has been received.", path: "/enquiry-received/", noindex: true });
export default function Page() { return <Suspense><Received /></Suspense>; }
