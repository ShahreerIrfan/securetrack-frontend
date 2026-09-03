"use client";

import { useEffect, useState } from "react";
import { FileSearch } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReportFilters, ReportFiltersState } from "@/components/reports/ReportFilters";
import { ReportTable } from "@/components/reports/ReportTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import type { Report } from "@/types/report";

export default function ReportsPage() {
  const [filters, setFilters] = useState<ReportFiltersState>({
    search: "",
    severity: "",
    status: "",
  });
  const [reports, setReports] = useState<Report[] | null>(null);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.search) params.search = filters.search;
    if (filters.severity) params.severity = filters.severity;
    if (filters.status) params.status = filters.status;

    let cancelled = false;
    api.get<Report[]>("/reports/", { params }).then((res) => {
      if (!cancelled) setReports(res.data);
    });
    return () => {
      cancelled = true;
    };
  }, [filters]);

  return (
    <ProtectedRoute>
      <DashboardLayout title="Reports">
        <div className="space-y-6">
          <ReportFilters value={filters} onChange={setFilters} />

          {reports === null ? (
            <Skeleton variant="table-row" rows={5} columns={4} />
          ) : (
            <ReportTable
              reports={reports}
              emptyState={
                <EmptyState
                  icon={<FileSearch size={32} />}
                  title="No reports found"
                  description="Try adjusting your search or filters."
                />
              }
            />
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
