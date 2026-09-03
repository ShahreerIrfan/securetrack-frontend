import clsx from "clsx";

export type Severity = "critical" | "high" | "medium" | "low";

export interface SeverityLegendBadgeProps {
  severity: Severity;
  label: string;
  description: string;
}

const colorMap: Record<Severity, { border: string; dot: string }> = {
  critical: { border: "border-danger", dot: "bg-danger" },
  high: { border: "border-amber", dot: "bg-amber" },
  medium: { border: "border-accent-blue", dot: "bg-accent-blue" },
  low: { border: "border-accent", dot: "bg-accent" },
};

export function SeverityLegendBadge({ severity, label, description }: SeverityLegendBadgeProps) {
  const colors = colorMap[severity];
  return (
    <div
      className={clsx(
        "flex items-center gap-3 rounded-xl border bg-surface px-5 py-4",
        colors.border,
      )}
    >
      <span className={clsx("h-4 w-4 shrink-0 rounded-full", colors.dot)} />
      <div>
        <p className="text-[15px] font-bold text-white">{label}</p>
        <p className="text-xs text-copy">{description}</p>
      </div>
    </div>
  );
}
