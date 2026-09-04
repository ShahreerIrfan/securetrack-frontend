"use client";

import { useState } from "react";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import clsx from "clsx";
import { ArrowButton } from "./ArrowButton";
import { useCanAutoplayVideo } from "@/hooks/useCanAutoplayVideo";

export function Hero() {
  const canPlayVideo = useCanAutoplayVideo();
  const [videoReady, setVideoReady] = useState(false);

  return (
    <section className="relative flex min-h-140 items-center overflow-hidden bg-ink sm:min-h-160 lg:min-h-168">
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
            "absolute inset-0 size-full object-cover transition-opacity duration-700",
            videoReady ? "opacity-100" : "opacity-0",
          )}
        />
      )}

      {/* Navy wash, heaviest on the left where the copy sits. */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-ink/95 via-ink/75 to-ink/40" />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-24 lg:px-10">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-white">
            <ShieldCheck size={16} className="text-brand-2" />
            Welcome to SecureTrack
          </span>

          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-[64px]">
            Every finding
            <br />
            tracked to closure
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75">
            SecureTrack gives security teams one place to report, verify, assign and
            resolve vulnerabilities — with a role-based workflow and a full audit trail
            behind every change.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <ArrowButton href="/register">Get Started</ArrowButton>
            <ArrowButton href="/features" variant="outline">
              Explore Features
            </ArrowButton>
          </div>
        </div>
      </div>
    </section>
  );
}
