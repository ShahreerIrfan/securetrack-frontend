import {
  Bell,
  ChartLine,
  FileText,
  LayoutDashboard,
  ScrollText,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/store/authStore";

export interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

const dashboard: NavLink = {
  label: "Dashboard",
  href: "/dashboard",
  icon: LayoutDashboard,
};

// Everyone gets these two, always last, so the tail of the sidebar reads
// the same no matter which role you're signed in as.
const personal: NavLink[] = [
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const analytics: NavLink = {
  label: "Analytics",
  href: "/dashboard/analytics",
  icon: ChartLine,
};

const auditLog: NavLink = {
  label: "Audit Log",
  href: "/dashboard/audit",
  icon: ScrollText,
};

export const roleNavLinks: Record<UserRole, NavLink[]> = {
  user: [
    dashboard,
    { label: "My Reports", href: "/dashboard/reports", icon: FileText },
    ...personal,
  ],
  analyst: [
    dashboard,
    { label: "Reports", href: "/dashboard/reports", icon: FileText },
    analytics,
    auditLog,
    ...personal,
  ],
  developer: [
    dashboard,
    { label: "My Tasks", href: "/dashboard/reports", icon: FileText },
    ...personal,
  ],
  admin: [
    dashboard,
    { label: "Reports", href: "/dashboard/reports", icon: FileText },
    { label: "Users", href: "/dashboard/users", icon: Users },
    analytics,
    auditLog,
    ...personal,
  ],
};
