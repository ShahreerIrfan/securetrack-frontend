"use client";

import { useRouter } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatUserName } from "@/lib/format";
import { useAuthStore } from "@/store/authStore";

export interface TopbarProps {
  title: string;
}

export function Topbar({ title }: TopbarProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);

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
