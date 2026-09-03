"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { FileSearch } from "lucide-react";
import { Table, TableColumn } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/EmptyState";
import { SeverityBadge } from "./SeverityBadge";
import { StatusBadge } from "./StatusBadge";
import type { Report } from "@/types/report";

export interface ReportTableProps {
  reports: Report[];
  /** Renders an extra "Actions" column when provided (e.g. quick-action
   * queues on the Analyst/Admin dashboards). Clicks inside this column
   * are stopped from bubbling so an action button doesn't also trigger
   * the row's navigate-to-detail click. */
  actions?: (report: Report) => ReactNode;
  /** Overrides the default EmptyState shown when reports is empty
   * (e.g. a filtered list wants "try adjusting your filters" instead
   * of the generic message). */
  emptyState?: ReactNode;
}

export function ReportTable({ reports, actions, emptyState }: ReportTableProps) {
  const router = useRouter();

  if (reports.length === 0) {
    return (
      emptyState ?? (
        <EmptyState
          icon={<FileSearch size={32} />}
          title="No reports found"
          description="There's nothing here yet."
        />
      )
    );
  }

  const columns: TableColumn<Report>[] = [
    { key: "title", header: "Title" },
    {
      key: "severity",
      header: "Severity",
      render: (report) => <SeverityBadge severity={report.severity} />,
    },
    {
      key: "status",
      header: "Status",
      render: (report) => <StatusBadge status={report.status} />,
    },
    {
      key: "created_at",
      header: "Created",
      render: (report) => new Date(report.created_at).toLocaleDateString(),
    },
  ];

  if (actions) {
    columns.push({
      key: "actions",
      header: "Actions",
      render: (report) => (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div onClick={(e) => e.stopPropagation()}>{actions(report)}</div>
      ),
    });
  }

  return (
    <Table
      columns={columns}
      data={reports}
      getRowKey={(report) => report.id}
      onRowClick={(report) => router.push(`/dashboard/reports/${report.id}`)}
    />
  );
}
