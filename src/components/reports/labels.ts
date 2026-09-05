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

// Same hex values Badge.tsx's variantClasses resolve to (via the
// --color-* tokens in globals.css) - kept in sync so a chart slice and a
// badge for the same severity/status always agree.
export const severityColors: Record<Severity, string> = {
  low: "#34D399",
  medium: "#3B82F6",
  high: "#FBBF24",
  critical: "#F87171",
};

export const statusColors: Record<ReportStatus, string> = {
  new: "#818CF8",
  in_review: "#3B82F6",
  verified: "#22D3EE",
  assigned: "#FBBF24",
  resolved: "#34D399",
  closed: "#64748B",
};

export const priorityColors: Record<Priority, string> = {
  low: "#34D399",
  medium: "#3B82F6",
  high: "#FBBF24",
  urgent: "#F87171",
};
