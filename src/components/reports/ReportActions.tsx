"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/ToastProvider";
import { api } from "@/lib/api";
import { extractErrorMessage } from "@/lib/errors";
import { formatUserName } from "@/lib/format";
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

  // The developer list arrives async, and an assignee could also have
  // since changed role - either way the <select> would fall back to
  // showing the placeholder because its value matched no option. Fold
  // the current assignee in so the control always reflects reality.
  const assigneeOptions =
    report.assigned_to && !developers.some((d) => d.id === report.assigned_to?.id)
      ? [report.assigned_to, ...developers]
      : developers;

  const isCreator = report.created_by.id === currentUserId;
  const isAssignedToMe = report.assigned_to?.id === currentUserId;
  // Mirrors the backend's CanEditReport rule exactly: the creator may
  // edit/delete while status is still "new"; admins may always edit
  // (though delete stays governed by the separate, stricter
  // IsOwnerOrAdmin + status=new rule enforced server-side on destroy).
  const canEdit = role === "admin" || (isCreator && report.status === "new");
  const canDelete = role === "admin" || (isCreator && report.status === "new");

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
            // Reflect who the report is actually assigned to rather than
            // resetting to the placeholder after every assignment - the
            // control should read as current state, not a blank action.
            value={report.assigned_to?.id ?? ""}
            onChange={(e) => {
              const id = Number(e.target.value);
              if (id && id !== report.assigned_to?.id) {
                patchStatus({ status: "assigned", assigned_to: id });
              }
            }}
            className={selectClass ?? "sm:max-w-56"}
          >
            <option value="">Assign to developer...</option>
            {assigneeOptions.map((dev) => (
              <option key={dev.id} value={dev.id}>
                {formatUserName(dev)}
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

      {(canEdit || canDelete) && (
        <div className="flex flex-wrap gap-2">
          {canEdit && (
            <Button
              variant="outline"
              className={controlClass}
              onClick={() => router.push(`/dashboard/reports/${report.id}/edit`)}
            >
              Edit
            </Button>
          )}
          {canDelete && (
            <Button
              variant="danger"
              className={controlClass}
              disabled={busy}
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
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
