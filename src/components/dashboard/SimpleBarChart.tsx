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
  background: "#161C28",
  border: "1px solid #232B39",
  borderRadius: 8,
  color: "#E6EDF3",
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
        <CartesianGrid stroke="#232B39" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          stroke="#8B98A5"
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: "#232B39" }}
        />
        <YAxis
          stroke="#8B98A5"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          width={28}
        />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(230,237,243,0.04)" }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={48}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color ?? "#00FF9C"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
