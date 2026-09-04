import type { UserRole } from "@/store/authStore";

export interface AdminUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
  reports_created_count: number;
  reports_assigned_count: number;
}
