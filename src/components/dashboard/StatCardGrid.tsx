import { StatCard, type StatCardProps } from "@/components/ui/StatCard";

export function StatCardGrid({ stats }: { stats: StatCardProps[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  );
}
