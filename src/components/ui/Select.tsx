import { SelectHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, disabled, children, ...props }, ref) => (
    <select
      ref={ref}
      disabled={disabled}
      className={clsx(
        "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";
