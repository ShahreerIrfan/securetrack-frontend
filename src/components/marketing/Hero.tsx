"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import clsx from "clsx";
import { buttonClassName } from "@/components/ui/Button";
import { useCanAutoplayVideo } from "@/hooks/useCanAutoplayVideo";

export function Hero() {
  const canPlayVideo = useCanAutoplayVideo();
  const [videoReady, setVideoReady] = useState(false);

  return (
    <section className="relative flex min-h-140 items-center overflow-hidden bg-background sm:min-h-160 lg:min-h-190">
      {/* Poster paints immediately and never leaves the DOM - it's the
          entire background on a slow/data-saver connection, and stays
          underneath the video everywhere else until playback actually
          has frames ready, so there's never a flash of black. */}
      <Image
        src="/videos/hero-poster.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {canPlayVideo && (
        <video
          src="/videos/hero-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setVideoReady(true)}
          className={clsx(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            videoReady ? "opacity-100" : "opacity-0",
          )}
        />
      )}

      {/* Legibility scrim: darker at the edges/bottom where the CTA and
          badges sit, lighter through the middle so the footage still
          reads as video rather than a flat tinted panel. */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-background/80 via-background/55 to-background/90" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent,rgba(10,14,20,0.6)_75%)]" />

      <div className="relative mx-auto w-full max-w-4xl px-6 py-24 text-center sm:py-28 lg:px-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/60 bg-background/40 px-4 py-1.5 backdrop-blur-sm">
          <ShieldCheck size={14} className="text-accent" />
          <span className="text-[13px] font-medium uppercase tracking-[0.14em] text-accent">
            Security Incident Management
          </span>
        </div>

        <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
          Track. Verify. Fix.
          <br />
          <span className="text-accent">Faster.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-copy sm:text-lg">
          Report, verify, assign, and resolve security vulnerabilities with a clear
          role-based workflow built for security teams.
        </p>

        <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className={buttonClassName("primary", "w-full px-8 py-3.5 text-base sm:w-auto")}
          >
            Get Started Free
          </Link>
          <Link
            href="/#how-it-works"
            className={buttonClassName("outline", "w-full px-8 py-3.5 text-base sm:w-auto")}
          >
            See How It Works
          </Link>
        </div>
      </div>
    </section>
  );
}
