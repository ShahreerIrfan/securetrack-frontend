import Image from "next/image";

const points = [
  "JWT-based authentication with refresh tokens",
  "Hashed credentials, never stored in plain text",
  "Parameterized queries — no SQL injection surface",
  "Full activity log for every report and assignment",
];

export function InfrastructureSection() {
  return (
    <section className="bg-surface py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center lg:px-10">
        <div className="relative aspect-36/25 overflow-hidden rounded-2xl">
          <Image
            src="https://images.unsplash.com/photo-1695668548342-c0c1ad479aee?w=1200&q=80"
            alt="Secure data center infrastructure"
            fill
            sizes="(min-width: 1024px) 600px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-background/25" />
        </div>

        <div>
          <h2 className="text-[30px] font-bold text-white">
            Built on secure <span className="text-accent">infrastructure</span>
          </h2>
          <p className="mt-4 max-w-md text-[15px] text-copy">
            Encrypted at rest and in transit, isolated by role, and backed by continuous
            monitoring.
          </p>
          <ul className="mt-8 space-y-4">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                <span className="text-sm text-copy">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
