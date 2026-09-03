import { Activity } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatUserName } from "@/lib/format";
import type { ActivityLogEntry } from "@/types/report";

export function ActivityTimeline({ entries }: { entries: ActivityLogEntry[] }) {
  if (entries.length === 0) {
    return <EmptyState title="No activity yet" description="Status changes will appear here." />;
  }

  return (
    <ol className="space-y-4">
      {entries.map((entry) => (
        <li key={entry.id} className="flex gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-raised text-accent">
            <Activity size={13} />
          </span>
          <div>
            <p className="text-sm text-foreground">
              <span className="font-medium">{formatUserName(entry.actor)}</span> {entry.detail}
            </p>
            <p className="mt-0.5 text-xs text-muted">
              {new Date(entry.created_at).toLocaleString()}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
