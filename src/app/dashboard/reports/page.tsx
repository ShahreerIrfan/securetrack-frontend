"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Download,
  FileSearch,
  FileStack,
  LayoutGrid,
  Pencil,
  Plus,
  ShieldAlert,
  Table2,
  Trash2,
} from "lucide-react";
import clsx from "clsx";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReportFilters, ReportFiltersState } from "@/components/reports/ReportFilters";
import { ReportTable } from "@/components/reports/ReportTable";
import { ReportCard } from "@/components/reports/ReportCard";
import { Button, buttonClassName } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/ui/StatCard";
import { useToast } from "@/components/ui/ToastProvider";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { api } from "@/lib/api";
import { exportReportsCsv } from "@/lib/attachments";
import { extractErrorMessage } from "@/lib/errors";
import { useAuthStore } from "@/store/authStore";
import type { Report } from "@/types/report";

type ViewMode = "table" | "grid";

function canModify(report: Report, userId: number, role: string): boolean {
  if (role === "admin") return true;
  return report.created_by.id === userId && report.status === "new";
}

function isOpen(report: Report): boolean {
  return report.status !== "resolved" && report.status !== "closed";
}

export default function ReportsPage() {
  const toast = useToast();
  const user = useAuthStore((s) => s.user);
  const [filters, setFilters] = useState<ReportFiltersState>({
    search: "",
    severity: "",
    status: "",
    priority: "",
    category: "",
    vulnerabilityType: "",
  });
  const debouncedSearch = useDebouncedValue(filters.search, 300);
  const [reports, setReports] = useState<Report[] | null>(null);
  const [allReports, setAllReports] = useState<Report[] | null>(null);
  const [view, setView] = useState<ViewMode>("table");
  const [exporting, setExporting] = useState(false);

  // Shared by the table fetch and the CSV export, so an export always
  // contains exactly the rows the table is currently showing.
  const buildParams = (): Record<string, string> => {
    const params: Record<string, string> = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (filters.severity) params.severity = filters.severity;
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    if (filters.category) params.category = filters.category;
    if (filters.vulnerabilityType) params.vulnerability_type = filters.vulnerabilityType;
    return params;
  };

  const fetchReports = () => {
    let cancelled = false;
    api.get<Report[]>("/reports/", { params: buildParams() }).then((res) => {
      if (!cancelled) setReports(res.data);
    });
    return () => {
      cancelled = true;
    };
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportReportsCsv(buildParams());
      toast.success("Export downloaded");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setExporting(false);
    }
  };

  // Stat cards always reflect everything visible to this user, independent
  // of the filters/search applied to the table below.
  const fetchStats = () => {
    api.get<Report[]>("/reports/").then((res) => setAllReports(res.data));
  };

  useEffect(fetchReports, [
    debouncedSearch,
    filters.severity,
    filters.status,
    filters.priority,
    filters.category,
    filters.vulnerabilityType,
  ]);
  useEffect(fetchStats, []);

  const handleDelete = async (report: Report) => {
    if (!confirm(`Delete report "${report.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/reports/${report.id}/`);
      toast.success("Report deleted");
      fetchReports();
      fetchStats();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const total = allReports?.length ?? null;
  const resolved = allReports?.filter((r) => r.status === "resolved" || r.status === "closed").length ?? null;
  const open = allReports?.filter(isOpen).length ?? null;
  const critical = allReports?.filter((r) => r.severity === "critical" && isOpen(r)).length ?? null;

  // StatCard renders its value inside a <p> - an inline placeholder here
  // (not Skeleton's <div>) keeps the markup valid while stats load.
  const statSkeleton = <span className="inline-block h-6 w-8 animate-pulse rounded bg-surface-raised align-middle" />;

  return (
    <ProtectedRoute>
      <DashboardLayout title="Reports">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              icon={<FileStack size={18} />}
              label="Total"
              value={total ?? statSkeleton}
            />
            <StatCard
              icon={<CheckCircle2 size={18} />}
              label="Resolved"
              value={
                resolved === null ? (
                  statSkeleton
                ) : (
                  <span className="text-success">{resolved}</span>
                )
              }
            />
            <StatCard
              icon={<Clock size={18} />}
              label="Open"
              value={
                open === null ? (
                  statSkeleton
                ) : (
                  <span className="text-amber">{open}</span>
                )
              }
            />
            <StatCard
              icon={<ShieldAlert size={18} />}
              label="Critical (open)"
              value={
                critical === null ? (
                  statSkeleton
                ) : (
                  <span className="text-danger">{critical}</span>
                )
              }
            />
          </div>

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
              <Button
                variant="outline"
                disabled={exporting || !reports?.length}
                onClick={handleExport}
                title="Download the current filtered list as CSV"
              >
                <Download size={15} />
                {exporting ? "..." : "Export"}
              </Button>
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
                  <>
                    <Link
                      href={`/dashboard/reports/${report.id}/edit`}
                      aria-label={`Edit report: ${report.title}`}
                      title="Edit report"
                      className="inline-flex items-center justify-center rounded-lg border border-border p-1 text-muted transition-colors hover:border-accent hover:text-accent"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      type="button"
                      aria-label={`Delete report: ${report.title}`}
                      title="Delete report"
                      onClick={() => handleDelete(report)}
                      className="inline-flex items-center justify-center rounded-lg border border-border p-1 text-muted transition-colors hover:border-danger hover:text-danger"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
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
