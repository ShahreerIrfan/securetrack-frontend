"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { SectionHeading } from "./SectionHeading";

const faqs = [
  {
    question: "Who can see a report once it's filed?",
    answer:
      "It depends on the role. The person who filed it always sees their own reports. Developers see only what's been assigned to them. Analysts and admins see everything. That scoping is applied in the database query, not just hidden in the interface.",
  },
  {
    question: "Can a report be edited after it's submitted?",
    answer:
      "Its author can edit the details while the report is still New. After an analyst picks it up, only an admin can change it. Status and assignment can never be edited through that path — they move only through the dedicated, role-gated transition.",
  },
  {
    question: "How do I create Analyst, Developer or Admin accounts?",
    answer:
      "Public sign-up always creates a plain User account. Elevated roles are assigned by an admin from the User Management page, which is also where accounts get deactivated or removed.",
  },
  {
    question: "What exactly gets recorded in the activity log?",
    answer:
      "Report creation, field edits, every status change and assignment, and comments being added, edited or deleted — each with the actor and a timestamp, so a report's full history can be reconstructed.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-mist py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
        <div>
          <SectionHeading
            align="left"
            eyebrow="FAQ"
            title="The questions teams"
            titleAccent="ask us first"
          />
          <Image
            src="/images/faq.webp"
            alt="Analyst reviewing a report queue"
            width={780}
            height={554}
            className="mt-8 w-full rounded-2xl object-cover"
          />
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = open === i;

            return (
              <div
                key={faq.question}
                className={clsx(
                  "overflow-hidden rounded-2xl transition-colors",
                  isOpen ? "bg-brand-gradient" : "bg-white",
                )}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span
                    className={clsx(
                      "font-display text-base font-bold",
                      isOpen ? "text-white" : "text-ink",
                    )}
                  >
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={clsx(
                      "shrink-0 transition-transform duration-200",
                      isOpen ? "rotate-180 text-white" : "text-slate",
                    )}
                  />
                </button>

                {isOpen && (
                  <p className="px-5 pb-5 text-sm leading-relaxed text-white/85">{faq.answer}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
