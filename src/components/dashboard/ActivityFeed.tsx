"use client";

import Link from "next/link";
import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatUserName } from "@/lib/format";
import { formatRelativeTime } from "@/lib/date";
import type { GlobalActivityEntry } from "@/types/report";
import type { BadgeVariant } from "@/components/ui/Badge";

/** System-wide audit trail. Each entry links back to the report it
 * describes so an admin can jump straight from "who did what" to the
 * report itself. */
export function ActivityFeed({ entries }: { entries: GlobalActivityEntry[] }) {
  if (entries.length === 0) {
    return (
      <EmptyState
        icon={<Activity size={28} />}
        title="No activity yet"
        description="Status changes and assignments across every report will show up here."
      />
    );
  }

  return (
    <ol className="divide-y divide-border">
      {entries.map((entry) => (
        <li key={entry.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
          <span className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" aria-hidden />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {formatUserName(entry.actor)}
              </span>
              <Badge variant={entry.actor.role as BadgeVariant}>{entry.actor.role}</Badge>
              <span className="text-xs text-muted">{formatRelativeTime(entry.created_at)}</span>
            </div>
            <p className="mt-0.5 text-sm text-copy">{entry.detail}</p>
            <Link
              href={`/dashboard/reports/${entry.report_id}`}
              className="mt-0.5 inline-block truncate text-xs text-accent hover:underline"
            >
              {entry.report_title}
            </Link>
          </div>
        </li>
      ))}
    </ol>
  );
}
