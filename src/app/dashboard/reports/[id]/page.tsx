"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  CalendarPlus,
  Clock,
  Flag,
  FolderTree,
  Settings2,
  ShieldAlert,
  Users,
} from "lucide-react";
import clsx from "clsx";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SeverityBadge } from "@/components/reports/SeverityBadge";
import { StatusBadge } from "@/components/reports/StatusBadge";
import { PriorityBadge } from "@/components/reports/PriorityBadge";
import { ActivityTimeline } from "@/components/reports/ActivityTimeline";
import { CommentThread } from "@/components/reports/CommentThread";
import { ReportActions } from "@/components/reports/ReportActions";
import { categoryLabels, severityColors, vulnerabilityTypeLabels } from "@/components/reports/labels";
import { Avatar } from "@/components/ui/Avatar";
import { Tabs } from "@/components/ui/Tabs";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import { formatUserName } from "@/lib/format";
import { formatRelativeTime } from "@/lib/date";
import { useAuthStore } from "@/store/authStore";
import type { ActivityLogEntry, Comment, Report } from "@/types/report";

function isOverdue(report: Report): boolean {
  if (!report.due_date) return false;
  if (report.status === "resolved" || report.status === "closed") return false;
  return new Date(report.due_date) < new Date();
}

/** One labelled row inside a sidebar panel - icon + label on the left,
 * value on the right, same convention across every panel below so the
 * sidebar reads as one system rather than four different ones. */
function MetaRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="inline-flex items-center gap-2 text-xs text-muted">
        {icon}
        {label}
      </span>
      <span className="text-right text-sm text-copy">{children}</span>
    </div>
  );
}

/** A titled sidebar card - the whole detail page is built from a stack
 * of these plus the hero, rather than one catch-all "Details" block, so
 * each concern (classification, people, timeline, actions) reads as its
 * own scannable unit. */
function Panel({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h2 className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
        <span className="text-accent">{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function ReportDetailPage(props: PageProps<"/dashboard/reports/[id]">) {
  const { id } = use(props.params);
  const user = useAuthStore((s) => s.user);

  const [report, setReport] = useState<Report | null>(null);
  const [activity, setActivity] = useState<ActivityLogEntry[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchActivity = () => {
    api.get<ActivityLogEntry[]>(`/reports/${id}/activity/`).then((res) => setActivity(res.data));
  };

  useEffect(() => {
    api.get<Report>(`/reports/${id}/`).then((res) => setReport(res.data));
    fetchActivity();
    api.get<Comment[]>(`/reports/${id}/comments/`).then((res) => setComments(res.data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleReportUpdated = (updated: Report) => {
    setReport(updated);
    // ReportActions just changed status - refetch so Activity reflects it
    // immediately instead of only on next full page load.
    fetchActivity();
  };

  return (
    <ProtectedRoute>
      <DashboardLayout title={report?.title ?? "Report"}>
        {!report || !user ? (
          <Skeleton variant="card" className="max-w-7xl" />
        ) : (
          <div className="max-w-7xl space-y-6">
            <Link
              href="/dashboard/reports"
              className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-accent"
            >
              <ArrowLeft size={14} />
              Back to reports
            </Link>

            {/* Hero: the severity colour bleeds in from the left edge and
                fades out, so the page itself is tinted by how bad this
                finding is rather than just carrying a coloured chip. */}
            <section className="relative overflow-hidden rounded-2xl border border-border bg-surface">
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-1.5"
                style={{ backgroundColor: severityColors[report.severity] }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                  background: `radial-gradient(60% 120% at 0% 0%, ${severityColors[report.severity]} 0%, transparent 70%)`,
                }}
              />

              <div className="relative p-6 pl-7 sm:p-8 sm:pl-9">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted">#{report.id}</span>
                  <span className="text-muted">·</span>
                  <SeverityBadge severity={report.severity} />
                  <StatusBadge status={report.status} />
                  <PriorityBadge priority={report.priority} />
                </div>

                <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
                  {report.title}
                </h1>

                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/60 pt-4 text-xs text-muted">
                  <span className="inline-flex items-center gap-2">
                    <Avatar user={report.created_by} size="sm" />
                    Reported by{" "}
                    <span className="text-copy">{formatUserName(report.created_by)}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={13} />
                    {formatRelativeTime(report.created_at)}
                  </span>
                </div>
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
              <div className="min-w-0 space-y-6">
                <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                    Description
                  </h2>
                  <p className="max-w-3xl whitespace-pre-line wrap-break-word text-sm leading-relaxed text-copy">
                    {report.description || (
                      <span className="text-muted">No description provided.</span>
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
                  <Tabs
                    items={[
                      {
                        key: "activity",
                        label: `Activity${activity.length ? ` (${activity.length})` : ""}`,
                        content: <ActivityTimeline entries={activity} />,
                      },
                      {
                        key: "comments",
                        label: `Comments${comments.length ? ` (${comments.length})` : ""}`,
                        content: (
                          <CommentThread
                            reportId={report.id}
                            comments={comments}
                            currentUserId={user.id}
                            isAdmin={user.role === "admin"}
                            onCommentAdded={(comment) =>
                              setComments((prev) => [...prev, comment])
                            }
                            onCommentUpdated={(updated) =>
                              setComments((prev) =>
                                prev.map((c) => (c.id === updated.id ? updated : c)),
                              )
                            }
                            onCommentDeleted={(commentId) =>
                              setComments((prev) => prev.filter((c) => c.id !== commentId))
                            }
                          />
                        ),
                      },
                    ]}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <Panel icon={<Settings2 size={13} />} title="Actions">
                  <div className="mt-2">
                    <ReportActions
                      report={report}
                      currentUserId={user.id}
                      role={user.role}
                      onUpdated={handleReportUpdated}
                    />
                  </div>
                </Panel>

                <Panel icon={<ShieldAlert size={13} />} title="Classification">
                  <div className="divide-y divide-border/60">
                    <MetaRow icon={<AlertTriangle size={13} />} label="Severity">
                      <SeverityBadge severity={report.severity} />
                    </MetaRow>
                    <MetaRow icon={<Flag size={13} />} label="Priority">
                      <PriorityBadge priority={report.priority} />
                    </MetaRow>
                    <MetaRow icon={<ShieldAlert size={13} />} label="Type">
                      {vulnerabilityTypeLabels[report.vulnerability_type]}
                    </MetaRow>
                    <MetaRow icon={<FolderTree size={13} />} label="Category">
                      {categoryLabels[report.category]}
                    </MetaRow>
                  </div>
                </Panel>

                <Panel icon={<Users size={13} />} title="People">
                  <div className="divide-y divide-border/60">
                    <MetaRow icon={<Users size={13} />} label="Reported By">
                      <span className="inline-flex items-center gap-2">
                        <Avatar user={report.created_by} size="sm" />
                        {formatUserName(report.created_by)}
                      </span>
                    </MetaRow>
                    <MetaRow icon={<Users size={13} />} label="Assignee">
                      {report.assigned_to ? (
                        <span className="inline-flex items-center gap-2">
                          <Avatar user={report.assigned_to} size="sm" />
                          {formatUserName(report.assigned_to)}
                        </span>
                      ) : (
                        <span className="text-muted">Unassigned</span>
                      )}
                    </MetaRow>
                  </div>
                </Panel>

                <Panel icon={<CalendarPlus size={13} />} title="Timeline">
                  <div className="divide-y divide-border/60">
                    <MetaRow icon={<CalendarPlus size={13} />} label="Created">
                      {new Date(report.created_at).toLocaleDateString()}
                    </MetaRow>
                    <MetaRow icon={<CalendarClock size={13} />} label="Due">
                      {report.due_date ? (
                        <span className={clsx(isOverdue(report) && "font-semibold text-danger")}>
                          {new Date(report.due_date).toLocaleDateString()}
                          {isOverdue(report) && " · overdue"}
                        </span>
                      ) : (
                        <span className="text-muted">Not set</span>
                      )}
                    </MetaRow>
                    <MetaRow icon={<Clock size={13} />} label="Last Updated">
                      {formatRelativeTime(report.updated_at)}
                    </MetaRow>
                  </div>
                </Panel>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
