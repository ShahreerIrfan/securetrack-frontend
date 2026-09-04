import Image from "next/image";
import { SectionHeading } from "./SectionHeading";

const roles = [
  {
    image: "/images/team-1.webp",
    name: "User",
    blurb: "Files reports and tracks their own",
  },
  {
    image: "/images/team-2.webp",
    name: "Analyst",
    blurb: "Reviews and verifies incoming findings",
  },
  {
    image: "/images/team-3.webp",
    name: "Developer",
    blurb: "Resolves what's assigned to them",
  },
  {
    image: "/images/team-4.webp",
    name: "Admin",
    blurb: "Assigns work, closes reports, manages users",
  },
];

export function RolesSection() {
  return (
    <section className="bg-ink py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          tone="dark"
          eyebrow="Four Roles"
          title="A dashboard for everyone"
          titleAccent="in the loop"
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((role) => (
            <article
              key={role.name}
              className="group relative aspect-3/4 overflow-hidden rounded-2xl"
            >
              <Image
                src={role.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Brand wash so four different portraits still read as one
                  set, deepening toward the caption. */}
              <div className="absolute inset-0 bg-linear-to-t from-brand/90 via-ink/40 to-transparent transition-opacity duration-300 group-hover:from-brand" />

              <div className="absolute inset-x-0 bottom-0 p-5 text-center">
                <h3 className="font-display text-lg font-bold text-white">{role.name}</h3>
                <p className="mt-1 text-[13px] leading-snug text-white/80">{role.blurb}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
