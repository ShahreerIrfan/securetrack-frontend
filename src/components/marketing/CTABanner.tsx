import Image from "next/image";
import { Mail, Phone } from "lucide-react";

export function CTABanner() {
  return (
    <section className="bg-white pb-20 lg:pb-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="overflow-hidden rounded-2xl bg-brand-gradient">
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_1fr]">
            <div className="p-8 sm:p-12">
              <h2 className="font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                Start tracking findings
                <br />
                properly today
              </h2>

              <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
                <a href="tel:+18009876543" className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
                    <Phone size={17} />
                  </span>
                  <span className="text-white">
                    <span className="block text-sm font-semibold">Get contact now</span>
                    <span className="block text-sm text-white/80">+1 800 987 6543</span>
                  </span>
                </a>

                <span aria-hidden className="hidden h-10 w-px bg-white/25 sm:block" />

                <a href="mailto:hello@securetrack.app" className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
                    <Mail size={17} />
                  </span>
                  <span className="text-white">
                    <span className="block text-sm font-semibold">Send e-mail</span>
                    <span className="block text-sm text-white/80">hello@securetrack.app</span>
                  </span>
                </a>
              </div>
            </div>

            <div className="relative hidden h-full min-h-64 lg:block">
              <Image
                src="/images/cta.webp"
                alt=""
                fill
                sizes="(min-width: 1024px) 40vw, 0px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
