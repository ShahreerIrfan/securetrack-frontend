import { HowItWorksStep } from "./HowItWorksStep";

const steps = [
  { number: 1, title: "Report", subtitle: "Submitted by User" },
  { number: 2, title: "Verify", subtitle: "Checked by Analyst" },
  { number: 3, title: "Assign", subtitle: "Delegated by Admin" },
  { number: 4, title: "Resolve", subtitle: "Fixed by Developer" },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="text-center text-[34px] font-bold text-white">How It Works</h2>

        <div className="relative mt-20">
          <div className="absolute top-8.5 right-0 left-0 border-t-2 border-dashed border-border" />
          <div className="relative grid grid-cols-2 gap-y-12 lg:grid-cols-4">
            {steps.map((step) => (
              <HowItWorksStep key={step.number} {...step} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
