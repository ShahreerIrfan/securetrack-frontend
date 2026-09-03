import { Badge } from "@/components/ui/Badge";
import type { Severity } from "@/types/report";
import { severityLabels } from "./labels";

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <Badge variant={severity}>{severityLabels[severity]}</Badge>;
}
