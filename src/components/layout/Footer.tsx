import Link from "next/link";
import { SendHorizontal, ShieldCheck } from "lucide-react";
import { SOCIAL_LINKS } from "./MarketingTopBar";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/#pricing" },
      { label: "How it Works", href: "/#how-it-works" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Workflow",
    links: [
      { label: "Reporting", href: "/features" },
      { label: "Triage", href: "/features" },
      { label: "Assignment", href: "/features" },
      { label: "Audit Log", href: "/features" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Security", href: "/security" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "+1 800 987 6543", href: "tel:+18009876543" },
      { label: "hello@securetrack.app", href: "mailto:hello@securetrack.app" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-brand-gradient">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-16">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-white/20">
              <ShieldCheck size={19} className="text-white" />
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight text-white">
              SecureTrack<span className="text-white/60">.</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ label, href, path }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full border border-white/35 text-white transition-colors hover:bg-white/15"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                  <path d={path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-10 border-t border-white/20 pt-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <p className="font-display text-base font-bold text-white">Stay in the loop</p>
            <p className="mt-2 text-sm text-white/75">
              Occasional notes on triage workflow and release changes.
            </p>
            <form className="mt-4 flex items-center gap-2">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-full border border-white/35 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/60 focus:border-white focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-brand transition-opacity hover:opacity-90"
              >
                <SendHorizontal size={16} />
              </button>
            </form>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="font-display text-base font-bold text-white">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/75 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/20 py-5">
        <p className="text-center text-sm text-white/80">
          © {new Date().getFullYear()} SecureTrack. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
