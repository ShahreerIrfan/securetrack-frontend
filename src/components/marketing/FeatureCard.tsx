import { ReactNode } from "react";

export interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-accent bg-accent/10 text-accent shadow-[0_0_20px_-6px_var(--color-accent)]">
        {icon}
      </div>
      <h3 className="mt-6 text-lg font-bold text-white">{title}</h3>
      <p className="mt-3 text-sm text-copy">{description}</p>
    </div>
  );
}
