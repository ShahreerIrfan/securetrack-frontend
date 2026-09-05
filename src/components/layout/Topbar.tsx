"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ExternalLink, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { formatUserName } from "@/lib/format";
import { useAuthStore } from "@/store/authStore";

export interface TopbarProps {
  title: string;
}

export function Topbar({ title }: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);
  const [unread, setUnread] = useState(0);

  // Refetched on navigation rather than polled - a route change is the
  // moment the count most plausibly went stale (e.g. after reading them),
  // and it avoids a timer running on every dashboard page.
  useEffect(() => {
    if (!user) return;
    api
      .get<{ unread_count: number }>("/notifications/unread-count/")
      .then((res) => setUnread(res.data.unread_count))
      .catch(() => setUnread(0));
  }, [user, pathname]);

  const handleLogout = () => {
    clear();
    router.push("/login");
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-6">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:border-accent/40 hover:text-accent"
        >
          <ExternalLink size={14} />
          View Website
        </a>
        <Link
          href="/dashboard/notifications"
          aria-label={unread > 0 ? `Notifications (${unread} unread)` : "Notifications"}
          title="Notifications"
          className="relative text-muted transition-colors hover:text-accent"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-4 text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Link>
        {user && (
          <>
            <span className="text-sm text-foreground">{formatUserName(user)}</span>
            <Badge variant={user.role}>{user.role}</Badge>
          </>
        )}
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          className="text-muted transition-colors hover:text-danger"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
