import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { SeverityBadge } from "./SeverityBadge";
import { StatusBadge } from "./StatusBadge";
import type { Report } from "@/types/report";

export function ReportCard({ report }: { report: Report }) {
  return (
    <Link href={`/dashboard/reports/${report.id}`}>
      <Card className="transition-colors hover:border-accent/50">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-medium text-foreground">{report.title}</h3>
          <div className="flex shrink-0 gap-1.5">
            <SeverityBadge severity={report.severity} />
            <StatusBadge status={report.status} />
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{report.description}</p>
        <p className="mt-3 text-xs text-muted">
          {new Date(report.created_at).toLocaleDateString()}
        </p>
      </Card>
    </Link>
  );
}
