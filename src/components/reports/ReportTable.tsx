"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarClock, Eye, FileSearch } from "lucide-react";
import clsx from "clsx";
import { EmptyState } from "@/components/ui/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import { SeverityBadge } from "./SeverityBadge";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { categoryLabels, severityColors } from "./labels";
import type { Report } from "@/types/report";

export interface ReportTableProps {
  reports: Report[];
  /** Extra per-row controls appended after the built-in view button
   * (e.g. Delete on the list page, status controls on dashboards). */
  actions?: (report: Report) => ReactNode;
  emptyState?: ReactNode;
  /** Drops the lower-priority columns for tight embeddings (dashboard
   * queues) where the full set would overflow. */
  compact?: boolean;
}

function isOverdue(report: Report): boolean {
  if (!report.due_date) return false;
  if (report.status === "resolved" || report.status === "closed") return false;
  return new Date(report.due_date) < new Date();
}

function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { day: "2-digit", month: "short" });
}

const headCell =
  "px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-muted";

export function ReportTable({ reports, actions, emptyState, compact = false }: ReportTableProps) {
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

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full min-w-max border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-raised/40">
            <th className={headCell}>Report</th>
            <th className={headCell}>Severity</th>
            <th className={headCell}>Status</th>
            {!compact && <th className={headCell}>Priority</th>}
            {!compact && <th className={headCell}>Assignee</th>}
            <th className={headCell}>{compact ? "Created" : "Due"}</th>
            <th className={clsx(headCell, "text-right")}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr
              key={report.id}
              onClick={() => router.push(`/dashboard/reports/${report.id}`)}
              className="group cursor-pointer border-b border-border/50 transition-colors last:border-b-0 hover:bg-surface-raised/50"
            >
              {/* The severity colour lives on the row edge rather than in
                  yet another chip - it turns the list into something you
                  can scan vertically for hot spots. */}
              <td
                className="border-l-2 py-3 pl-4 pr-4 transition-[border-color]"
                style={{ borderLeftColor: severityColors[report.severity] }}
              >
                <div className="max-w-md">
                  <p className="truncate font-medium text-foreground transition-colors group-hover:text-accent">
                    {report.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted">
                    #{report.id} · {categoryLabels[report.category]}
                    {!compact && report.description ? ` · ${report.description}` : ""}
                  </p>
                </div>
              </td>

              <td className="px-4 py-3">
                <SeverityBadge severity={report.severity} />
              </td>

              <td className="px-4 py-3">
                <StatusBadge status={report.status} />
              </td>

              {!compact && (
                <td className="px-4 py-3">
                  <PriorityBadge priority={report.priority} />
                </td>
              )}

              {!compact && (
                <td className="px-4 py-3">
                  {report.assigned_to ? (
                    <span className="inline-flex items-center gap-2">
                      <Avatar user={report.assigned_to} size="sm" />
                      <span className="text-xs text-copy">
                        {report.assigned_to.first_name}
                      </span>
                    </span>
                  ) : (
                    <span className="text-xs text-muted">Unassigned</span>
                  )}
                </td>
              )}

              <td className="whitespace-nowrap px-4 py-3 text-xs">
                {compact ? (
                  <span className="text-muted">{formatDay(report.created_at)}</span>
                ) : report.due_date ? (
                  <span
                    className={clsx(
                      "inline-flex items-center gap-1.5",
                      isOverdue(report) ? "font-semibold text-danger" : "text-copy",
                    )}
                  >
                    <CalendarClock size={13} />
                    {formatDay(report.due_date)}
                  </span>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </td>

              <td className="px-4 py-3">
                {/* Stops an action click from also firing the row's
                    navigate-to-detail handler. */}
                <div
                  className="flex items-center justify-end gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    href={`/dashboard/reports/${report.id}`}
                    aria-label={`View report: ${report.title}`}
                    title="View report"
                    className="inline-flex items-center justify-center rounded-lg border border-border p-1.5 text-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    <Eye size={15} />
                  </Link>
                  {actions?.(report)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
