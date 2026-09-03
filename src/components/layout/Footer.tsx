import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Integrations", href: "/#integrations" },
      { label: "Changelog", href: "/#changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/#about" },
      { label: "Careers", href: "/#careers" },
      { label: "Blog", href: "/#blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Security", href: "/security" },
    ],
  },
];

// The source design uses plain outlined-circle placeholders here, not
// specific brand icons - matched as-is rather than guessing which
// platforms belong.
const socials = [
  { href: "https://github.com", label: "GitHub" },
  { href: "https://x.com", label: "X (Twitter)" },
  { href: "https://linkedin.com", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div>
            <span className="text-xl font-bold text-white">
              Secure<span className="text-accent">Track</span>
            </span>
            <p className="mt-3 text-sm text-copy">
              Vulnerability tracking for
              <br />
              modern security teams.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-bold text-white">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-copy transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted">© 2026 SecureTrack. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {socials.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="h-7 w-7 rounded-full border border-accent/60 transition-colors hover:bg-accent/10"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
