"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { ChartDatum } from "./SimpleBarChart";

const tooltipStyle = {
  background: "#161C28",
  border: "1px solid #232B39",
  borderRadius: 8,
  color: "#E6EDF3",
  fontSize: 13,
};

/** Generic donut wrapper - same per-datum color convention as
 * SimpleBarChart. A legend is always rendered so slice identity never
 * depends on color alone. */
export function SimpleDonutChart({ data }: { data: ChartDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={56}
          outerRadius={88}
          paddingAngle={2}
          stroke="#0A0E14"
          strokeWidth={2}
        >
          {data.map((entry, i) => (
            <Cell key={entry.name} fill={entry.color ?? `hsl(${i * 60}, 60%, 55%)`} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend
          verticalAlign="bottom"
          height={32}
          formatter={(value) => <span style={{ color: "#C9D1D9", fontSize: 12 }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
