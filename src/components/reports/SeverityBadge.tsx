import clsx from "clsx";
import type { Severity } from "@/types/report";
import { severityLabels } from "./labels";

/** Severity is the loudest signal in the UI - it's the thing you scan a
 * list for. It gets a filled chip with a leading dot, and the two
 * levels that should pull your eye (high, critical) also get a soft
 * glow. Status and priority deliberately render quieter so three
 * different signals never compete as three identical pills. */
const styles: Record<Severity, string> = {
  low: "bg-accent/10 text-accent ring-accent/25",
  medium: "bg-accent-blue/10 text-accent-blue ring-accent-blue/25",
  high: "bg-amber/12 text-amber ring-amber/30 shadow-[0_0_12px_-4px_var(--color-amber)]",
  critical: "bg-danger/12 text-danger ring-danger/35 shadow-[0_0_14px_-4px_var(--color-danger)]",
};

const dots: Record<Severity, string> = {
  low: "bg-accent",
  medium: "bg-accent-blue",
  high: "bg-amber",
  critical: "bg-danger",
};

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset",
        styles[severity],
        className,
      )}
    >
      <span className={clsx("size-1.5 rounded-full", dots[severity])} />
      {severityLabels[severity]}
    </span>
  );
}
