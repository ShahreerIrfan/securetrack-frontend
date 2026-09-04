"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileSearch, LayoutGrid, Plus, Table2 } from "lucide-react";
import clsx from "clsx";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReportFilters, ReportFiltersState } from "@/components/reports/ReportFilters";
import { ReportTable } from "@/components/reports/ReportTable";
import { ReportCard } from "@/components/reports/ReportCard";
import { Button, buttonClassName } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastProvider";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { api } from "@/lib/api";
import { extractErrorMessage } from "@/lib/errors";
import { useAuthStore } from "@/store/authStore";
import type { Report } from "@/types/report";

type ViewMode = "table" | "grid";

function canModify(report: Report, userId: number, role: string): boolean {
  if (role === "admin") return true;
  return report.created_by.id === userId && report.status === "new";
}

export default function ReportsPage() {
  const toast = useToast();
  const user = useAuthStore((s) => s.user);
  const [filters, setFilters] = useState<ReportFiltersState>({
    search: "",
    severity: "",
    status: "",
    priority: "",
  });
  const debouncedSearch = useDebouncedValue(filters.search, 300);
  const [reports, setReports] = useState<Report[] | null>(null);
  const [view, setView] = useState<ViewMode>("table");

  const fetchReports = () => {
    const params: Record<string, string> = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (filters.severity) params.severity = filters.severity;
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;

    let cancelled = false;
    api.get<Report[]>("/reports/", { params }).then((res) => {
      if (!cancelled) setReports(res.data);
    });
    return () => {
      cancelled = true;
    };
  };

  useEffect(fetchReports, [debouncedSearch, filters.severity, filters.status, filters.priority]);

  const handleDelete = async (report: Report) => {
    if (!confirm(`Delete report "${report.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/reports/${report.id}/`);
      toast.success("Report deleted");
      fetchReports();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout title="Reports">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <ReportFilters value={filters} onChange={setFilters} />
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-border bg-surface p-0.5">
                <button
                  type="button"
                  aria-label="Table view"
                  aria-pressed={view === "table"}
                  onClick={() => setView("table")}
                  className={clsx(
                    "rounded-md p-1.5 transition-colors",
                    view === "table"
                      ? "bg-surface-raised text-accent"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  <Table2 size={16} />
                </button>
                <button
                  type="button"
                  aria-label="Grid view"
                  aria-pressed={view === "grid"}
                  onClick={() => setView("grid")}
                  className={clsx(
                    "rounded-md p-1.5 transition-colors",
                    view === "grid"
                      ? "bg-surface-raised text-accent"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  <LayoutGrid size={16} />
                </button>
              </div>
              <Link href="/dashboard/reports/new" className={buttonClassName()}>
                <Plus size={16} />
                New Report
              </Link>
            </div>
          </div>

          {reports !== null && reports.length > 0 && (
            <p className="-mb-2 text-xs text-muted">
              {reports.length} report{reports.length === 1 ? "" : "s"}
            </p>
          )}

          {reports === null ? (
            <Skeleton variant="table-row" rows={5} columns={4} />
          ) : reports.length === 0 ? (
            <EmptyState
              icon={<FileSearch size={32} />}
              title="No reports found"
              description="Try adjusting your search or filters."
            />
          ) : view === "table" ? (
            <ReportTable
              reports={reports}
              actions={(report) =>
                user &&
                canModify(report, user.id, user.role) && (
                  <Button
                    variant="danger"
                    className="px-2.5 py-1 text-xs"
                    onClick={() => handleDelete(report)}
                  >
                    Delete
                  </Button>
                )
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
