const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

/** Short relative timestamp ("just now", "4h ago", "3d ago"), falling
 * back to an absolute date once something is more than a week old. Only
 * safe to call from client components - it reads the current time, so
 * rendering it on the server would produce a hydration mismatch. */
export function formatRelativeTime(iso: string): string {
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000);

  if (seconds < MINUTE) return "just now";
  if (seconds < HOUR) return `${Math.floor(seconds / MINUTE)}m ago`;
  if (seconds < DAY) return `${Math.floor(seconds / HOUR)}h ago`;
  if (seconds < DAY * 7) return `${Math.floor(seconds / DAY)}d ago`;
  return new Date(iso).toLocaleDateString();
}

/** Turns a duration in hours into a compact "2.5h" / "3d 4h" label. */
export function formatDuration(hours: number | null | undefined): string {
  if (hours === null || hours === undefined) return "—";
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${Math.round(hours * 10) / 10}h`;
  const days = Math.floor(hours / 24);
  const remainder = Math.round(hours % 24);
  return remainder ? `${days}d ${remainder}h` : `${days}d`;
}
