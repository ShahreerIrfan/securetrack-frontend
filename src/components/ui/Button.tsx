import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

export type ButtonVariant = "primary" | "outline" | "ghost" | "danger";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-background hover:brightness-110 shadow-[0_0_16px_-4px_var(--color-accent)] focus-visible:ring-accent",
  outline:
    "bg-transparent text-foreground border border-border hover:border-accent hover:text-accent focus-visible:ring-accent",
  ghost:
    "bg-transparent text-foreground hover:bg-surface-raised focus-visible:ring-accent",
  danger:
    "bg-danger text-white hover:brightness-110 focus-visible:ring-danger",
};

const baseButtonClasses =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

/** Same visual classes Button uses, for non-<button> elements that need
 * to look like one (e.g. a Next.js <Link> styled as a CTA) - avoids
 * nesting a <button> inside an <a>, which is invalid HTML, while
 * keeping exactly one definition of what each variant looks like. */
export function buttonClassName(variant: ButtonVariant = "primary", className?: string) {
  return clsx(baseButtonClasses, variantClasses[variant], className);
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled}
      className={buttonClassName(variant, className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
