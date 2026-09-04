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
  background: "#161C28",
  border: "1px solid #232B39",
  borderRadius: 8,
  color: "#E6EDF3",
  fontSize: 13,
};

function formatDay(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

/** Intake vs. throughput over time: green = reports coming in, blue =
 * reports being closed out. The gap between the two bands is the backlog
 * growing or shrinking. */
export function TrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="trend-created" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00FF9C" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#00FF9C" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="trend-resolved" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00C2FF" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#00C2FF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#232B39" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatDay}
          stroke="#8B98A5"
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: "#232B39" }}
          minTickGap={16}
        />
        <YAxis
          stroke="#8B98A5"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          width={28}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelFormatter={(label) => formatDay(String(label))}
          cursor={{ stroke: "#232B39" }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: "#8B98A5" }} iconType="plainline" />
        <Area
          type="monotone"
          dataKey="created"
          name="Created"
          stroke="#00FF9C"
          strokeWidth={2}
          fill="url(#trend-created)"
        />
        <Area
          type="monotone"
          dataKey="resolved"
          name="Resolved"
          stroke="#00C2FF"
          strokeWidth={2}
          fill="url(#trend-resolved)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
