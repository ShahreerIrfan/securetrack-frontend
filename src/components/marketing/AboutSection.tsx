import Image from "next/image";
import { Check, Phone } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { ArrowButton } from "./ArrowButton";

const checklist = [
  "Role-scoped visibility for every user",
  "Status changes gated by role",
  "Automatic audit trail on every action",
];

export function AboutSection() {
  return (
    <section id="about" className="bg-white py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10">
        {/* Image collage: one tall frame beside a stacked pair, with the
            circular badge straddling the seam - as in the reference. */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="/images/about-tall.webp"
              alt="Security analyst reviewing incoming vulnerability reports"
              width={620}
              height={1154}
              className="h-full w-full rounded-2xl object-cover"
            />
            <div className="grid gap-4">
              <Image
                src="/images/about-sq-1.webp"
                alt="Engineer triaging a report at a workstation"
                width={580}
                height={650}
                className="w-full rounded-2xl object-cover"
              />
              <Image
                src="/images/about-sq-2.webp"
                alt="Developer resolving an assigned vulnerability"
                width={580}
                height={648}
                className="w-full rounded-2xl object-cover"
              />
            </div>
          </div>

          <div className="absolute -bottom-6 left-1/2 hidden size-28 -translate-x-1/2 items-center justify-center rounded-full bg-white p-2 shadow-lg sm:flex">
            <Image src="/icons/badge.svg" alt="" width={96} height={96} className="size-full" />
          </div>
        </div>

        <div>
          <SectionHeading
            align="left"
            eyebrow="About SecureTrack"
            title="One source of truth for"
            titleAccent="every security finding"
            description="Reports arrive from anyone on your team, get verified by analysts, assigned to the developer who owns the fix, and closed out by an admin — with nothing lost between the steps."
          />

          <div className="mt-8 overflow-hidden rounded-2xl bg-brand-gradient p-5 text-white sm:flex sm:items-center sm:gap-5">
            <Image
              src="/images/security.webp"
              alt=""
              width={200}
              height={120}
              className="mb-4 h-24 w-full rounded-xl object-cover sm:mb-0 sm:w-40"
            />
            <div>
              <p className="font-display text-lg font-bold">Built around four roles</p>
              <p className="mt-1 text-sm text-white/85">
                User, Analyst, Developer and Admin — each sees exactly the reports they
                should, and can make exactly the changes they&apos;re allowed to.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <ul className="space-y-2.5">
              {checklist.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-slate">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="space-y-4">
              <a href="tel:+18009876543" className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-brand-gradient text-white">
                  <Phone size={17} />
                </span>
                <span className="font-display text-lg font-bold text-ink">
                  +1 800 987 6543
                </span>
              </a>
              <ArrowButton href="/contact">Contact Us</ArrowButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
