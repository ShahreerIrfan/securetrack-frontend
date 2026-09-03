import Image from "next/image";

export function DashboardPreview() {
  return (
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="text-center text-[34px] font-bold text-white">
          See every incident at a glance
        </h2>
        <p className="mt-3 text-center text-[15px] text-copy">
          A live dashboard your whole security team can trust.
        </p>

        <div className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-2xl border border-border bg-background">
          <div className="flex items-center gap-2 border-b border-border px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-danger" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          </div>
          <div className="relative aspect-60/19 border-t border-border">
            <Image
              src="https://images.unsplash.com/photo-1751448555253-f39c06e29d82?w=1600&q=80"
              alt="SecureTrack dashboard preview"
              fill
              sizes="(min-width: 1024px) 1000px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
