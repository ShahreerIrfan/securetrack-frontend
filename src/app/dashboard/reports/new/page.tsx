"use client";

import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReportForm, ReportFormValues } from "@/components/reports/ReportForm";
import { api } from "@/lib/api";
import { extractErrorMessage } from "@/lib/errors";

export default function NewReportPage() {
  const router = useRouter();

  const handleSubmit = async (values: ReportFormValues) => {
    try {
      const { data } = await api.post("/reports/", values);
      router.push(`/dashboard/reports/${data.id}`);
    } catch (err) {
      throw new Error(extractErrorMessage(err));
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout title="New Report">
        <ReportForm onSubmit={handleSubmit} submitLabel="Create Report" />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
