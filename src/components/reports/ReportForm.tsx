"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  FileText,
  Flag,
  FolderTree,
  Paperclip,
  ShieldAlert,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { formatUserName } from "@/lib/format";
import type { Category, NestedUser, Priority, Severity, VulnerabilityType } from "@/types/report";
import {
  categoryLabels,
  priorityLabels,
  severityLabels,
  vulnerabilityTypeLabels,
} from "./labels";

export interface ReportFormValues {
  title: string;
  description: string;
  severity: Severity;
  priority: Priority;
  category: Category;
  vulnerability_type: VulnerabilityType;
  /** Empty string means "no due date" - converted to null on submit. */
  due_date: string;
  /** Admin-only: who this report is being filed on behalf of. Omitted
   * entirely (not just empty) when left as "myself", so the backend's
   * default (the requesting admin) applies. */
  created_by?: number;
  /** A newly-chosen file to upload, replacing any existing attachment. */
  attachment?: File | null;
  /** Clears the existing attachment without uploading a new one - the
   * only way to do that, since multipart form data can't represent
   * "null" for a file field. */
  remove_attachment?: boolean;
}

export interface ReportFormProps {
  initialValues?: Partial<ReportFormValues>;
  onSubmit: (values: ReportFormValues) => Promise<void>;
  submitLabel?: string;
  /** Shows a "Reporting For" select so an admin can file this report on
   * behalf of another user instead of themselves. Only meaningful on
   * create - the backend doesn't support reassigning created_by later. */
  allowReportingFor?: boolean;
  /** Filename of the attachment already on this report (edit only). */
  existingAttachmentName?: string | null;
}

/** Only needed when a file is actually attached or being removed - a
 * plain JSON PATCH/POST still works (and still supports clearing
 * due_date via null) for every other edit, so callers should prefer
 * that path and fall back to this one only when values.attachment or
 * values.remove_attachment is set. */
export function reportFormValuesToFormData(values: ReportFormValues): FormData {
  const formData = new FormData();
  formData.append("title", values.title);
  formData.append("description", values.description);
  formData.append("severity", values.severity);
  formData.append("priority", values.priority);
  formData.append("category", values.category);
  formData.append("vulnerability_type", values.vulnerability_type);
  if (values.due_date) formData.append("due_date", values.due_date);
  if (values.created_by) formData.append("created_by", String(values.created_by));
  if (values.attachment) formData.append("attachment", values.attachment);
  if (values.remove_attachment) formData.append("remove_attachment", "true");
  return formData;
}

const severityOptions = Object.entries(severityLabels) as [Severity, string][];
const priorityOptions = Object.entries(priorityLabels) as [Priority, string][];
const categoryOptions = Object.entries(categoryLabels) as [Category, string][];
const vulnerabilityTypeOptions = Object.entries(vulnerabilityTypeLabels) as [
  VulnerabilityType,
  string,
][];

function FieldLabel({
  htmlFor,
  icon,
  children,
  optional,
}: {
  htmlFor: string;
  icon: ReactNode;
  children: ReactNode;
  optional?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-copy"
    >
      <span className="text-accent">{icon}</span>
      {children}
      {optional && <span className="font-normal text-muted">(optional)</span>}
    </label>
  );
}

export function ReportForm({
  initialValues,
  onSubmit,
  submitLabel = "Submit",
  allowReportingFor = false,
  existingAttachmentName = null,
}: ReportFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [severity, setSeverity] = useState<Severity>(initialValues?.severity ?? "medium");
  const [priority, setPriority] = useState<Priority>(initialValues?.priority ?? "medium");
  const [category, setCategory] = useState<Category>(initialValues?.category ?? "other");
  const [vulnerabilityType, setVulnerabilityType] = useState<VulnerabilityType>(
    initialValues?.vulnerability_type ?? "other",
  );
  const [dueDate, setDueDate] = useState(initialValues?.due_date ?? "");
  const [reportingFor, setReportingFor] = useState<string>("");
  const [users, setUsers] = useState<NestedUser[]>([]);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [removeAttachment, setRemoveAttachment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!allowReportingFor) return;
    api
      .get<NestedUser[]>("/auth/users/", { params: { role: "user" } })
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]));
  }, [allowReportingFor]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSubmit({
        title,
        description,
        severity,
        priority,
        category,
        vulnerability_type: vulnerabilityType,
        due_date: dueDate,
        ...(reportingFor ? { created_by: Number(reportingFor) } : {}),
        ...(attachmentFile ? { attachment: attachmentFile } : {}),
        ...(removeAttachment ? { remove_attachment: true } : {}),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl" noValidate>
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)]">
        <div className="relative overflow-hidden border-b border-border bg-accent-gradient-soft px-6 py-5">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-accent-gradient opacity-20 blur-2xl"
          />
          <div className="relative flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-gradient text-white shadow-[0_0_20px_-4px_var(--color-accent)]">
              <Sparkles size={18} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-foreground">Report Details</h2>
              <p className="text-xs text-muted">
                Describe the finding and classify it so it reaches the right team fast.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div>
            <FieldLabel htmlFor="report-title" icon={<FileText size={14} />}>
              Title
            </FieldLabel>
            <Input
              id="report-title"
              placeholder="e.g. Reflected XSS on search results page"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <FieldLabel htmlFor="report-description" icon={<FileText size={14} />}>
              Description
            </FieldLabel>
            <Textarea
              id="report-description"
              rows={5}
              placeholder="Steps to reproduce, affected endpoint, potential impact..."
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {allowReportingFor && (
            <div>
              <FieldLabel htmlFor="report-reporting-for" icon={<UserRound size={14} />} optional>
                Reporting For
              </FieldLabel>
              <Select
                id="report-reporting-for"
                value={reportingFor}
                onChange={(e) => setReportingFor(e.target.value)}
              >
                <option value="">Myself</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {formatUserName(u)} ({u.email})
                  </option>
                ))}
              </Select>
            </div>
          )}

          <div className="h-px bg-border/60" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="report-vulnerability-type" icon={<ShieldAlert size={14} />}>
                Vulnerability Type
              </FieldLabel>
              <Select
                id="report-vulnerability-type"
                value={vulnerabilityType}
                onChange={(e) => setVulnerabilityType(e.target.value as VulnerabilityType)}
              >
                {vulnerabilityTypeOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <FieldLabel htmlFor="report-category" icon={<FolderTree size={14} />}>
                Category
              </FieldLabel>
              <Select
                id="report-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
              >
                {categoryOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <FieldLabel htmlFor="report-severity" icon={<AlertTriangle size={14} />}>
                Severity
              </FieldLabel>
              <Select
                id="report-severity"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Severity)}
              >
                {severityOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <FieldLabel htmlFor="report-priority" icon={<Flag size={14} />}>
                Priority
              </FieldLabel>
              <Select
                id="report-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                {priorityOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="sm:col-span-2">
              <FieldLabel htmlFor="report-due-date" icon={<CalendarClock size={14} />} optional>
                Due Date
              </FieldLabel>
              <Input
                id="report-due-date"
                type="date"
                className="sm:max-w-52"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="h-px bg-border/60" />

          <div>
            <FieldLabel htmlFor="report-attachment" icon={<Paperclip size={14} />} optional>
              Attachment
            </FieldLabel>

            {existingAttachmentName && !attachmentFile && !removeAttachment && (
              <div className="mb-2 flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-raised/50 px-3 py-2 text-sm text-copy">
                <span className="inline-flex min-w-0 items-center gap-2 truncate">
                  <Paperclip size={14} className="shrink-0 text-muted" />
                  <span className="truncate">{existingAttachmentName}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setRemoveAttachment(true)}
                  className="shrink-0 text-xs font-medium text-danger hover:underline"
                >
                  Remove
                </button>
              </div>
            )}

            {removeAttachment && (
              <div className="mb-2 flex items-center justify-between gap-3 rounded-lg border border-dashed border-danger/40 bg-danger/5 px-3 py-2 text-sm text-danger">
                <span>Attachment will be removed on save</span>
                <button
                  type="button"
                  onClick={() => setRemoveAttachment(false)}
                  className="shrink-0 text-xs font-medium underline"
                >
                  Undo
                </button>
              </div>
            )}

            <input
              id="report-attachment"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.txt,.log,.csv,.zip,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setAttachmentFile(file);
                if (file) setRemoveAttachment(false);
              }}
              className="block w-full text-sm text-copy file:mr-3 file:rounded-lg file:border-0 file:bg-accent-gradient-soft file:px-3 file:py-2 file:text-sm file:font-medium file:text-accent file:transition-colors hover:file:brightness-110"
            />
            <p className="mt-1.5 text-xs text-muted">
              PDF, image, text, log, CSV, ZIP or DOCX - up to 10MB.
            </p>
          </div>

          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end border-t border-border/60 pt-5">
            <Button type="submit" disabled={loading} className="min-w-32">
              {loading ? "Saving..." : submitLabel}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
