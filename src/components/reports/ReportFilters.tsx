"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { ReportStatus, Severity } from "@/types/report";
import { severityLabels, statusLabels } from "./labels";

export interface ReportFiltersState {
  search: string;
  severity: Severity | "";
  status: ReportStatus | "";
}

export interface ReportFiltersProps {
  value: ReportFiltersState;
  onChange: (value: ReportFiltersState) => void;
}

const severityOptions = Object.entries(severityLabels) as [Severity, string][];
const statusOptions = Object.entries(statusLabels) as [ReportStatus, string][];

export function ReportFilters({ value, onChange }: ReportFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Input
        placeholder="Search reports..."
        value={value.search}
        onChange={(e) => onChange({ ...value, search: e.target.value })}
        className="sm:max-w-xs"
      />
      <Select
        value={value.severity}
        onChange={(e) => onChange({ ...value, severity: e.target.value as Severity | "" })}
        className="sm:max-w-40"
      >
        <option value="">All severities</option>
        {severityOptions.map(([val, label]) => (
          <option key={val} value={val}>
            {label}
          </option>
        ))}
      </Select>
      <Select
        value={value.status}
        onChange={(e) => onChange({ ...value, status: e.target.value as ReportStatus | "" })}
        className="sm:max-w-40"
      >
        <option value="">All statuses</option>
        {statusOptions.map(([val, label]) => (
          <option key={val} value={val}>
            {label}
          </option>
        ))}
      </Select>
    </div>
  );
}
