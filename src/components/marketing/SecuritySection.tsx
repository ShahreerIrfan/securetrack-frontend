import Image from "next/image";
import { CircleCheck } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const blocks = [
  {
    title: "Scoped Visibility",
    body: "A reporter sees only the findings they filed. A developer sees only what's assigned to them. Analysts and admins see everything. The rule lives in one query helper shared by every endpoint.",
  },
  {
    title: "Gated Transitions",
    body: "Analysts can set In Review and Verified. Developers can only resolve their own assignments. Admins can set any status and assign work. Anything else is rejected by the API.",
  },
  {
    title: "Protected Edits",
    body: "Report fields can be edited by their author while still New, or by an admin at any point — and status and assignment can never be changed through the generic edit path.",
  },
  {
    title: "Self-Lockout Guards",
    body: "An admin can't demote, deactivate or delete their own account, so the last administrator can never accidentally lock themselves out of the system.",
  },
];

const footnotes = [
  {
    title: "JWT Sessions",
    body: "Short-lived access tokens with silent refresh, cleared on logout.",
  },
  {
    title: "Server-Side Rules",
    body: "Every permission is enforced on the API, never only in the interface.",
  },
  {
    title: "Tested Boundaries",
    body: "Authorization edges are covered by an automated regression suite.",
  },
];

export function SecuritySection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              align="left"
              eyebrow="How It's Enforced"
              title="Access rules that hold"
              titleAccent="all the way down"
            />

            <div className="mt-8 grid gap-7 sm:grid-cols-2">
              {blocks.slice(0, 2).map((block) => (
                <div key={block.title}>
                  <h3 className="font-display text-base font-bold text-ink">{block.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate">{block.body}</p>
                </div>
              ))}
            </div>
          </div>

          <Image
            src="/images/security.webp"
            alt="Two engineers reviewing a secured system diagram"
            width={960}
            height={478}
            className="h-full w-full rounded-2xl object-cover"
          />
        </div>

        <div className="mt-10 grid gap-7 sm:grid-cols-2">
          {blocks.slice(2).map((block) => (
            <div key={block.title}>
              <h3 className="font-display text-base font-bold text-ink">{block.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate">{block.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-8 border-t border-ink/10 pt-10 sm:grid-cols-3">
          {footnotes.map((note) => (
            <div key={note.title}>
              <h4 className="flex items-center gap-2 font-display text-base font-bold text-ink">
                <CircleCheck size={17} className="text-brand-2" />
                {note.title}
              </h4>
              <p className="mt-1.5 text-sm leading-relaxed text-slate">{note.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
