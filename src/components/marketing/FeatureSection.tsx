import Image from "next/image";
import { SectionHeading } from "./SectionHeading";

const features = [
  {
    icon: "/icons/feat-1.svg",
    title: "Structured Intake",
    description:
      "Severity, priority, category and due date are captured up front, so triage starts with the context it needs instead of a chase for details.",
  },
  {
    icon: "/icons/feat-2.svg",
    title: "Role-Gated Transitions",
    description:
      "Analysts verify, admins assign and close, developers resolve what's theirs. The API enforces it — the UI just reflects what each role can actually do.",
  },
  {
    icon: "/icons/feat-3.svg",
    title: "Complete Activity Log",
    description:
      "Creation, edits, assignments and comments all land in one timeline per report, so the history of a finding is never in question.",
  },
];

export function FeatureSection() {
  return (
    <section id="how-it-works" className="bg-white py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10">
        <div className="space-y-4">
          <Image
            src="/images/feature-main.webp"
            alt="Security analyst working through a triage queue"
            width={900}
            height={558}
            className="w-full rounded-2xl object-cover"
          />

          <div className="grid grid-cols-2 gap-4">
            <Image
              src="/images/feature-side.webp"
              alt="Engineer investigating a reported vulnerability"
              width={780}
              height={509}
              className="h-full w-full rounded-2xl object-cover"
            />

            <div className="flex flex-col justify-center rounded-2xl bg-brand-gradient p-6 text-white">
              <p className="font-display text-4xl font-extrabold leading-none">4</p>
              <p className="mt-2 text-sm leading-snug text-white/85">
                Distinct roles, each with its own dashboard and permissions
              </p>
            </div>
          </div>
        </div>

        <div>
          <SectionHeading
            align="left"
            eyebrow="Why It Works"
            title="A workflow that holds"
            titleAccent="its own shape"
          />

          <div className="mt-9 space-y-7">
            {features.map((feature) => (
              <div key={feature.title} className="flex gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand/10">
                  <Image src={feature.icon} alt="" width={26} height={26} className="size-6.5" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
