import { SeverityLegendBadge, type SeverityLegendBadgeProps } from "./SeverityLegendBadge";

const items: SeverityLegendBadgeProps[] = [
  { severity: "critical", label: "Critical", description: "Immediate action" },
  { severity: "high", label: "High", description: "Fix within 48 hours" },
  { severity: "medium", label: "Medium", description: "Scheduled fix" },
  { severity: "low", label: "Low", description: "Monitor and track" },
];

export function SeverityLegend() {
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="text-center text-[28px] font-bold text-white">
          Severity you can act on immediately
        </h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <SeverityLegendBadge key={item.severity} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
