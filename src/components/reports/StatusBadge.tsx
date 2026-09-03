import { Badge } from "@/components/ui/Badge";
import type { ReportStatus } from "@/types/report";
import { statusLabels } from "./labels";

export function StatusBadge({ status }: { status: ReportStatus }) {
  return <Badge variant={status}>{statusLabels[status]}</Badge>;
}
