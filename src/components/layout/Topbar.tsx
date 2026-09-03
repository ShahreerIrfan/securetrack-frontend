"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
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
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-6">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-3">
        {user && (
          <>
            <span className="text-sm text-foreground">{user.username}</span>
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
