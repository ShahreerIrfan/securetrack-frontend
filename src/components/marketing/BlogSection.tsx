import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const posts = [
  {
    image: "/images/blog-1.webp",
    title: "Writing a vulnerability report an engineer can act on",
    href: "/features",
  },
  {
    image: "/images/blog-2.webp",
    title: "Why triage belongs to analysts, not the whole team",
    href: "/features",
  },
  {
    image: "/images/blog-3.webp",
    title: "What a useful security audit trail actually records",
    href: "/features",
  },
];

export function BlogSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading eyebrow="Latest Posts" title="Notes from the" titleAccent="triage queue" />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.title}
              href={post.href}
              className="group relative aspect-4/3 overflow-hidden rounded-2xl"
            >
              <Image
                src={post.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/40 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                <h3 className="font-display text-base font-bold leading-snug text-white">
                  {post.title}
                </h3>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white transition-transform group-hover:translate-x-0.5">
                  <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
