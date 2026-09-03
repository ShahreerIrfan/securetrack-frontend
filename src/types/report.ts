export type Severity = "low" | "medium" | "high" | "critical";
export type ReportStatus = "new" | "in_review" | "verified" | "assigned" | "resolved" | "closed";

export interface NestedUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

export interface Comment {
  id: number;
  report: number;
  author: NestedUser;
  content: string;
  created_at: string;
}

export interface ActivityLogEntry {
  id: number;
  actor: NestedUser;
  action: string;
  detail: string;
  created_at: string;
}

export interface Report {
  id: number;
  title: string;
  description: string;
  severity: Severity;
  status: ReportStatus;
  created_by: NestedUser;
  assigned_to: NestedUser | null;
  comments?: Comment[];
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_reports: number;
  by_status: Record<ReportStatus, number>;
  by_severity: Record<Severity, number>;
  /** Admins only. */
  users_by_role?: Record<string, number>;
}
