import { CalendarCheck, CircleCheck, Clock, WalletMinimal } from "lucide-react";
import clsx from "clsx";
import { SectionHeading } from "./SectionHeading";
import { ArrowButton } from "./ArrowButton";

const plans = [
  {
    name: "Starter",
    price: "0",
    blurb: "For a single team getting its triage process off spreadsheets.",
    features: [
      "Up to 5 team members",
      "All four roles",
      "Full activity log",
      "Role dashboards",
    ],
  },
  {
    name: "Team",
    price: "29",
    blurb: "For security teams running an active intake queue.",
    features: [
      "Up to 50 team members",
      "Trend & workload analytics",
      "Comment threads",
      "Priority support",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "79",
    blurb: "For organisations needing retention and reporting guarantees.",
    features: [
      "Unlimited members",
      "Extended log retention",
      "Export & reporting",
      "Dedicated support",
    ],
  },
];

const notes = [
  { Icon: CalendarCheck, label: "30-day free trial" },
  { Icon: WalletMinimal, label: "No hidden fees" },
  { Icon: Clock, label: "Cancel anytime" },
];

export function PricingSection() {
  return (
    <section id="pricing" className="bg-mist py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Pricing Plan"
          title="Straightforward plans"
          titleAccent="for every team size"
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={clsx(
                "overflow-hidden rounded-2xl bg-white transition-transform duration-200",
                plan.featured ? "lg:-translate-y-4 lg:shadow-xl" : "hover:-translate-y-1",
              )}
            >
              <div
                className={clsx(
                  "p-7",
                  plan.featured ? "bg-brand-gradient text-white" : "bg-ink text-white",
                )}
              >
                <p className="font-display text-lg font-bold">{plan.name}</p>
                <p className="mt-2 font-display text-4xl font-extrabold">
                  <span className="align-super text-lg">$</span>
                  {plan.price}
                  <span className="ml-1 align-baseline text-sm font-medium opacity-80">
                    /per month
                  </span>
                </p>
                <p className="mt-2 text-sm text-white/80">{plan.blurb}</p>
              </div>

              <div className="p-7">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-sm text-slate">
                      <CircleCheck size={16} className="shrink-0 text-brand-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <ArrowButton href="/register" className="mt-7">
                  Get Started
                </ArrowButton>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {notes.map(({ Icon, label }) => (
            <span key={label} className="flex items-center gap-2 text-sm text-slate">
              <Icon size={16} className="text-brand" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
