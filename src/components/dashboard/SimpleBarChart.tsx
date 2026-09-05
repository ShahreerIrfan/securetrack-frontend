"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface ChartDatum {
  name: string;
  value: number;
  color?: string;
}

const tooltipStyle = {
  background: "#111B34",
  border: "1px solid #1E2A45",
  borderRadius: 8,
  color: "#FFFFFF",
  fontSize: 13,
};

/** Generic bar chart wrapper. Callers supply a color per datum (e.g.
 * the same severity/status colors used by Badge elsewhere) so a "High"
 * bar and a "High" badge always agree - this component has no opinion
 * on what the categories mean. */
export function SimpleBarChart({ data }: { data: ChartDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} barCategoryGap="30%">
        <CartesianGrid stroke="#1E2A45" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          stroke="#64748B"
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: "#1E2A45" }}
        />
        <YAxis
          stroke="#64748B"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          width={28}
        />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={48}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color ?? "#818CF8"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
