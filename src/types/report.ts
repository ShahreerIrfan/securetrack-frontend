export type Severity = "low" | "medium" | "high" | "critical";
export type ReportStatus = "new" | "in_review" | "verified" | "assigned" | "resolved" | "closed";

export interface NestedUser {
  id: number;
  username: string;
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
