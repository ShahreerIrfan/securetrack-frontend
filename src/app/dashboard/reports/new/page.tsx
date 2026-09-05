"use client";

import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  ReportForm,
  ReportFormValues,
  reportFormValuesToFormData,
} from "@/components/reports/ReportForm";
import { useToast } from "@/components/ui/ToastProvider";
import { api } from "@/lib/api";
import { extractErrorMessage } from "@/lib/errors";
import { useAuthStore } from "@/store/authStore";

export default function NewReportPage() {
  const router = useRouter();
  const toast = useToast();
  const user = useAuthStore((s) => s.user);

  const handleSubmit = async (values: ReportFormValues) => {
    try {
      // Multipart is only needed when there's actually a file to send -
      // plain JSON is simpler and works fine otherwise.
      const payload = values.attachment
        ? reportFormValuesToFormData(values)
        : { ...values, due_date: values.due_date || null };
      const { data } = await api.post("/reports/", payload);
      toast.success("Report created");
      router.push(`/dashboard/reports/${data.id}`);
    } catch (err) {
      throw new Error(extractErrorMessage(err));
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout title="New Report">
        <ReportForm
          onSubmit={handleSubmit}
          submitLabel="Create Report"
          allowReportingFor={user?.role === "admin"}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
