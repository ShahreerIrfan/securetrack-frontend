import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/marketing/Hero";
import { TrustedByStrip } from "@/components/marketing/TrustedByStrip";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { DashboardPreview } from "@/components/marketing/DashboardPreview";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";
import { SeverityLegend } from "@/components/marketing/SeverityLegend";
import { StatsSection } from "@/components/marketing/StatsSection";
import { InfrastructureSection } from "@/components/marketing/InfrastructureSection";
import { CTABanner } from "@/components/marketing/CTABanner";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustedByStrip />
        <FeatureGrid />
        <DashboardPreview />
        <HowItWorksSection />
        <SeverityLegend />
        <StatsSection />
        <InfrastructureSection />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
