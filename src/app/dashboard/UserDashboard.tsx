"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, FileText } from "lucide-react";
import { StatCardGrid } from "@/components/dashboard/StatCardGrid";
import { RecentReportsList } from "@/components/dashboard/RecentReportsList";
import { buttonClassName } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import type { Report, ReportStatus } from "@/types/report";

interface DashboardStats {
  total_reports: number;
  by_status: Record<ReportStatus, number>;
}

export function UserDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<Report[] | null>(null);

  useEffect(() => {
    api.get<DashboardStats>("/dashboard/stats/").then((res) => setStats(res.data));
    api.get<Report[]>("/dashboard/recent/").then((res) => setRecent(res.data));
  }, []);

  const pending = stats
    ? stats.by_status.new +
      stats.by_status.in_review +
      stats.by_status.verified +
      stats.by_status.assigned
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Welcome back</h1>
        <Link href="/dashboard/reports/new" className={buttonClassName("primary")}>
          New Report
        </Link>
      </div>

      {stats ? (
        <StatCardGrid
          stats={[
            { icon: <FileText size={20} />, label: "My Total Reports", value: stats.total_reports },
            { icon: <Clock size={20} />, label: "Pending", value: pending },
            {
              icon: <CheckCircle2 size={20} />,
              label: "Resolved",
              value: stats.by_status.resolved,
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

      <div>
        <h2 className="mb-3 text-sm font-medium text-copy">Recent Reports</h2>
        {recent ? (
          <RecentReportsList reports={recent} />
        ) : (
          <Skeleton variant="table-row" rows={3} columns={1} />
        )}
      </div>
    </div>
  );
}
