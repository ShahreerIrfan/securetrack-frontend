import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "./SectionHeading";

const stages = [
  {
    image: "/images/project-1.webp",
    tag: "Step 01",
    title: "Reported",
    description: "A finding is filed with severity, category and evidence.",
  },
  {
    image: "/images/project-2.webp",
    tag: "Step 02",
    title: "Verified",
    description: "An analyst reviews it and confirms it's a real issue.",
  },
  {
    image: "/images/project-3.webp",
    tag: "Step 03",
    title: "Assigned",
    description: "An admin routes it to the developer who owns the fix.",
  },
  {
    image: "/images/project-4.webp",
    tag: "Step 04",
    title: "Resolved",
    description: "The fix lands, and an admin closes the report out.",
  },
];

export function LifecycleSection() {
  return (
    <section className="bg-mist py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="The Lifecycle"
          title="From first report to"
          titleAccent="confirmed fix"
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage) => (
            <article key={stage.title} className="group relative aspect-4/5 overflow-hidden">
              <Image
                src={stage.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Navy wash deepens on hover so the caption stays readable
                  over four quite different photographs. */}
              <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/50 to-transparent opacity-85 transition-opacity duration-300 group-hover:opacity-95" />

              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                  {stage.tag}
                </span>
                <h3 className="mt-3 font-display text-xl font-bold text-white">{stage.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/75">
                  {stage.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-sm leading-relaxed text-slate">
          Each transition is gated by role and written to the report&apos;s activity log.{" "}
          <Link href="/features" className="font-semibold text-brand underline underline-offset-2">
            See the full workflow
          </Link>
        </p>
      </div>
    </section>
  );
}
