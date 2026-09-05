"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { Category, Priority, ReportStatus, Severity, VulnerabilityType } from "@/types/report";
import {
  categoryLabels,
  priorityLabels,
  severityLabels,
  statusLabels,
  vulnerabilityTypeLabels,
} from "./labels";

export interface ReportFiltersState {
  search: string;
  severity: Severity | "";
  status: ReportStatus | "";
  priority: Priority | "";
  category: Category | "";
  vulnerabilityType: VulnerabilityType | "";
}

export interface ReportFiltersProps {
  value: ReportFiltersState;
  onChange: (value: ReportFiltersState) => void;
}

const severityOptions = Object.entries(severityLabels) as [Severity, string][];
const statusOptions = Object.entries(statusLabels) as [ReportStatus, string][];
const priorityOptions = Object.entries(priorityLabels) as [Priority, string][];
const categoryOptions = Object.entries(categoryLabels) as [Category, string][];
const vulnerabilityTypeOptions = Object.entries(vulnerabilityTypeLabels) as [
  VulnerabilityType,
  string,
][];

export function ReportFilters({ value, onChange }: ReportFiltersProps) {
  return (
    <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:flex-wrap">
      <div className="relative lg:min-w-64 lg:flex-1">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <Input
          placeholder="Search by title or #ID..."
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
          className="pl-9"
        />
      </div>
      <Select
        value={value.status}
        onChange={(e) => onChange({ ...value, status: e.target.value as ReportStatus | "" })}
        className="lg:max-w-40"
      >
        <option value="">All Status</option>
        {statusOptions.map(([val, label]) => (
          <option key={val} value={val}>
            {label}
          </option>
        ))}
      </Select>
      <Select
        value={value.severity}
        onChange={(e) => onChange({ ...value, severity: e.target.value as Severity | "" })}
        className="lg:max-w-40"
      >
        <option value="">All Severities</option>
        {severityOptions.map(([val, label]) => (
          <option key={val} value={val}>
            {label}
          </option>
        ))}
      </Select>
      <Select
        value={value.priority}
        onChange={(e) => onChange({ ...value, priority: e.target.value as Priority | "" })}
        className="lg:max-w-40"
      >
        <option value="">All Priorities</option>
        {priorityOptions.map(([val, label]) => (
          <option key={val} value={val}>
            {label}
          </option>
        ))}
      </Select>
      <Select
        value={value.category}
        onChange={(e) => onChange({ ...value, category: e.target.value as Category | "" })}
        className="lg:max-w-44"
      >
        <option value="">All Categories</option>
        {categoryOptions.map(([val, label]) => (
          <option key={val} value={val}>
            {label}
          </option>
        ))}
      </Select>
      <Select
        value={value.vulnerabilityType}
        onChange={(e) =>
          onChange({ ...value, vulnerabilityType: e.target.value as VulnerabilityType | "" })
        }
        className="lg:max-w-44"
      >
        <option value="">All Types</option>
        {vulnerabilityTypeOptions.map(([val, label]) => (
          <option key={val} value={val}>
            {label}
          </option>
        ))}
      </Select>
    </div>
  );
}
