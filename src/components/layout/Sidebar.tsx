"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import clsx from "clsx";
import { useAuthStore } from "@/store/authStore";
import { roleNavLinks } from "./navConfig";

function isActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  // Only prefix-match nested routes (e.g. /dashboard/reports/12) - never
  // let the root /dashboard link swallow every other link as "active" too.
  return href !== "/dashboard" && pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();
  const role = useAuthStore((s) => s.user?.role);
  const links = role ? roleNavLinks[role] : [];

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2 px-5 py-5">
        <ShieldCheck size={22} className="text-accent" />
        <span className="text-lg font-semibold text-foreground">SecureTrack</span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {links.map((link) => {
          const active = isActive(pathname, link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-accent/15 text-accent"
                  : "text-muted hover:bg-surface-raised hover:text-foreground",
              )}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
