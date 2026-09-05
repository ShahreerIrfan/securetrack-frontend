"use client";

import { useEffect, useState } from "react";
import { Download, FileStack, ShieldAlert, Timer, TrendingUp } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SimpleBarChart, type ChartDatum } from "@/components/dashboard/SimpleBarChart";
import { SimpleDonutChart } from "@/components/dashboard/SimpleDonutChart";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { WorkloadTable } from "@/components/dashboard/WorkloadTable";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/ui/StatCard";
import { useToast } from "@/components/ui/ToastProvider";
import {
  categoryLabels,
  severityColors,
  severityLabels,
  statusColors,
  statusLabels,
  vulnerabilityTypeLabels,
} from "@/components/reports/labels";
import { api } from "@/lib/api";
import { exportReportsCsv } from "@/lib/attachments";
import { formatDuration } from "@/lib/date";
import { extractErrorMessage } from "@/lib/errors";
import { useAuthStore } from "@/store/authStore";
import type {
  Category,
  DashboardStats,
  ReportStatus,
  Severity,
  TrendPoint,
  VulnerabilityType,
  WorkloadRow,
} from "@/types/report";

const TREND_RANGES = [7, 14, 30, 90];

function Panel({
  title,
  action,
  loading,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  loading?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-copy">{title}</h2>
        {action}
      </div>
      {loading ? <Skeleton variant="table-row" rows={4} columns={3} /> : children}
    </section>
  );
}

export default function AnalyticsPage() {
  const toast = useToast();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "admin";

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trends, setTrends] = useState<TrendPoint[] | null>(null);
  const [workload, setWorkload] = useState<WorkloadRow[] | null>(null);
  const [trendDays, setTrendDays] = useState(30);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    api.get<DashboardStats>("/dashboard/stats/").then((res) => setStats(res.data));
    // Workload is admin-only server-side; analysts simply don't get the panel.
    if (isAdmin) {
      api.get<WorkloadRow[]>("/dashboard/workload/").then((res) => setWorkload(res.data));
    }
  }, [isAdmin]);

  useEffect(() => {
    setTrends(null);
    api
      .get<TrendPoint[]>("/dashboard/trends/", { params: { days: trendDays } })
      .then((res) => setTrends(res.data));
  }, [trendDays]);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportReportsCsv({});
      toast.success("Export downloaded");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setExporting(false);
    }
  };

  const statusData: ChartDatum[] = stats
    ? (Object.entries(stats.by_status) as [ReportStatus, number][]).map(([key, value]) => ({
        name: statusLabels[key],
        value,
        color: statusColors[key],
      }))
    : [];

  const severityData: ChartDatum[] = stats
    ? (Object.entries(stats.by_severity) as [Severity, number][]).map(([key, value]) => ({
        name: severityLabels[key],
        value,
        color: severityColors[key],
      }))
    : [];

  const categoryData: ChartDatum[] = stats
    ? (Object.entries(stats.by_category) as [Category, number][]).map(([key, value]) => ({
        name: categoryLabels[key],
        value,
      }))
    : [];

  // Long tail of mostly-zero types would squash the meaningful bars, so
  // this only charts the types actually present, worst-first.
  const typeData: ChartDatum[] = stats
    ? (Object.entries(stats.by_vulnerability_type) as [VulnerabilityType, number][])
        .filter(([, value]) => value > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([key, value]) => ({ name: vulnerabilityTypeLabels[key], value }))
    : [];

  const resolved = stats
    ? (stats.by_status.resolved ?? 0) + (stats.by_status.closed ?? 0)
    : 0;
  const resolutionRate =
    stats && stats.total_reports > 0
      ? `${Math.round((resolved / stats.total_reports) * 100)}%`
      : "—";

  return (
    <ProtectedRoute allowedRoles={["admin", "analyst"]}>
      <DashboardLayout title="Analytics">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-foreground">Reporting Overview</h2>
            <Button variant="outline" disabled={exporting} onClick={handleExport}>
              <Download size={15} />
              {exporting ? "Exporting..." : "Export CSV"}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              icon={<FileStack size={18} />}
              label="Total Reports"
              value={stats?.total_reports ?? "—"}
            />
            <StatCard
              icon={<TrendingUp size={18} />}
              label="Resolution Rate"
              value={<span className="text-success">{resolutionRate}</span>}
              trend={stats ? `${resolved} resolved or closed` : undefined}
            />
            <StatCard
              icon={<ShieldAlert size={18} />}
              label="Critical"
              value={
                <span className="text-danger">{stats?.by_severity.critical ?? "—"}</span>
              }
            />
            <StatCard
              icon={<Timer size={18} />}
              label="Avg Resolution"
              value={
                stats?.avg_resolution_hours != null
                  ? formatDuration(stats.avg_resolution_hours)
                  : "—"
              }
              trend={isAdmin ? "Created to resolved" : "Admin-only metric"}
            />
          </div>

          <Panel
            title="Intake vs. Resolution"
            loading={trends === null}
            action={
              <Select
                value={trendDays}
                onChange={(e) => setTrendDays(Number(e.target.value))}
                className="max-w-40"
              >
                {TREND_RANGES.map((days) => (
                  <option key={days} value={days}>
                    Last {days} days
                  </option>
                ))}
              </Select>
            }
          >
            <TrendChart data={trends ?? []} />
          </Panel>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="Reports by Status" loading={stats === null}>
              <SimpleBarChart data={statusData} />
            </Panel>
            <Panel title="Reports by Severity" loading={stats === null}>
              <SimpleDonutChart data={severityData} />
            </Panel>
            <Panel title="Reports by Category" loading={stats === null}>
              <SimpleBarChart data={categoryData} />
            </Panel>
            <Panel title="Top Vulnerability Types" loading={stats === null}>
              {typeData.length > 0 ? (
                <SimpleBarChart data={typeData} />
              ) : (
                <p className="py-8 text-center text-sm text-muted">No reports yet.</p>
              )}
            </Panel>
          </div>

          {isAdmin && (
            <Panel title="Developer Workload" loading={workload === null}>
              <WorkloadTable rows={workload ?? []} />
            </Panel>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
