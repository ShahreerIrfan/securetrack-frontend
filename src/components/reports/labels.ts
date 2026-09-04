import type { Category, Priority, ReportStatus, Severity } from "@/types/report";

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

export const priorityLabels: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const categoryLabels: Record<Category, string> = {
  web_application: "Web Application",
  network: "Network",
  physical_security: "Physical Security",
  social_engineering: "Social Engineering",
  other: "Other",
};

// Same hex values Badge.tsx uses for these variants - kept in sync so a
// chart slice and a badge for the same severity/status always agree.
export const severityColors: Record<Severity, string> = {
  low: "#00FF9C",
  medium: "#00C2FF",
  high: "#FFB020",
  critical: "#FF4757",
};

export const statusColors: Record<ReportStatus, string> = {
  new: "#8B98A5",
  in_review: "#00C2FF",
  verified: "#00FF9C",
  assigned: "#FFB020",
  resolved: "#00FF9C",
  closed: "#8B98A5",
};

export const priorityColors: Record<Priority, string> = {
  low: "#00FF9C",
  medium: "#00C2FF",
  high: "#FFB020",
  urgent: "#FF4757",
};
