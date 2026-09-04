import Link from "next/link";
import { CalendarClock, MessageSquare } from "lucide-react";
import clsx from "clsx";
import { Avatar } from "@/components/ui/Avatar";
import { SeverityBadge } from "./SeverityBadge";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { categoryLabels, severityColors } from "./labels";
import type { Report } from "@/types/report";

function isOverdue(report: Report): boolean {
  if (!report.due_date) return false;
  if (report.status === "resolved" || report.status === "closed") return false;
  return new Date(report.due_date) < new Date();
}

export function ReportCard({ report }: { report: Report }) {
  return (
    <Link href={`/dashboard/reports/${report.id}`} className="group block">
      <article
        // Same severity-on-the-edge idea as the table rows, so a card
        // and a row for the same report read as the same object.
        className="relative h-full overflow-hidden rounded-xl border border-border bg-surface p-5 pl-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_8px_28px_-12px_rgba(0,0,0,0.7)]"
      >
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-1"
          style={{ backgroundColor: severityColors[report.severity] }}
        />

        <div className="flex items-start justify-between gap-3">
          <span className="text-[11px] font-medium tracking-wide text-muted">
            #{report.id} · {categoryLabels[report.category]}
          </span>
          <PriorityBadge priority={report.priority} />
        </div>

        <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-accent">
          {report.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {report.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <SeverityBadge severity={report.severity} />
          <StatusBadge status={report.status} />
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted">
          <span className="inline-flex items-center gap-2">
            {report.assigned_to ? (
              <>
                <Avatar user={report.assigned_to} size="sm" />
                {report.assigned_to.first_name}
              </>
            ) : (
              "Unassigned"
            )}
          </span>

          <span className="inline-flex items-center gap-3">
            {report.comments && report.comments.length > 0 && (
              <span className="inline-flex items-center gap-1">
                <MessageSquare size={13} />
                {report.comments.length}
              </span>
            )}
            {report.due_date ? (
              <span
                className={clsx(
                  "inline-flex items-center gap-1",
                  isOverdue(report) && "font-semibold text-danger",
                )}
              >
                <CalendarClock size={13} />
                {new Date(report.due_date).toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            ) : (
              <span>{new Date(report.created_at).toLocaleDateString()}</span>
            )}
          </span>
        </div>
      </article>
    </Link>
  );
}
