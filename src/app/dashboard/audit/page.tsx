"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ScrollText, Search } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { Avatar } from "@/components/ui/Avatar";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { api } from "@/lib/api";
import { formatUserName } from "@/lib/format";
import { formatRelativeTime } from "@/lib/date";
import type { ActivityFeedPage, NestedUser } from "@/types/report";

const PAGE_SIZE = 25;

const DAY_RANGES = [
  { value: "", label: "All time" },
  { value: "1", label: "Last 24 hours" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
];

/** "status_changed" -> "Status Changed" */
function humanizeAction(action: string): string {
  return action
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const headCell =
  "px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-muted";

export default function AuditLogPage() {
  const [page, setPage] = useState<ActivityFeedPage | null>(null);
  const [actions, setActions] = useState<string[]>([]);
  const [actors, setActors] = useState<NestedUser[]>([]);

  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [actor, setActor] = useState("");
  const [days, setDays] = useState("");
  const [offset, setOffset] = useState(0);

  const debouncedSearch = useDebouncedValue(search, 300);

  useEffect(() => {
    api
      .get<string[]>("/dashboard/activity/actions/")
      .then((res) => setActions(res.data))
      .catch(() => setActions([]));
    // Actor filter is a convenience for admins; analysts can't list users,
    // so a failure here just leaves the dropdown with its "all" option.
    api
      .get<NestedUser[]>("/auth/users/")
      .then((res) => setActors(res.data))
      .catch(() => setActors([]));
  }, []);

  const fetchPage = useCallback(() => {
    const params: Record<string, string> = {
      limit: String(PAGE_SIZE),
      offset: String(offset),
    };
    if (debouncedSearch) params.search = debouncedSearch;
    if (action) params.action = action;
    if (actor) params.actor = actor;
    if (days) params.days = days;

    api
      .get<ActivityFeedPage>("/dashboard/activity/", { params })
      .then((res) => setPage(res.data))
      .catch(() => setPage({ count: 0, results: [] }));
  }, [debouncedSearch, action, actor, days, offset]);

  useEffect(fetchPage, [fetchPage]);

  // Any filter change invalidates the current page position - staying on
  // page 3 of a now-2-page result set would just show an empty table.
  useEffect(() => {
    setOffset(0);
  }, [debouncedSearch, action, actor, days]);

  const total = page?.count ?? 0;
  const showingFrom = total === 0 ? 0 : offset + 1;
  const showingTo = Math.min(offset + PAGE_SIZE, total);

  return (
    <ProtectedRoute allowedRoles={["admin", "analyst"]}>
      <DashboardLayout title="Audit Log">
        <div className="space-y-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
            <div className="relative lg:min-w-64 lg:flex-1">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <Input
                placeholder="Search detail or report title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="lg:max-w-44"
            >
              <option value="">All Actions</option>
              {actions.map((value) => (
                <option key={value} value={value}>
                  {humanizeAction(value)}
                </option>
              ))}
            </Select>

            <Select
              value={actor}
              onChange={(e) => setActor(e.target.value)}
              className="lg:max-w-52"
            >
              <option value="">All Users</option>
              {actors.map((u) => (
                <option key={u.id} value={u.id}>
                  {formatUserName(u)}
                </option>
              ))}
            </Select>

            <Select
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="lg:max-w-40"
            >
              {DAY_RANGES.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </Select>
          </div>

          {page === null ? (
            <Skeleton variant="table-row" rows={6} columns={4} />
          ) : page.results.length === 0 ? (
            <EmptyState
              icon={<ScrollText size={32} />}
              title="No activity found"
              description="Try widening the date range or clearing the filters."
            />
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border border-border bg-surface">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface-raised/40">
                      <th className={headCell}>When</th>
                      <th className={headCell}>User</th>
                      <th className={headCell}>Action</th>
                      <th className={headCell}>Detail</th>
                      <th className={headCell}>Report</th>
                    </tr>
                  </thead>
                  <tbody>
                    {page.results.map((entry) => (
                      <tr
                        key={entry.id}
                        className="border-b border-border/50 last:border-b-0 hover:bg-surface-raised/40"
                      >
                        <td className="whitespace-nowrap px-3 py-2.5 text-xs text-muted">
                          {formatRelativeTime(entry.created_at)}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="inline-flex items-center gap-2">
                            <Avatar user={entry.actor} size="sm" />
                            <span className="text-xs text-copy">
                              {formatUserName(entry.actor)}
                            </span>
                            <Badge variant={entry.actor.role as BadgeVariant}>
                              {entry.actor.role}
                            </Badge>
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-xs text-copy">
                          {humanizeAction(entry.action)}
                        </td>
                        <td className="px-3 py-2.5 text-xs text-copy">{entry.detail}</td>
                        <td className="px-3 py-2.5">
                          <Link
                            href={`/dashboard/reports/${entry.report_id}`}
                            className="text-xs text-accent hover:underline"
                          >
                            {entry.report_title}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-muted">
                  Showing {showingFrom}–{showingTo} of {total}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="px-2.5 py-1 text-xs"
                    disabled={offset === 0}
                    onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
                  >
                    <ChevronLeft size={14} />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    className="px-2.5 py-1 text-xs"
                    disabled={showingTo >= total}
                    onClick={() => setOffset(offset + PAGE_SIZE)}
                  >
                    Next
                    <ChevronRight size={14} />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
