import { ClipboardList, Clock, Lock, ShieldCheck } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

const features = [
  {
    icon: <ShieldCheck size={22} />,
    title: "Report Vulnerabilities",
    description: "Submit detailed reports with severity and evidence.",
  },
  {
    icon: <Lock size={22} />,
    title: "Role-Based Access Control",
    description: "User, Analyst, Developer, and Admin — each sees only what they need.",
  },
  {
    icon: <Clock size={22} />,
    title: "Real-Time Status Tracking",
    description: "Watch a report move from New to Fixed in one view.",
  },
  {
    icon: <ClipboardList size={22} />,
    title: "Full Audit Trail",
    description: "Every status change and assignment is logged.",
  },
];

export function FeatureGrid() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="text-center text-[34px] font-bold text-white">
          Everything your security team needs
        </h2>
        <p className="mt-3 text-center text-[15px] text-copy">
          One workflow from first report to final fix.
        </p>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
