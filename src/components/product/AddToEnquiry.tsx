"use client";
import { Check, Plus } from "lucide-react";
import { useSelection } from "@/components/client/selection";

export function AddToEnquiry({ slug, name, segment, image }: { slug: string; name: string; segment: string; image?: string }) {
  const { has, toggle } = useSelection();
  const on = has(slug);
  return (
    <button type="button" onClick={() => toggle({ slug, name, segment, image })} aria-pressed={on} className={`btn ${on ? "btn-dark" : "btn-outline"}`}>
      {on ? <Check className="size-4" /> : <Plus className="size-4" />}
      <span>{on ? "Added to enquiry" : "Add to enquiry"}</span>
    </button>
  );
}
