import type { ReportStatus, Severity } from "@/types/report";

export const severityLabels: Record<Severity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const statusLabels: Record<ReportStatus, string> = {
  new: "New",
  in_review: "In Review",
  verified: "Verified",
  assigned: "Assigned",
  resolved: "Resolved",
  closed: "Closed",
};
