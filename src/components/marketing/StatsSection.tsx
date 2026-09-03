import { StatBand, type StatBandProps } from "./StatBand";

const stats: StatBandProps[] = [
  { value: "500+", label: "Reports Tracked" },
  { value: "98%", label: "Resolution Rate" },
  { value: "24hr", label: "Avg. Response Time" },
];

export function StatsSection() {
  return (
    <section className="border-y border-accent/40 bg-background py-16">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-6 sm:grid-cols-3 lg:px-10">
        {stats.map((stat) => (
          <StatBand key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}
