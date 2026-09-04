import clsx from "clsx";
import { ChevronDown, ChevronUp, ChevronsUp, Minus, type LucideIcon } from "lucide-react";
import type { Priority } from "@/types/report";
import { priorityLabels } from "./labels";

/** Priority is the quietest of the three signals: a direction arrow
 * plus a label, no chip at all. Reading down a column, the arrows form
 * a shape you can scan without any of them shouting. */
const config: Record<Priority, { icon: LucideIcon; className: string }> = {
  low: { icon: ChevronDown, className: "text-muted" },
  medium: { icon: Minus, className: "text-accent-blue" },
  high: { icon: ChevronUp, className: "text-amber" },
  urgent: { icon: ChevronsUp, className: "text-danger" },
};

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  const { icon: Icon, className: tone } = config[priority];

  return (
    <span className={clsx("inline-flex items-center gap-1 text-xs font-medium", tone, className)}>
      <Icon size={14} strokeWidth={2.5} />
      {priorityLabels[priority]}
    </span>
  );
}
