"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TrendPoint } from "@/types/report";

const tooltipStyle = {
  background: "#111B34",
  border: "1px solid #1E2A45",
  borderRadius: 8,
  color: "#FFFFFF",
  fontSize: 13,
};

function formatDay(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

/** Intake vs. throughput over time: violet-to-blue = reports coming in,
 * cyan = reports being closed out. The gap between the two bands is the
 * backlog growing or shrinking. */
export function TrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="trend-created-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="trend-created" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="trend-resolved" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#1E2A45" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatDay}
          stroke="#64748B"
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: "#1E2A45" }}
          minTickGap={16}
        />
        <YAxis
          stroke="#64748B"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          width={28}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelFormatter={(label) => formatDay(String(label))}
          cursor={{ stroke: "#1E2A45" }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: "#64748B" }} iconType="plainline" />
        <Area
          type="monotone"
          dataKey="created"
          name="Created"
          stroke="url(#trend-created-stroke)"
          strokeWidth={2.5}
          fill="url(#trend-created)"
        />
        <Area
          type="monotone"
          dataKey="resolved"
          name="Resolved"
          stroke="#22D3EE"
          strokeWidth={2.5}
          fill="url(#trend-resolved)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
