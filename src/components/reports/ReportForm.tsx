"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { Category, Priority, Severity } from "@/types/report";
import { categoryLabels, priorityLabels, severityLabels } from "./labels";

export interface ReportFormValues {
  title: string;
  description: string;
  severity: Severity;
  priority: Priority;
  category: Category;
  /** Empty string means "no due date" - converted to null on submit. */
  due_date: string;
}

export interface ReportFormProps {
  initialValues?: Partial<ReportFormValues>;
  onSubmit: (values: ReportFormValues) => Promise<void>;
  submitLabel?: string;
}

const severityOptions = Object.entries(severityLabels) as [Severity, string][];
const priorityOptions = Object.entries(priorityLabels) as [Priority, string][];
const categoryOptions = Object.entries(categoryLabels) as [Category, string][];

export function ReportForm({ initialValues, onSubmit, submitLabel = "Submit" }: ReportFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [severity, setSeverity] = useState<Severity>(initialValues?.severity ?? "medium");
  const [priority, setPriority] = useState<Priority>(initialValues?.priority ?? "medium");
  const [category, setCategory] = useState<Category>(initialValues?.category ?? "other");
  const [dueDate, setDueDate] = useState(initialValues?.due_date ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSubmit({ title, description, severity, priority, category, due_date: dueDate });
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

      <div className="grid gap-4 sm:grid-cols-2">
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

        <div>
          <label htmlFor="report-priority" className="mb-1.5 block text-sm text-copy">
            Priority
          </label>
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

        <div>
          <label htmlFor="report-category" className="mb-1.5 block text-sm text-copy">
            Category
          </label>
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
          <label htmlFor="report-due-date" className="mb-1.5 block text-sm text-copy">
            Due Date <span className="text-muted">(optional)</span>
          </label>
          <Input
            id="report-due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
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
