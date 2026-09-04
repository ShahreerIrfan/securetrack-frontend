"use client";

import { useEffect, useState } from "react";
import { Clock, Eye, FileSearch } from "lucide-react";
import { StatCardGrid } from "@/components/dashboard/StatCardGrid";
import { ReportTable } from "@/components/reports/ReportTable";
import { ReportActions } from "@/components/reports/ReportActions";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import type { DashboardStats, Report } from "@/types/report";

export function AnalystDashboard() {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [queue, setQueue] = useState<Report[] | null>(null);

  const fetchQueue = () => {
    api.get<Report[]>("/reports/", { params: { status: "new" } }).then((res) => {
      const oldestFirst = [...res.data].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
      setQueue(oldestFirst);
    });
  };

  useEffect(() => {
    api.get<DashboardStats>("/dashboard/stats/").then((res) => setStats(res.data));
    fetchQueue();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Triage Queue</h1>

      {stats ? (
        <StatCardGrid
          stats={[
            {
              icon: <FileSearch size={20} />,
              label: "Awaiting Review",
              value: stats.by_status.new,
            },
            { icon: <Eye size={20} />, label: "In Review", value: stats.by_status.in_review },
            { icon: <Clock size={20} />, label: "Verified", value: stats.by_status.verified },
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
        <h2 className="mb-3 text-sm font-medium text-copy">New Reports, Oldest First</h2>
        {queue && user ? (
          <ReportTable
            reports={queue}
            compact
            actions={(report) => (
              <ReportActions
                report={report}
                currentUserId={user.id}
                role="analyst"
                compact
                onUpdated={fetchQueue}
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
