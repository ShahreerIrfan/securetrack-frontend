import type { UserRole } from "@/store/authStore";

export interface AdminUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  date_joined: string;
}
