import { ReactNode } from "react";
import clsx from "clsx";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";

export type ToastVariant = "success" | "error" | "info";

export interface ToastProps {
  variant: ToastVariant;
  title?: ReactNode;
  description?: ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const variantConfig: Record<ToastVariant, { icon: typeof CheckCircle2; classes: string }> = {
  success: { icon: CheckCircle2, classes: "border-accent/30 text-accent" },
  error: { icon: XCircle, classes: "border-danger/30 text-danger" },
  info: { icon: Info, classes: "border-accent-blue/30 text-accent-blue" },
};

export function Toast({ variant, title, description, onDismiss, className }: ToastProps) {
  const { icon: Icon, classes } = variantConfig[variant];
  return (
    <div
      role="status"
      className={clsx(
        "flex w-full max-w-sm items-start gap-3 rounded-lg border bg-surface-raised p-4 shadow-lg",
        classes,
        className,
      )}
    >
      <Icon size={20} className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        {title && <p className="text-sm font-medium text-foreground">{title}</p>}
        {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="shrink-0 text-muted transition-colors hover:text-foreground"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
