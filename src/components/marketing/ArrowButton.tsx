import Link from "next/link";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";

export type ArrowButtonVariant = "gradient" | "white" | "outline";

const variants: Record<ArrowButtonVariant, { pill: string; circle: string }> = {
  gradient: {
    pill: "bg-brand-gradient text-white hover:brightness-110",
    circle: "bg-white/25 text-white",
  },
  white: {
    pill: "bg-white text-ink hover:bg-white/90",
    circle: "bg-brand-gradient text-white",
  },
  outline: {
    pill: "border border-white/40 text-white hover:bg-white/10",
    circle: "bg-white/20 text-white",
  },
};

export interface ArrowButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: ArrowButtonVariant;
  className?: string;
}

/** The reference's signature CTA: a pill with a circular arrow badge
 * tucked into its right end. Used for every primary action on the site. */
export function ArrowButton({
  href,
  children,
  variant = "gradient",
  className,
}: ArrowButtonProps) {
  const style = variants[variant];

  return (
    <Link
      href={href}
      className={clsx(
        "group inline-flex items-center gap-2.5 rounded-full py-2 pl-6 pr-2 text-sm font-semibold transition-all",
        style.pill,
        className,
      )}
    >
      {children}
      <span
        className={clsx(
          "flex size-8 items-center justify-center rounded-full transition-transform group-hover:translate-x-0.5",
          style.circle,
        )}
      >
        <ArrowRight size={15} />
      </span>
    </Link>
  );
}
