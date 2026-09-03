"use client";

import { use, useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SeverityBadge } from "@/components/reports/SeverityBadge";
import { StatusBadge } from "@/components/reports/StatusBadge";
import { ActivityTimeline } from "@/components/reports/ActivityTimeline";
import { CommentThread } from "@/components/reports/CommentThread";
import { ReportActions } from "@/components/reports/ReportActions";
import { Tabs } from "@/components/ui/Tabs";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import { formatUserName } from "@/lib/format";
import { useAuthStore } from "@/store/authStore";
import type { ActivityLogEntry, Comment, Report } from "@/types/report";

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
          <Skeleton variant="card" className="max-w-3xl" />
        ) : (
          <div className="max-w-3xl space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <SeverityBadge severity={report.severity} />
                <StatusBadge status={report.status} />
              </div>
              <h1 className="mt-3 text-2xl font-bold text-foreground">{report.title}</h1>
              <p className="mt-2 text-sm text-copy">{report.description}</p>
              <p className="mt-3 text-xs text-muted">
                Reported by {formatUserName(report.created_by)}
                {report.assigned_to && ` · Assigned to ${formatUserName(report.assigned_to)}`}
              </p>
            </div>

            <ReportActions
              report={report}
              currentUserId={user.id}
              role={user.role}
              onUpdated={handleReportUpdated}
            />

            <Tabs
              items={[
                {
                  key: "activity",
                  label: "Activity",
                  content: <ActivityTimeline entries={activity} />,
                },
                {
                  key: "comments",
                  label: "Comments",
                  content: (
                    <CommentThread
                      reportId={report.id}
                      comments={comments}
                      onCommentAdded={(comment) => setComments((prev) => [...prev, comment])}
                    />
                  ),
                },
              ]}
            />
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
