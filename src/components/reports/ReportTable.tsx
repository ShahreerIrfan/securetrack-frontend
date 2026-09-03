"use client";

import { useRouter } from "next/navigation";
import { Table, TableColumn } from "@/components/ui/Table";
import { SeverityBadge } from "./SeverityBadge";
import { StatusBadge } from "./StatusBadge";
import type { Report } from "@/types/report";

export interface ReportTableProps {
  reports: Report[];
}

export function ReportTable({ reports }: ReportTableProps) {
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
