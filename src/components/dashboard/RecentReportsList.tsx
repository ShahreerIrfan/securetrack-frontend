import { ReportCard } from "@/components/reports/ReportCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Report } from "@/types/report";

export function RecentReportsList({ reports }: { reports: Report[] }) {
  if (reports.length === 0) {
    return <EmptyState title="No recent reports" />;
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  );
}
