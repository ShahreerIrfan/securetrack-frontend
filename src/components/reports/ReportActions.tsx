"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/ToastProvider";
import { api } from "@/lib/api";
import { extractErrorMessage } from "@/lib/errors";
import type { NestedUser, Report, ReportStatus } from "@/types/report";
import type { UserRole } from "@/store/authStore";
import { statusLabels } from "./labels";

export interface ReportActionsProps {
  report: Report;
  currentUserId: number;
  role: UserRole;
  onUpdated: (report: Report) => void;
  /** Smaller controls for embedding in a table row (e.g. dashboard
   * queues), instead of the full-size detail-page layout. */
  compact?: boolean;
}

const statusOptions = Object.entries(statusLabels) as [ReportStatus, string][];

export function ReportActions({
  report,
  currentUserId,
  role,
  onUpdated,
  compact = false,
}: ReportActionsProps) {
  const router = useRouter();
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [developers, setDevelopers] = useState<NestedUser[]>([]);
  const controlClass = compact ? "px-2.5 py-1 text-xs" : undefined;
  const selectClass = compact ? "sm:max-w-36 px-2.5 py-1 text-xs" : undefined;

  useEffect(() => {
    if (role !== "admin") return;
    api
      .get<NestedUser[]>("/auth/users/", { params: { role: "developer" } })
      .then((res) => setDevelopers(res.data))
      .catch(() => setDevelopers([]));
  }, [role]);

  const patchStatus = async (payload: { status: ReportStatus; assigned_to?: number }) => {
    setError(null);
    setBusy(true);
    try {
      const { data } = await api.patch<Report>(`/reports/${report.id}/status/`, payload);
      onUpdated(data);
      toast.success(`Report status updated to "${statusLabels[data.status]}"`);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this report? This cannot be undone.")) return;
    setError(null);
    setBusy(true);
    try {
      await api.delete(`/reports/${report.id}/`);
      toast.success("Report deleted");
      router.push("/dashboard/reports");
    } catch (err) {
      setError(extractErrorMessage(err));
      setBusy(false);
    }
  };

  const isCreator = report.created_by.id === currentUserId;
  const isAssignedToMe = report.assigned_to?.id === currentUserId;

  return (
    <div className={compact ? "space-y-1.5" : "space-y-3"}>
      {role === "analyst" && (
        <div className="flex flex-wrap gap-2">
          <Button
            className={controlClass}
            disabled={busy}
            onClick={() => patchStatus({ status: "in_review" })}
          >
            Set In Review
          </Button>
          <Button
            variant="outline"
            className={controlClass}
            disabled={busy}
            onClick={() => patchStatus({ status: "verified" })}
          >
            Set Verified
          </Button>
        </div>
      )}

      {role === "admin" && (
        <div className="flex flex-wrap gap-3">
          <Select
            disabled={busy}
            value={report.status}
            onChange={(e) => {
              const status = e.target.value as ReportStatus;
              if (status !== "assigned") patchStatus({ status });
            }}
            className={selectClass ?? "sm:max-w-44"}
          >
            {statusOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>

          <Select
            disabled={busy}
            value=""
            onChange={(e) => {
              const id = Number(e.target.value);
              if (id) patchStatus({ status: "assigned", assigned_to: id });
            }}
            className={selectClass ?? "sm:max-w-56"}
          >
            <option value="">Assign to developer...</option>
            {developers.map((dev) => (
              <option key={dev.id} value={dev.id}>
                {dev.username}
              </option>
            ))}
          </Select>
        </div>
      )}

      {role === "developer" && isAssignedToMe && (
        <Button className={controlClass} disabled={busy} onClick={() => patchStatus({ status: "resolved" })}>
          Mark Resolved
        </Button>
      )}

      {role === "user" && isCreator && report.status === "new" && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className={controlClass}
            onClick={() => router.push(`/dashboard/reports/${report.id}/edit`)}
          >
            Edit
          </Button>
          <Button variant="danger" className={controlClass} disabled={busy} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
