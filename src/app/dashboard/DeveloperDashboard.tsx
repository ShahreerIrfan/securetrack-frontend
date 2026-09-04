"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ClipboardList, Wrench } from "lucide-react";
import { StatCardGrid } from "@/components/dashboard/StatCardGrid";
import { RecentReportsList } from "@/components/dashboard/RecentReportsList";
import { ReportTable } from "@/components/reports/ReportTable";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import type { DashboardStats, Report } from "@/types/report";

export function DeveloperDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<Report[] | null>(null);
  const [assigned, setAssigned] = useState<Report[] | null>(null);

  useEffect(() => {
    api.get<DashboardStats>("/dashboard/stats/").then((res) => setStats(res.data));
    api.get<Report[]>("/dashboard/recent/").then((res) => setRecent(res.data));
    // A developer's /api/reports/ is already scoped server-side to only
    // what's assigned to them - no extra query params needed.
    api.get<Report[]>("/reports/").then((res) => setAssigned(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">My Assigned Tasks</h1>

      {stats ? (
        <StatCardGrid
          stats={[
            {
              icon: <ClipboardList size={20} />,
              label: "Assigned to Me",
              value: stats.total_reports,
            },
            {
              icon: <Wrench size={20} />,
              label: "In Progress",
              value: stats.by_status.assigned,
            },
            {
              icon: <CheckCircle2 size={20} />,
              label: "Resolved This Month",
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
        <h2 className="mb-3 text-sm font-medium text-copy">Recent Activity</h2>
        {recent ? (
          <RecentReportsList reports={recent} />
        ) : (
          <Skeleton variant="table-row" rows={3} columns={1} />
        )}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-copy">All Assigned Reports</h2>
        {assigned ? (
          <ReportTable reports={assigned} compact />
        ) : (
          <Skeleton variant="table-row" rows={4} />
        )}
      </div>
    </div>
  );
}
