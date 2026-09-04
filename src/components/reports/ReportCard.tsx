import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { SeverityBadge } from "./SeverityBadge";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import type { Report } from "@/types/report";

function isOverdue(report: Report): boolean {
  if (!report.due_date) return false;
  if (report.status === "resolved" || report.status === "closed") return false;
  return new Date(report.due_date) < new Date();
}

export function ReportCard({ report }: { report: Report }) {
  return (
    <Link href={`/dashboard/reports/${report.id}`}>
      <Card className="transition-colors hover:border-accent/50">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-medium text-foreground">{report.title}</h3>
          <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
            <SeverityBadge severity={report.severity} />
            <StatusBadge status={report.status} />
            <PriorityBadge priority={report.priority} />
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{report.description}</p>
        <p className="mt-3 flex items-center justify-between text-xs text-muted">
          <span>{new Date(report.created_at).toLocaleDateString()}</span>
          {report.due_date && (
            <span className={isOverdue(report) ? "font-medium text-danger" : undefined}>
              Due {new Date(report.due_date).toLocaleDateString()}
            </span>
          )}
        </p>
      </Card>
    </Link>
  );
}
