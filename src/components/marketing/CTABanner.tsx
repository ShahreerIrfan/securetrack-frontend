import Link from "next/link";
import { buttonClassName } from "@/components/ui/Button";

export function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-background py-24 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,156,0.18),transparent_60%)]" />
      <div className="relative mx-auto max-w-2xl px-6">
        <h2 className="text-[32px] font-bold text-white">Ready to secure your workflow?</h2>
        <p className="mt-4 text-base text-copy">
          Join security teams already tracking and resolving issues faster.
        </p>
        <Link
          href="/register"
          className={buttonClassName("primary", "mt-8 inline-flex px-10 py-3.5 text-base")}
        >
          Start Free Trial
        </Link>
      </div>
    </section>
  );
}
