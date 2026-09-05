"use client";

import { Fragment, ReactNode, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarClock, ChevronDown, Eye, FileSearch, Paperclip, ShieldAlert } from "lucide-react";
import clsx from "clsx";
import { EmptyState } from "@/components/ui/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import { formatUserName } from "@/lib/format";
import { SeverityBadge } from "./SeverityBadge";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { categoryLabels, severityColors, vulnerabilityTypeLabels } from "./labels";
import type { Report } from "@/types/report";

export interface ReportTableProps {
  reports: Report[];
  /** Extra per-row controls appended after the built-in view button
   * (e.g. Delete on the list page, status controls on dashboards). */
  actions?: (report: Report) => ReactNode;
  emptyState?: ReactNode;
  /** Drops the lower-priority columns for tight embeddings (dashboard
   * queues) where the full set would overflow. Selection, row numbers
   * and the extra classification columns only appear outside compact. */
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
  "px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-muted";

/** Small coloured square that stands in for a thumbnail - tinted by
 * severity so the same "how bad is this" signal from the row edge in
 * the old design still reads at a glance, just as an icon instead. */
function ReportIcon({ severity }: { severity: Report["severity"] }) {
  const color = severityColors[severity];
  return (
    <span
      aria-hidden
      className="flex size-8 shrink-0 items-center justify-center rounded-lg"
      style={{ backgroundColor: `color-mix(in srgb, ${color} 16%, transparent)`, color }}
    >
      <ShieldAlert size={16} />
    </span>
  );
}

export function ReportTable({ reports, actions, emptyState, compact = false }: ReportTableProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [expanded, setExpanded] = useState<number | null>(null);

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

  const allSelected = reports.length > 0 && reports.every((r) => selected.has(r.id));

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(reports.map((r) => r.id)));
  };

  const toggleOne = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full min-w-max border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-raised/40">
            {!compact && (
              <th className={clsx(headCell, "w-10")}>
                <input
                  type="checkbox"
                  aria-label="Select all reports"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="size-3.5 rounded border-border accent-accent"
                />
              </th>
            )}
            {!compact && <th className={clsx(headCell, "px-2")}>SL</th>}
            <th className={headCell}>Report</th>
            {!compact && <th className={headCell}>By</th>}
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
          {reports.map((report, i) => (
            <Fragment key={report.id}>
              <tr
                onClick={() => router.push(`/dashboard/reports/${report.id}`)}
                className="group cursor-pointer border-b border-border/50 transition-colors last:border-b-0 hover:bg-surface-raised/50"
              >
                {!compact && (
                  <td
                    className="px-3 py-2.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      aria-label={`Select report: ${report.title}`}
                      checked={selected.has(report.id)}
                      onChange={() => toggleOne(report.id)}
                      className="size-3.5 rounded border-border accent-accent"
                    />
                  </td>
                )}

                {!compact && (
                  <td className="px-2 py-2.5 text-xs text-muted">{i + 1}</td>
                )}

                <td className="py-2.5 pl-3 pr-3">
                  <div className="flex max-w-52 items-center gap-2.5">
                    <ReportIcon severity={report.severity} />
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 truncate font-medium text-foreground transition-colors group-hover:text-accent">
                        <span className="truncate">{report.title}</span>
                        {report.attachment_name && (
                          <Paperclip
                            size={12}
                            className="shrink-0 text-muted"
                            aria-label="Has attachment"
                          />
                        )}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted">
                        #{report.id} · {categoryLabels[report.category]}
                      </p>
                    </div>
                  </div>
                </td>

                {!compact && (
                  <td className="px-3 py-2.5">
                    <span title={formatUserName(report.created_by)}>
                      <Avatar user={report.created_by} size="sm" />
                    </span>
                  </td>
                )}

                <td className="px-3 py-2.5">
                  <SeverityBadge severity={report.severity} />
                </td>

                <td className="px-3 py-2.5">
                  <StatusBadge status={report.status} />
                </td>

                {!compact && (
                  <td className="px-3 py-2.5">
                    <PriorityBadge priority={report.priority} />
                  </td>
                )}

                {!compact && (
                  <td className="px-3 py-2.5">
                    {report.assigned_to ? (
                      <span title={formatUserName(report.assigned_to)}>
                        <Avatar user={report.assigned_to} size="sm" />
                      </span>
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </td>
                )}

                <td className="whitespace-nowrap px-3 py-2.5 text-xs">
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

                <td className="px-3 py-2.5">
                  {/* Stops an action click from also firing the row's
                      navigate-to-detail handler. */}
                  <div
                    className="flex items-center justify-end gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      href={`/dashboard/reports/${report.id}`}
                      aria-label={`View report: ${report.title}`}
                      title="View report"
                      className="inline-flex items-center justify-center rounded-lg border border-border p-1 text-muted transition-colors hover:border-accent hover:text-accent"
                    >
                      <Eye size={14} />
                    </Link>
                    {actions?.(report)}
                    {!compact && (
                      <button
                        type="button"
                        aria-label={expanded === report.id ? "Collapse row" : "Expand row"}
                        onClick={() =>
                          setExpanded((prev) => (prev === report.id ? null : report.id))
                        }
                        className="inline-flex items-center justify-center rounded-lg border border-border p-1 text-muted transition-colors hover:border-accent hover:text-accent"
                      >
                        <ChevronDown
                          size={14}
                          className={clsx(
                            "transition-transform",
                            expanded === report.id && "rotate-180",
                          )}
                        />
                      </button>
                    )}
                  </div>
                </td>
              </tr>

              {!compact && expanded === report.id && (
                <tr className="border-b border-border/50 bg-surface-raised/30">
                  <td colSpan={10} className="px-4 py-4 pl-16">
                    <p className="mb-2 text-xs text-muted">
                      Vulnerability Type:{" "}
                      <span className="text-copy">
                        {vulnerabilityTypeLabels[report.vulnerability_type]}
                      </span>
                    </p>
                    <p className="max-w-3xl whitespace-pre-line wrap-break-word text-sm leading-relaxed text-copy">
                      {report.description || (
                        <span className="text-muted">No description provided.</span>
                      )}
                    </p>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
