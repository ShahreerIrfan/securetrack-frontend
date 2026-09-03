import { HTMLAttributes } from "react";
import clsx from "clsx";

export type BadgeVariant =
  // severity
  | "low"
  | "medium"
  | "high"
  | "critical"
  // status
  | "new"
  | "in_review"
  | "verified"
  | "assigned"
  | "resolved"
  | "closed"
  // fallback
  | "neutral";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  // severity: low=green, medium=blue, high=amber, critical=red
  low: "bg-accent/15 text-accent border border-accent/30",
  medium: "bg-accent-blue/15 text-accent-blue border border-accent-blue/30",
  high: "bg-amber/15 text-amber border border-amber/30",
  critical: "bg-danger/15 text-danger border border-danger/30",

  // status
  new: "bg-muted/15 text-muted border border-muted/30",
  in_review: "bg-accent-blue/15 text-accent-blue border border-accent-blue/30",
  verified: "bg-accent/15 text-accent border border-accent/30",
  assigned: "bg-amber/15 text-amber border border-amber/30",
  resolved: "bg-accent/15 text-accent border border-accent/30",
  closed: "bg-muted/15 text-muted border border-muted/30",

  neutral: "bg-surface-raised text-muted border border-border",
};

export function Badge({ variant = "neutral", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
