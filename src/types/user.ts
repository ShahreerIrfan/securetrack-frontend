import type { UserRole } from "@/store/authStore";

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  date_joined: string;
}
