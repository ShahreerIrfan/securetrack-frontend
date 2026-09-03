import Link from "next/link";
import { ShieldCheck } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15">
            <ShieldCheck size={18} className="text-accent" />
          </span>
          <span className="text-xl font-bold text-white">
            Secure<span className="text-accent">Track</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-copy transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm text-white transition-colors hover:text-accent">
            Log In
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-accent px-6 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
