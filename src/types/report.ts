export type Severity = "low" | "medium" | "high" | "critical";
export type ReportStatus = "new" | "in_review" | "verified" | "assigned" | "resolved" | "closed";
export type Priority = "low" | "medium" | "high" | "urgent";
export type Category =
  | "web_application"
  | "network"
  | "physical_security"
  | "social_engineering"
  | "other";
export type VulnerabilityType =
  | "sql_injection"
  | "xss"
  | "csrf"
  | "broken_authentication"
  | "data_exposure"
  | "misconfiguration"
  | "insecure_api"
  | "malware"
  | "ransomware"
  | "phishing"
  | "ddos"
  | "mitm"
  | "insider_threat"
  | "zero_day"
  | "other";

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
  updated_at: string;
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
  priority: Priority;
  category: Category;
  vulnerability_type: VulnerabilityType;
  due_date: string | null;
  /** Filename only, never a direct URL - attachments are only fetched
   * through the authenticated GET /reports/{id}/attachment/ endpoint. */
  attachment_name: string | null;
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
  by_category: Record<Category, number>;
  by_vulnerability_type: Record<VulnerabilityType, number>;
  /** Every field below is admin-only - the API omits them for other roles. */
  users_by_role?: Record<string, number>;
  active_users?: number;
  inactive_users?: number;
  open_reports?: number;
  unassigned_reports?: number;
  critical_open?: number;
  created_this_week?: number;
  resolved_this_week?: number;
  /** null until at least one report has been resolved or closed. */
  avg_resolution_hours?: number | null;
}

/** One day of intake vs. throughput from /api/dashboard/trends/. */
export interface TrendPoint {
  date: string;
  created: number;
  resolved: number;
}

/** One developer's queue depth from /api/dashboard/workload/. */
export interface WorkloadRow {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  open_assigned: number;
  resolved: number;
  total_assigned: number;
}

/** System-wide audit entry from /api/dashboard/activity/. */
export interface GlobalActivityEntry {
  id: number;
  report_id: number;
  report_title: string;
  actor: NestedUser;
  action: string;
  detail: string;
  created_at: string;
}

/** Paginated envelope returned by /api/dashboard/activity/. */
export interface ActivityFeedPage {
  count: number;
  results: GlobalActivityEntry[];
}

export type NotificationKind =
  | "status_changed"
  | "assigned"
  | "comment"
  | "report_filed";

/** One in-app alert from /api/notifications/. */
export interface AppNotification {
  id: number;
  kind: NotificationKind;
  message: string;
  is_read: boolean;
  created_at: string;
  actor: { id: number; first_name: string; last_name: string } | null;
  report_id: number | null;
  report_title: string | null;
}

export interface NotificationPage {
  count: number;
  unread_count: number;
  results: AppNotification[];
}
