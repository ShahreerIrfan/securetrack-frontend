import { Mail, MapPin, Phone } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/marketing/ContactForm";

const details = [
  { Icon: Phone, label: "Phone", value: "+1 800 987 6543", href: "tel:+18009876543" },
  { Icon: Mail, label: "Email", value: "hello@securetrack.app", href: "mailto:hello@securetrack.app" },
  { Icon: MapPin, label: "Office", value: "123 Harbour Street, Bristol, UK" },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-ink py-20 lg:py-24">
          <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              Get in touch
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-white/70">
              Questions about SecureTrack, or want a walkthrough of the workflow? Send us a
              message and we&apos;ll get back to you.
            </p>
          </div>
        </section>

        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_1.4fr] lg:gap-16 lg:px-10">
            <div className="space-y-5">
              {details.map(({ Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white">
                    <Icon size={17} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm text-slate transition-colors hover:text-brand"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm text-slate">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-mist p-6 sm:p-8">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
