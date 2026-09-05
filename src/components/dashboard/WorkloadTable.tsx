"use client";

import clsx from "clsx";
import { Table, type TableColumn } from "@/components/ui/Table";
import { formatUserName } from "@/lib/format";
import type { WorkloadRow } from "@/types/report";

/** Rough capacity signal so an admin can see who is already buried
 * before handing them the next report. */
function loadTone(open: number): string {
  if (open >= 5) return "text-danger";
  if (open >= 3) return "text-amber";
  return "text-success";
}

export function WorkloadTable({ rows }: { rows: WorkloadRow[] }) {
  const columns: TableColumn<WorkloadRow>[] = [
    {
      key: "name",
      header: "Developer",
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">{formatUserName(row)}</p>
          <p className="truncate text-xs text-muted">{row.email}</p>
        </div>
      ),
    },
    {
      key: "open_assigned",
      header: "Open",
      render: (row) => (
        <span className={clsx("font-semibold", loadTone(row.open_assigned))}>
          {row.open_assigned}
        </span>
      ),
    },
    { key: "resolved", header: "Resolved" },
    { key: "total_assigned", header: "Total" },
  ];

  return (
    <Table
      columns={columns}
      data={rows}
      getRowKey={(row) => row.id}
      emptyMessage="No active developers yet. Create one from User Management."
    />
  );
}
