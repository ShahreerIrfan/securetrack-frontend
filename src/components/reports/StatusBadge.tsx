import clsx from "clsx";
import type { ReportStatus } from "@/types/report";
import { statusLabels } from "./labels";

/** Status is workflow position, not urgency - so it reads as a quiet
 * outlined chip, letting SeverityBadge own the colour in a row. The dot
 * carries the state colour; the text stays neutral. */
const dots: Record<ReportStatus, string> = {
  new: "bg-muted",
  in_review: "bg-accent-blue",
  verified: "bg-accent",
  assigned: "bg-amber",
  resolved: "bg-accent",
  closed: "bg-muted",
};

export function StatusBadge({ status, className }: { status: ReportStatus; className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-raised/60 px-2 py-0.5 text-[11px] font-medium text-copy",
        className,
      )}
    >
      <span
        className={clsx(
          "size-1.5 rounded-full",
          dots[status],
          // In-flight states pulse gently; terminal ones sit still.
          (status === "in_review" || status === "assigned") && "animate-pulse",
        )}
      />
      {statusLabels[status]}
    </span>
  );
}
