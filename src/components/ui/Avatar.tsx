import clsx from "clsx";

/** Four theme accents, picked deterministically from the user id so a
 * given person keeps the same colour everywhere they appear. */
const tints = [
  "bg-accent/15 text-accent ring-accent/25",
  "bg-accent-blue/15 text-accent-blue ring-accent-blue/25",
  "bg-amber/15 text-amber ring-amber/25",
  "bg-danger/15 text-danger ring-danger/25",
];

const sizes = {
  sm: "size-7 text-[11px]",
  md: "size-9 text-xs",
  lg: "size-11 text-sm",
};

export interface AvatarProps {
  user: { id: number; first_name: string; last_name: string };
  size?: keyof typeof sizes;
  className?: string;
}

export function Avatar({ user, size = "md", className }: AvatarProps) {
  const initials =
    `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() || "?";

  return (
    <span
      aria-hidden
      className={clsx(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold ring-1",
        tints[user.id % tints.length],
        sizes[size],
        className,
      )}
    >
      {initials}
    </span>
  );
}
