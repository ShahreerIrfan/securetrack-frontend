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
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-gradient-soft">
          <ShieldCheck size={18} className="text-accent" />
        </span>
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
                "relative flex items-center gap-3 rounded-lg py-2 pl-4 pr-3 text-sm font-medium transition-colors",
                active
                  ? "bg-accent-gradient-soft text-accent"
                  : "text-muted hover:bg-surface-raised hover:text-foreground",
              )}
            >
              {active && (
                <span
                  aria-hidden
                  className="absolute inset-y-1 left-0 w-0.75 rounded-full bg-accent-gradient"
                />
              )}
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
