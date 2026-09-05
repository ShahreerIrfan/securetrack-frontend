"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ShieldCheck, X } from "lucide-react";
import { ArrowButton } from "@/components/marketing/ArrowButton";
import { useAuthStore } from "@/store/authStore";
import { MarketingTopBar } from "./MarketingTopBar";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Contact Us", href: "/contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const isLoggedIn = useAuthStore((s) => Boolean(s.user));

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <MarketingTopBar />

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-brand-gradient">
            <ShieldCheck size={19} className="text-white" />
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight text-ink">
            SecureTrack<span className="text-brand-2">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium text-ink transition-colors hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {!isLoggedIn && (
            <Link
              href="/login"
              className="hidden text-[15px] font-medium text-ink transition-colors hover:text-brand sm:block"
            >
              Log In
            </Link>
          )}
          <ArrowButton href="/register" className="hidden sm:inline-flex">
            Get Started
          </ArrowButton>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex size-10 items-center justify-center rounded-lg text-ink lg:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-black/5 bg-white px-6 pb-5 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block border-b border-black/5 py-3 text-[15px] font-medium text-ink"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex items-center gap-3">
            {!isLoggedIn && (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-[15px] font-medium text-ink"
              >
                Log In
              </Link>
            )}
            <ArrowButton href="/register">Get Started</ArrowButton>
          </div>
        </nav>
      )}
    </header>
  );
}
