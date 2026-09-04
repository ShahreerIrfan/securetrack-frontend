"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  FolderOpen,
  Timer,
  UserCog,
  UserX,
  Users,
} from "lucide-react";
import { StatCardGrid } from "@/components/dashboard/StatCardGrid";
import { SimpleBarChart, type ChartDatum } from "@/components/dashboard/SimpleBarChart";
import { SimpleDonutChart } from "@/components/dashboard/SimpleDonutChart";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { WorkloadTable } from "@/components/dashboard/WorkloadTable";
import { ReportTable } from "@/components/reports/ReportTable";
import { ReportActions } from "@/components/reports/ReportActions";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import { formatDuration } from "@/lib/date";
import { useAuthStore } from "@/store/authStore";
import type {
  DashboardStats,
  GlobalActivityEntry,
  Report,
  TrendPoint,
  WorkloadRow,
} from "@/types/report";
import {
  severityColors,
  severityLabels,
  statusColors,
  statusLabels,
} from "@/components/reports/labels";

const TREND_RANGES = [7, 14, 30, 90];

/** Section shell so every panel on this page gets the same frame,
 * heading and loading treatment. */
function Panel({
  title,
  action,
  loading,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  loading: boolean;
  children: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-copy">{title}</p>
        {action}
      </div>
      {loading ? <Skeleton variant="card" /> : children}
    </Card>
  );
}

export function AdminDashboard() {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  // The loaded range is stored alongside the points so switching ranges
  // shows the spinner without a synchronous reset, and a slow response
  // for an old range can't overwrite a newer one.
  const [trendData, setTrendData] = useState<{ days: number; points: TrendPoint[] } | null>(null);
  const [trendDays, setTrendDays] = useState(14);
  const [workload, setWorkload] = useState<WorkloadRow[] | null>(null);
  const [activity, setActivity] = useState<GlobalActivityEntry[] | null>(null);
  const [unassignedVerified, setUnassignedVerified] = useState<Report[] | null>(null);

  const fetchUnassignedVerified = useCallback(() => {
    api.get<Report[]>("/reports/", { params: { status: "verified" } }).then((res) => {
      setUnassignedVerified(res.data.filter((r) => r.assigned_to === null));
    });
  }, []);

  // Assigning a report changes the queue, the workload split, the status
  // counts and the audit trail all at once - so every panel that shows
  // one of those has to be refetched together, not just the queue table.
  const refreshAll = useCallback(() => {
    api.get<DashboardStats>("/dashboard/stats/").then((res) => setStats(res.data));
    api.get<WorkloadRow[]>("/dashboard/workload/").then((res) => setWorkload(res.data));
    api
      .get<GlobalActivityEntry[]>("/dashboard/activity/", { params: { limit: 12 } })
      .then((res) => setActivity(res.data));
    fetchUnassignedVerified();
  }, [fetchUnassignedVerified]);

  useEffect(refreshAll, [refreshAll]);

  useEffect(() => {
    api
      .get<TrendPoint[]>("/dashboard/trends/", { params: { days: trendDays } })
      .then((res) => setTrendData({ days: trendDays, points: res.data }));
  }, [trendDays]);

  const trendsLoading = trendData?.days !== trendDays;

  const statusChartData: ChartDatum[] = stats
    ? Object.entries(stats.by_status).map(([status, value]) => ({
        name: statusLabels[status as keyof typeof statusLabels],
        value,
        color: statusColors[status as keyof typeof statusColors],
      }))
    : [];

  const severityChartData: ChartDatum[] = stats
    ? Object.entries(stats.by_severity).map(([severity, value]) => ({
        name: severityLabels[severity as keyof typeof severityLabels],
        value,
        color: severityColors[severity as keyof typeof severityColors],
      }))
    : [];

  const totalUsers = stats?.users_by_role
    ? Object.values(stats.users_by_role).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-foreground">Admin Overview</h1>
        <Link
          href="/dashboard/users"
          className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
        >
          <UserCog size={16} />
          User Management
        </Link>
      </div>

      {stats ? (
        <StatCardGrid
          stats={[
            {
              icon: <FileText size={20} />,
              label: "Total Reports",
              value: stats.total_reports,
              trend: `${stats.created_this_week ?? 0} new this week`,
            },
            {
              icon: <FolderOpen size={20} />,
              label: "Open",
              value: stats.open_reports ?? 0,
              trend: `${stats.unassigned_reports ?? 0} unassigned`,
            },
            {
              icon: <AlertTriangle size={20} />,
              label: "Critical Open",
              value: stats.critical_open ?? 0,
              trend: "Needs immediate triage",
            },
            {
              icon: <CheckCircle2 size={20} />,
              label: "Resolved / Closed",
              value: (stats.by_status.resolved ?? 0) + (stats.by_status.closed ?? 0),
              trend: `${stats.resolved_this_week ?? 0} closed this week`,
            },
            {
              icon: <Timer size={20} />,
              label: "Avg Resolution",
              value: formatDuration(stats.avg_resolution_hours),
              trend: "Created to resolved",
            },
            {
              icon: <Clock size={20} />,
              label: "Awaiting Review",
              value: (stats.by_status.new ?? 0) + (stats.by_status.in_review ?? 0),
              trend: "New + in review",
            },
            {
              icon: <Users size={20} />,
              label: "Total Users",
              value: totalUsers,
              trend: `${stats.users_by_role?.developer ?? 0} developers · ${
                stats.users_by_role?.analyst ?? 0
              } analysts`,
            },
            {
              icon: <UserX size={20} />,
              label: "Deactivated Users",
              value: stats.inactive_users ?? 0,
              trend: `${stats.active_users ?? 0} active`,
            },
          ]}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      )}

      <Panel
        title="Intake vs. Resolution"
        loading={trendsLoading}
        action={
          <Select
            value={trendDays}
            onChange={(e) => setTrendDays(Number(e.target.value))}
            className="w-32 px-2.5 py-1 text-xs"
            aria-label="Trend range"
          >
            {TREND_RANGES.map((days) => (
              <option key={days} value={days}>
                Last {days} days
              </option>
            ))}
          </Select>
        }
      >
        <TrendChart data={trendData?.points ?? []} />
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Reports by Status" loading={!stats}>
          <SimpleBarChart data={statusChartData} />
        </Panel>
        <Panel title="Reports by Severity" loading={!stats}>
          <SimpleDonutChart data={severityChartData} />
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Developer Workload" loading={!workload}>
          <WorkloadTable rows={workload ?? []} />
        </Panel>
        <Panel title="Recent Activity" loading={!activity}>
          <ActivityFeed entries={activity ?? []} />
        </Panel>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-copy">Unassigned Verified Reports</h2>
        {unassignedVerified && user ? (
          <ReportTable
            reports={unassignedVerified}
            actions={(report) => (
              <ReportActions
                report={report}
                currentUserId={user.id}
                role="admin"
                compact
                onUpdated={refreshAll}
              />
            )}
          />
        ) : (
          <Skeleton variant="table-row" rows={4} />
        )}
      </div>
    </div>
  );
}
