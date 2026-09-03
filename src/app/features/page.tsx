import { ShieldCheck, Lock, Clock, ClipboardList } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import type { FeatureCardProps } from "@/components/marketing/FeatureCard";

const expandedFeatures: FeatureCardProps[] = [
  {
    icon: <ShieldCheck size={22} />,
    title: "Report Vulnerabilities",
    description:
      "Submit detailed reports with severity, description, and supporting evidence. Every report starts in the New status and is immediately visible to your security analysts for triage.",
  },
  {
    icon: <Lock size={22} />,
    title: "Role-Based Access Control",
    description:
      "Four roles — User, Analyst, Developer, and Admin — each with a scoped view of the system. Users see only what they reported, developers see only what's assigned to them, and analysts and admins see the full picture.",
  },
  {
    icon: <Clock size={22} />,
    title: "Real-Time Status Tracking",
    description:
      "Follow a report's full lifecycle — New, In Review, Verified, Assigned, Resolved, Closed — with role-gated transitions that keep the workflow honest at every step.",
  },
  {
    icon: <ClipboardList size={22} />,
    title: "Full Audit Trail",
    description:
      "Every status change and assignment is automatically logged with who made the change and when, so nothing about a report's history is ever in question.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-background pt-24">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <h1 className="text-[34px] font-bold text-white">Built for every step of the workflow</h1>
          <p className="mt-3 text-[15px] text-copy">
            A closer look at what SecureTrack gives your security team, from first report to
            final fix.
          </p>
        </div>
        <FeatureGrid features={expandedFeatures} showHeading={false} />
      </main>
      <Footer />
    </>
  );
}
