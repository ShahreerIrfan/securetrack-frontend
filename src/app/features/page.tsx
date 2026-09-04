import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ServicesSection } from "@/components/marketing/ServicesSection";
import { SecuritySection } from "@/components/marketing/SecuritySection";
import { FaqSection } from "@/components/marketing/FaqSection";
import { CTABanner } from "@/components/marketing/CTABanner";

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-ink py-20 lg:py-24">
          <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              Built for every step
              <br />
              of the workflow
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-white/70">
              A closer look at what SecureTrack gives your security team, from the first
              report through to the confirmed fix.
            </p>
          </div>
        </section>

        <ServicesSection />
        <SecuritySection />
        <FaqSection />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
