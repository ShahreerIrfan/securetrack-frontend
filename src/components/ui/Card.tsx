import { HTMLAttributes } from "react";
import clsx from "clsx";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={clsx("rounded-xl border border-border bg-surface p-5 shadow-sm", className)}
      {...props}
    >
      {children}
    </div>
  );
}
