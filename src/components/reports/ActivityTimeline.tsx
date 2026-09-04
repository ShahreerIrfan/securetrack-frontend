import {
  Activity,
  FilePlus2,
  MessageSquare,
  MessageSquareOff,
  PencilLine,
  Repeat2,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatUserName } from "@/lib/format";
import { formatRelativeTime } from "@/lib/date";
import type { ActivityLogEntry } from "@/types/report";

/** The log stores a free-text action, so unknown values fall back to a
 * generic node rather than breaking the timeline. */
const icons: Record<string, { icon: LucideIcon; tone: string }> = {
  created: { icon: FilePlus2, tone: "text-accent ring-accent/25 bg-accent/10" },
  edited: { icon: PencilLine, tone: "text-accent-blue ring-accent-blue/25 bg-accent-blue/10" },
  status_changed: { icon: Repeat2, tone: "text-amber ring-amber/25 bg-amber/10" },
  comment_added: { icon: MessageSquare, tone: "text-copy ring-border bg-surface-raised" },
  comment_edited: { icon: PencilLine, tone: "text-copy ring-border bg-surface-raised" },
  comment_deleted: { icon: MessageSquareOff, tone: "text-danger ring-danger/25 bg-danger/10" },
};

const fallback = { icon: Activity, tone: "text-muted ring-border bg-surface-raised" };

export function ActivityTimeline({ entries }: { entries: ActivityLogEntry[] }) {
  if (entries.length === 0) {
    return (
      <EmptyState
        icon={<Activity size={28} />}
        title="No activity yet"
        description="Every status change, edit and comment on this report will be recorded here."
      />
    );
  }

  return (
    <ol className="relative">
      {entries.map((entry, index) => {
        const { icon: Icon, tone } = icons[entry.action] ?? fallback;
        const isLast = index === entries.length - 1;

        return (
          <li key={entry.id} className="relative flex gap-3 pb-5 last:pb-0">
            {/* Connecting rail, stopping at the final node so the
                timeline doesn't trail off into empty space. */}
            {!isLast && (
              <span aria-hidden className="absolute left-3.25 top-7 bottom-0 w-px bg-border" />
            )}

            <span
              className={clsx(
                "relative z-10 flex size-6.5 shrink-0 items-center justify-center rounded-full ring-1",
                tone,
              )}
            >
              <Icon size={13} />
            </span>

            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-sm leading-snug text-copy">
                <span className="font-medium text-foreground">
                  {formatUserName(entry.actor)}
                </span>{" "}
                {entry.detail}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {formatRelativeTime(entry.created_at)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
