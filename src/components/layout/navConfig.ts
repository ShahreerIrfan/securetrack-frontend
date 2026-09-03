import { FileText, LayoutDashboard, Users, type LucideIcon } from "lucide-react";
import type { UserRole } from "@/store/authStore";

export interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const roleNavLinks: Record<UserRole, NavLink[]> = {
  user: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Reports", href: "/dashboard/reports", icon: FileText },
  ],
  analyst: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Reports", href: "/dashboard/reports", icon: FileText },
  ],
  developer: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Tasks", href: "/dashboard/reports", icon: FileText },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Reports", href: "/dashboard/reports", icon: FileText },
    { label: "Users", href: "/dashboard/users", icon: Users },
  ],
};
