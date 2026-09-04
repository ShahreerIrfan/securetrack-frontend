import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";
import { SectionHeading } from "./SectionHeading";

const services = [
  {
    icon: "/icons/svc-1.svg",
    title: "Vulnerability Reporting",
    description:
      "Anyone on the team can file a finding with severity, category and a due date. It lands as New and is visible to analysts straight away.",
  },
  {
    icon: "/icons/svc-2.svg",
    title: "Triage & Verification",
    description:
      "Analysts move reports through In Review and Verified, separating real findings from noise before any engineering time is spent.",
  },
  {
    icon: "/icons/svc-3.svg",
    title: "Developer Assignment",
    description:
      "Admins assign verified findings to the developer who owns that surface, and can see at a glance who is already carrying a queue.",
  },
  {
    icon: "/icons/svc-4.svg",
    title: "Audit Trail",
    description:
      "Every status change, edit, assignment and comment is written to an immutable activity log with the actor and timestamp attached.",
  },
  {
    icon: "/icons/svc-5.svg",
    title: "Role-Based Access",
    description:
      "Four roles with genuinely scoped queries — a reporter sees only their own findings, a developer only what's assigned to them.",
  },
  {
    icon: "/icons/svc-6.svg",
    title: "Dashboards & Trends",
    description:
      "Per-role dashboards with intake-vs-resolution trends, severity breakdowns and developer workload, so nothing quietly piles up.",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="bg-mist py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="What SecureTrack Does"
          title="The whole vulnerability"
          titleAccent="workflow in one place"
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            // Third card carries the gradient fill, matching the reference's
            // one-highlighted-card-per-row rhythm.
            const highlighted = i === 2;

            return (
              <article
                key={service.title}
                className={clsx(
                  "group flex flex-col rounded-2xl p-7 transition-all duration-200 hover:-translate-y-1",
                  highlighted
                    ? "bg-brand-gradient text-white"
                    : "bg-white hover:shadow-[0_18px_40px_-24px_rgba(1,5,53,0.35)]",
                )}
              >
                <Image
                  src={service.icon}
                  alt=""
                  width={56}
                  height={56}
                  className={clsx("size-14", highlighted && "brightness-0 invert")}
                />

                <div className="mt-10 flex items-start justify-between gap-4">
                  <h3
                    className={clsx(
                      "font-display text-lg font-bold leading-snug",
                      highlighted ? "text-white" : "text-ink",
                    )}
                  >
                    {service.title}
                  </h3>
                  <Link
                    href="/features"
                    aria-label={`Read more about ${service.title}`}
                    className={clsx(
                      "flex size-9 shrink-0 items-center justify-center rounded-full transition-transform group-hover:translate-x-0.5",
                      highlighted ? "bg-white/25 text-white" : "bg-brand-gradient text-white",
                    )}
                  >
                    <ArrowRight size={15} />
                  </Link>
                </div>

                <p
                  className={clsx(
                    "mt-3 text-sm leading-relaxed",
                    highlighted ? "text-white/85" : "text-slate",
                  )}
                >
                  {service.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
