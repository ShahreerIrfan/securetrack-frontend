import clsx from "clsx";

export type SkeletonVariant = "text" | "card" | "table-row";

export interface SkeletonProps {
  variant?: SkeletonVariant;
  /** text variant: number of lines */
  lines?: number;
  /** table-row variant: number of rows */
  rows?: number;
  /** table-row variant: number of columns per row */
  columns?: number;
  className?: string;
}

const pulse = "animate-pulse rounded bg-surface-raised";

export function Skeleton({
  variant = "text",
  lines = 3,
  rows = 3,
  columns = 4,
  className,
}: SkeletonProps) {
  if (variant === "card") {
    return (
      <div className={clsx("rounded-xl border border-border bg-surface p-5", className)}>
        <div className={clsx(pulse, "h-4 w-1/3")} />
        <div className={clsx(pulse, "mt-3 h-8 w-1/2")} />
        <div className={clsx(pulse, "mt-2 h-3 w-1/4")} />
      </div>
    );
  }

  if (variant === "table-row") {
    return (
      <div className={clsx("space-y-3", className)}>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-4">
            {Array.from({ length: columns }).map((_, c) => (
              <div key={c} className={clsx(pulse, "h-4 flex-1")} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  // text
  return (
    <div className={clsx("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={clsx(pulse, "h-3", i === lines - 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}
