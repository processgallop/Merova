"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { track, type TrackEvent } from "@/lib/track";

/** Plain anchor that records a conversion event on click (downloads, tel:, mailto:, wa.me). */
export function TrackedLink({
  event,
  params,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: TrackEvent;
  params?: Record<string, string>;
  children: ReactNode;
}) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        track(event, { href: rest.href, ...params });
        rest.onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
