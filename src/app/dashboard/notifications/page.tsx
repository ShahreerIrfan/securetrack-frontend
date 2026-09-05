"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  Bell,
  CheckCheck,
  MessageSquare,
  RefreshCw,
  UserPlus,
  FileText,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastProvider";
import { api } from "@/lib/api";
import { formatRelativeTime } from "@/lib/date";
import { extractErrorMessage } from "@/lib/errors";
import type { AppNotification, NotificationKind, NotificationPage } from "@/types/report";

const kindIcons: Record<NotificationKind, typeof Bell> = {
  status_changed: RefreshCw,
  assigned: UserPlus,
  comment: MessageSquare,
  report_filed: FileText,
};

export default function NotificationsPage() {
  const toast = useToast();
  const [page, setPage] = useState<NotificationPage | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [busy, setBusy] = useState(false);

  const fetchNotifications = useCallback(() => {
    const params: Record<string, string> = { limit: "50" };
    if (filter === "unread") params.unread = "true";
    api
      .get<NotificationPage>("/notifications/", { params })
      .then((res) => setPage(res.data))
      .catch(() => setPage({ count: 0, unread_count: 0, results: [] }));
  }, [filter]);

  useEffect(fetchNotifications, [fetchNotifications]);

  const markRead = async (notification: AppNotification) => {
    if (notification.is_read) return;
    try {
      await api.post(`/notifications/${notification.id}/read/`);
      fetchNotifications();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const markAllRead = async () => {
    setBusy(true);
    try {
      await api.post("/notifications/read-all/");
      toast.success("All notifications marked as read");
      fetchNotifications();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const unread = page?.unread_count ?? 0;

  return (
    <ProtectedRoute>
      <DashboardLayout title="Notifications">
        <div className="max-w-3xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex rounded-lg border border-border bg-surface p-0.5">
              {(["all", "unread"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className={clsx(
                    "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                    filter === value
                      ? "bg-surface-raised text-accent"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  {value}
                  {value === "unread" && unread > 0 && ` (${unread})`}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              className="px-3 py-1.5 text-xs"
              disabled={busy || unread === 0}
              onClick={markAllRead}
            >
              <CheckCheck size={14} />
              Mark all read
            </Button>
          </div>

          {page === null ? (
            <Skeleton variant="table-row" rows={5} columns={2} />
          ) : page.results.length === 0 ? (
            <EmptyState
              icon={<Bell size={32} />}
              title={filter === "unread" ? "No unread notifications" : "No notifications yet"}
              description="Status changes, assignments and comments on your reports will show up here."
            />
          ) : (
            <ul className="space-y-2">
              {page.results.map((notification) => {
                const Icon = kindIcons[notification.kind] ?? Bell;
                const body = (
                  <div
                    className={clsx(
                      "flex items-start gap-3 rounded-xl border p-4 transition-colors",
                      notification.is_read
                        ? "border-border bg-surface"
                        : "border-accent/30 bg-accent-gradient-soft",
                    )}
                  >
                    <span
                      className={clsx(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg",
                        notification.is_read
                          ? "bg-surface-raised text-muted"
                          : "bg-accent/15 text-accent",
                      )}
                    >
                      <Icon size={15} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p
                        className={clsx(
                          "text-sm wrap-break-word",
                          notification.is_read ? "text-copy" : "font-medium text-foreground",
                        )}
                      >
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {notification.actor
                          ? `${notification.actor.first_name} ${notification.actor.last_name} · `
                          : ""}
                        {formatRelativeTime(notification.created_at)}
                      </p>
                    </div>

                    {!notification.is_read && (
                      <span aria-label="Unread" className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" />
                    )}
                  </div>
                );

                return (
                  <li key={notification.id}>
                    {notification.report_id ? (
                      <Link
                        href={`/dashboard/reports/${notification.report_id}`}
                        onClick={() => markRead(notification)}
                        className="block"
                      >
                        {body}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => markRead(notification)}
                        className="block w-full text-left"
                      >
                        {body}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
