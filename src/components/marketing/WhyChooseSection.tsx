import Image from "next/image";
import { SectionHeading } from "./SectionHeading";

const reasons = [
  {
    icon: "/icons/why-1.svg",
    title: "Permissions That Actually Hold",
    description:
      "Scoping is enforced in the queryset and the serializer, not just hidden in the UI — a role can't reach data or transitions it shouldn't.",
  },
  {
    icon: "/icons/why-2.svg",
    title: "Nothing Sits Unowned",
    description:
      "Unassigned verified findings and per-developer workload are surfaced on the admin dashboard, so queues don't quietly grow.",
  },
  {
    icon: "/icons/why-3.svg",
    title: "A History You Can Trust",
    description:
      "Every create, edit, assignment, status change and comment is logged with its actor, so you can reconstruct any report's path.",
  },
];

const stats = [
  { icon: "/icons/stat-1.svg", value: "4", label: "Roles Supported" },
  { icon: "/icons/stat-2.svg", value: "6", label: "Workflow Stages" },
  { icon: "/icons/stat-3.svg", value: "4", label: "Severity Levels" },
  { icon: "/icons/stat-1.svg", value: "100%", label: "Actions Audited" },
];

export function WhyChooseSection() {
  return (
    <section className="bg-ink py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Image
            src="/images/why-choose.webp"
            alt="Security team reviewing findings together"
            width={900}
            height={1101}
            className="w-full rounded-2xl object-cover"
          />

          <div>
            <SectionHeading
              align="left"
              tone="dark"
              eyebrow="Why SecureTrack"
              title="Built for how security"
              titleAccent="work really happens"
            />

            <div className="mt-9 space-y-4">
              {reasons.map((reason) => (
                <div
                  key={reason.title}
                  className="flex gap-4 rounded-2xl bg-white p-5 transition-transform hover:-translate-y-0.5"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand/10">
                    <Image src={reason.icon} alt="" width={24} height={24} className="size-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-ink">{reason.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product facts rather than customer-count claims - these are
            things the system genuinely does, so they stay true. */}
        <div className="mt-16 grid grid-cols-2 gap-y-10 border-t border-white/10 pt-12 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={
                i < stats.length - 1 ? "lg:border-r lg:border-white/10" : undefined
              }
            >
              <div className="flex flex-col items-center text-center">
                <Image
                  src={stat.icon}
                  alt=""
                  width={44}
                  height={44}
                  className="size-11 brightness-0 invert"
                />
                <p className="mt-3 font-display text-4xl font-extrabold text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-white/60">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
