"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  ReportForm,
  ReportFormValues,
  reportFormValuesToFormData,
} from "@/components/reports/ReportForm";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastProvider";
import { api } from "@/lib/api";
import { extractErrorMessage } from "@/lib/errors";
import { useAuthStore } from "@/store/authStore";
import type { Report } from "@/types/report";

/** Mirrors the backend's CanEditReport rule: the creator may edit while
 * status is still "new"; admins may always edit. The server enforces
 * this regardless - this is just so a user who can't edit never sees
 * the form at all instead of submitting into a 403. */
function canEdit(report: Report, userId: number, role: string): boolean {
  if (role === "admin") return true;
  return report.created_by.id === userId && report.status === "new";
}

export default function EditReportPage(props: PageProps<"/dashboard/reports/[id]/edit">) {
  const { id } = use(props.params);
  const router = useRouter();
  const toast = useToast();
  const user = useAuthStore((s) => s.user);

  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    api.get<Report>(`/reports/${id}/`).then((res) => setReport(res.data));
  }, [id]);

  useEffect(() => {
    if (report && user && !canEdit(report, user.id, user.role)) {
      router.replace(`/dashboard/reports/${id}`);
    }
  }, [report, user, id, router]);

  const handleSubmit = async (values: ReportFormValues) => {
    try {
      // Multipart is only needed when the attachment is actually
      // changing - plain JSON still handles everything else, including
      // clearing due_date via null, which multipart can't represent.
      const payload =
        values.attachment || values.remove_attachment
          ? reportFormValuesToFormData(values)
          : { ...values, due_date: values.due_date || null };
      await api.patch(`/reports/${id}/`, payload);
      toast.success("Report updated");
      router.push(`/dashboard/reports/${id}`);
    } catch (err) {
      throw new Error(extractErrorMessage(err));
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout title="Edit Report">
        {!report || !user || !canEdit(report, user.id, user.role) ? (
          <Skeleton variant="card" className="max-w-xl" />
        ) : (
          <ReportForm
            initialValues={{
              title: report.title,
              description: report.description,
              severity: report.severity,
              priority: report.priority,
              category: report.category,
              vulnerability_type: report.vulnerability_type,
              due_date: report.due_date ?? "",
            }}
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
            existingAttachmentName={report.attachment_name}
          />
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
