import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/marketing/Hero";
import { AboutSection } from "@/components/marketing/AboutSection";
import { ServicesSection } from "@/components/marketing/ServicesSection";
import { FeatureSection } from "@/components/marketing/FeatureSection";
import { LifecycleSection } from "@/components/marketing/LifecycleSection";
import { WhyChooseSection } from "@/components/marketing/WhyChooseSection";
import { SecuritySection } from "@/components/marketing/SecuritySection";
import { PricingSection } from "@/components/marketing/PricingSection";
import { WalkthroughSection } from "@/components/marketing/WalkthroughSection";
import { RolesSection } from "@/components/marketing/RolesSection";
import { CTABanner } from "@/components/marketing/CTABanner";
import { FaqSection } from "@/components/marketing/FaqSection";
import { BlogSection } from "@/components/marketing/BlogSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AboutSection />
        <ServicesSection />
        <FeatureSection />
        <LifecycleSection />
        <WhyChooseSection />
        <SecuritySection />
        <PricingSection />
        <WalkthroughSection />
        <RolesSection />
        <CTABanner />
        <FaqSection />
        <BlogSection />
      </main>
      <Footer />
    </>
  );
}
