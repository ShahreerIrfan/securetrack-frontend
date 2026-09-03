"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Table, TableColumn } from "@/components/ui/Table";
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
}

export function ReportTable({ reports, actions }: ReportTableProps) {
  const router = useRouter();

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
      emptyMessage="No reports found."
    />
  );
}
