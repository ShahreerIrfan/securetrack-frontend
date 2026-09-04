import { Badge } from "@/components/ui/Badge";
import type { Priority } from "@/types/report";
import { priorityLabels } from "./labels";

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Badge variant={priority}>{priorityLabels[priority]}</Badge>;
}
