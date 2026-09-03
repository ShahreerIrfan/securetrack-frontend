import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/marketing/ContactForm";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="bg-background py-24">
        <div className="mx-auto max-w-xl px-6 lg:px-10">
          <h1 className="text-center text-[34px] font-bold text-white">Get in touch</h1>
          <p className="mt-3 text-center text-[15px] text-copy">
            Questions about SecureTrack? Send us a message and we&apos;ll get back to you.
          </p>
          <div className="mt-12">
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
