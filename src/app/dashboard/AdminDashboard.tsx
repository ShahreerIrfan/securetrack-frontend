"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, ShieldAlert, UserCog, Users } from "lucide-react";
import { StatCardGrid } from "@/components/dashboard/StatCardGrid";
import { SimpleBarChart, type ChartDatum } from "@/components/dashboard/SimpleBarChart";
import { SimpleDonutChart } from "@/components/dashboard/SimpleDonutChart";
import { ReportTable } from "@/components/reports/ReportTable";
import { ReportActions } from "@/components/reports/ReportActions";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import type { DashboardStats, Report } from "@/types/report";
import { severityColors, severityLabels, statusColors, statusLabels } from "@/components/reports/labels";

export function AdminDashboard() {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [unassignedVerified, setUnassignedVerified] = useState<Report[] | null>(null);

  const fetchUnassignedVerified = () => {
    api.get<Report[]>("/reports/", { params: { status: "verified" } }).then((res) => {
      setUnassignedVerified(res.data.filter((r) => r.assigned_to === null));
    });
  };

  useEffect(() => {
    api.get<DashboardStats>("/dashboard/stats/").then((res) => setStats(res.data));
    fetchUnassignedVerified();
  }, []);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
            { icon: <FileText size={20} />, label: "Total Reports", value: stats.total_reports },
            {
              icon: <ShieldAlert size={20} />,
              label: "Critical Severity",
              value: stats.by_severity.critical,
            },
            {
              icon: <Users size={20} />,
              label: "Total Users",
              value: stats.users_by_role
                ? Object.values(stats.users_by_role).reduce((a, b) => a + b, 0)
                : 0,
            },
          ]}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="mb-3 text-sm font-medium text-copy">Reports by Status</p>
          {stats ? <SimpleBarChart data={statusChartData} /> : <Skeleton variant="card" />}
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="mb-3 text-sm font-medium text-copy">Reports by Severity</p>
          {stats ? <SimpleDonutChart data={severityChartData} /> : <Skeleton variant="card" />}
        </div>
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
                onUpdated={fetchUnassignedVerified}
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
