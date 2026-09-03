import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { buttonClassName } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(0,194,255,0.15),transparent_60%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-accent px-4 py-1.5">
            <ShieldCheck size={14} className="text-accent" />
            <span className="text-[13px] text-accent">Security Incident Management</span>
          </div>

          <h1 className="mt-6 text-5xl font-bold leading-tight text-white lg:text-[54px]">
            Track. Verify. Fix.
            <br />
            <span className="text-accent">Faster.</span>
          </h1>

          <p className="mt-6 max-w-md text-lg text-copy">
            Report, verify, assign, and resolve security vulnerabilities with a clear
            role-based workflow built for security teams.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/register" className={buttonClassName("primary", "px-8 py-3.5 text-base")}>
              Get Started Free
            </Link>
            <Link
              href="/#how-it-works"
              className={buttonClassName("outline", "px-8 py-3.5 text-base")}
            >
              See How It Works
            </Link>
          </div>
        </div>

        <div className="relative aspect-29/22 overflow-hidden rounded-2xl border border-accent/50 bg-surface">
          <Image
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80"
            alt="Security team collaborating on a vulnerability report"
            fill
            sizes="(min-width: 1024px) 580px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
