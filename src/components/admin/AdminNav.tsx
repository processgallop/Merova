"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3, Boxes, ClipboardList, ExternalLink, FileText, FolderOpen, Home, Image as ImageIcon, Inbox, Layers, LayoutTemplate, LogOut, Menu, Navigation, Palette, Search, Settings, Shield, UserCircle, Users, Factory, X,
} from "lucide-react";
import type { Perm } from "@/lib/auth/rbac";
import { Logo } from "@/components/brand/Logo";
import { logoutAction } from "@/app/admin/(auth)/actions";

const GROUPS: { title: string; items: { href: string; label: string; icon: React.ComponentType<{ className?: string }>; perm: Perm; exact?: boolean }[] }[] = [
  { title: "", items: [{ href: "/admin", label: "Dashboard", icon: BarChart3, perm: "dashboard.view", exact: true }, { href: "/admin/enquiries", label: "Enquiries", icon: Inbox, perm: "enquiries.view" }] },
  {
    title: "Catalogue",
    items: [
      { href: "/admin/products", label: "Products", icon: Boxes, perm: "catalog.view" },
      { href: "/admin/segments", label: "Segments", icon: Layers, perm: "catalog.view" },
      { href: "/admin/industries", label: "Industries", icon: Factory, perm: "catalog.view" },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/pages/home", label: "Homepage", icon: Home, perm: "content.view", exact: true },
      { href: "/admin/pages", label: "Pages", icon: LayoutTemplate, perm: "content.view" },
      { href: "/admin/posts", label: "Knowledge centre", icon: FileText, perm: "content.view" },
      { href: "/admin/resources", label: "Resources & PDFs", icon: FolderOpen, perm: "content.view" },
      { href: "/admin/media", label: "Media library", icon: ImageIcon, perm: "media.edit" },
    ],
  },
  {
    title: "Website",
    items: [
      { href: "/admin/navigation", label: "Navigation & footer", icon: Navigation, perm: "navigation.edit" },
      { href: "/admin/appearance", label: "Brand & appearance", icon: Palette, perm: "theme.edit" },
      { href: "/admin/seo", label: "SEO & redirects", icon: Search, perm: "seo.edit" },
      { href: "/admin/settings", label: "Settings", icon: Settings, perm: "settings.edit" },
    ],
  },
  {
    title: "Administration",
    items: [
      { href: "/admin/users", label: "Users & roles", icon: Users, perm: "users.manage" },
      { href: "/admin/audit", label: "Audit log", icon: Shield, perm: "audit.view" },
    ],
  },
];

export function AdminNav({ user, perms }: { user: { name: string; email: string; role: string }; perms: Perm[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close the drawer after navigation
    setOpen(false);
  }, [pathname]);
  const active = (href: string, exact?: boolean) => (exact ? pathname === href : pathname === href || (pathname.startsWith(href + "/") && !(href === "/admin/pages" && pathname === "/admin/pages/home")));
  return (
    <>
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/10 bg-ink px-4 lg:hidden">
        <Logo variant="horizontal-light" height={22} />
        <button type="button" onClick={() => setOpen((v) => !v)} className="flex size-10 items-center justify-center text-white" aria-label="Menu" aria-expanded={open}>{open ? <X className="size-5" /> : <Menu className="size-5" />}</button>
      </div>
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-ink text-white/80 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/admin"><Logo variant="horizontal-light" height={22} /></Link>
          <button type="button" onClick={() => setOpen(false)} className="text-white lg:hidden" aria-label="Close menu"><X className="size-5" /></button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 pb-6" aria-label="Admin">
          {GROUPS.map((g) => {
            const items = g.items.filter((i) => perms.includes(i.perm));
            if (!items.length) return null;
            return (
              <div key={g.title} className="mt-4">
                {g.title ? <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">{g.title}</p> : null}
                <ul>
                  {items.map((i) => {
                    const on = active(i.href, i.exact);
                    return (
                      <li key={i.href}>
                        <Link href={i.href} aria-current={on ? "page" : undefined} className={`flex items-center gap-3 rounded-[3px] px-3 py-2 text-sm transition-colors ${on ? "bg-red font-semibold text-white" : "hover:bg-white/5 hover:text-white"}`}>
                          <i.icon className="size-4" />{i.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
          <div className="mt-4 border-t border-white/10 pt-4">
            <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-[3px] px-3 py-2 text-sm hover:bg-white/5 hover:text-white"><ExternalLink className="size-4" />View website</a>
            <Link href="/admin/help" className="flex items-center gap-3 rounded-[3px] px-3 py-2 text-sm hover:bg-white/5 hover:text-white"><ClipboardList className="size-4" />Admin guide</Link>
          </div>
        </nav>
        <div className="border-t border-white/10 p-4">
          <Link href="/admin/account" className="flex items-center gap-3 text-sm hover:text-white">
            <UserCircle className="size-8 text-white/50" />
            <span className="min-w-0"><span className="block truncate font-semibold text-white">{user.name}</span><span className="block truncate text-xs text-white/50">{user.role}</span></span>
          </Link>
          <form action={logoutAction} className="mt-3">
            <button type="submit" className="flex items-center gap-2 text-xs text-white/60 hover:text-white"><LogOut className="size-3.5" />Sign out</button>
          </form>
        </div>
      </aside>
      {open ? <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} /> : null}
    </>
  );
}
