import Image from "next/image";
import { Phone, Play } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { ArrowButton } from "./ArrowButton";

const highlights = [
  "File a report and watch it land in the analyst queue",
  "Verify, assign and resolve across four different logins",
  "Read the activity log rebuild the whole history",
];

export function WalkthroughSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          align="left"
          eyebrow="See It Work"
          title="The full workflow,"
          titleAccent="end to end"
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="group relative min-h-72 overflow-hidden rounded-2xl">
            <Image
              src="/images/testimonial.webp"
              alt="A security team working through the SecureTrack queue"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-ink/55" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <span className="flex size-16 items-center justify-center rounded-full bg-brand-gradient text-white shadow-lg">
                <Play size={22} fill="currentColor" />
              </span>
              <span className="text-sm font-semibold text-white">Watch the walkthrough</span>
            </div>
          </div>

          <div className="rounded-2xl bg-brand-gradient p-8 text-white sm:p-10">
            <h3 className="font-display text-2xl font-bold leading-snug">
              Four roles, one report, start to finish
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              The walkthrough follows a single vulnerability from the moment it&apos;s filed
              to the moment an admin closes it — switching accounts at each step so you can
              see exactly what each role is allowed to do.
            </p>

            <ul className="mt-6 space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-white/90">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-white" />
                  {item}
                </li>
              ))}
            </ul>

            <ArrowButton href="/register" variant="white" className="mt-8">
              Try It Yourself
            </ArrowButton>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-5 rounded-2xl bg-mist p-6 sm:flex-row sm:p-7">
          <div className="flex items-center gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white">
              <Phone size={19} />
            </span>
            <p className="text-sm text-slate">
              Questions before you start? Talk to us.
              <br />
              <a
                href="tel:+18009876543"
                className="font-display font-bold text-ink underline underline-offset-2"
              >
                +1 800 987 6543
              </a>
            </p>
          </div>
          <ArrowButton href="/contact">Contact Us</ArrowButton>
        </div>
      </div>
    </section>
  );
}
