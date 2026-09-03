"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { Severity } from "@/types/report";
import { severityLabels } from "./labels";

export interface ReportFormValues {
  title: string;
  description: string;
  severity: Severity;
}

export interface ReportFormProps {
  initialValues?: Partial<ReportFormValues>;
  onSubmit: (values: ReportFormValues) => Promise<void>;
  submitLabel?: string;
}

const severityOptions = Object.entries(severityLabels) as [Severity, string][];

export function ReportForm({ initialValues, onSubmit, submitLabel = "Submit" }: ReportFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [severity, setSeverity] = useState<Severity>(initialValues?.severity ?? "medium");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSubmit({ title, description, severity });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4" noValidate>
      <div>
        <label htmlFor="report-title" className="mb-1.5 block text-sm text-copy">
          Title
        </label>
        <Input
          id="report-title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="report-description" className="mb-1.5 block text-sm text-copy">
          Description
        </label>
        <Textarea
          id="report-description"
          rows={5}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="report-severity" className="mb-1.5 block text-sm text-copy">
          Severity
        </label>
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

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
