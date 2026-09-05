import { ReactNode } from "react";
import clsx from "clsx";
import { Card } from "./Card";

export interface StatCardProps {
  icon?: ReactNode;
  label: ReactNode;
  value: ReactNode;
  trend?: ReactNode;
  className?: string;
}

export function StatCard({ icon, label, value, trend, className }: StatCardProps) {
  return (
    <Card className={clsx("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        <p className="truncate text-sm text-muted">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
        {trend && <p className="mt-1 text-xs text-muted">{trend}</p>}
      </div>
      {icon && (
        <div className="shrink-0 rounded-xl bg-accent-gradient-soft p-2.5 text-accent">{icon}</div>
      )}
    </Card>
  );
}
