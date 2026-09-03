export interface HowItWorksStepProps {
  number: number;
  title: string;
  subtitle: string;
}

export function HowItWorksStep({ number, title, subtitle }: HowItWorksStepProps) {
  return (
    <div className="relative z-10 flex flex-col items-center bg-background px-4 text-center">
      <div className="flex h-17 w-17 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-background text-xl font-bold text-white shadow-[0_0_24px_-4px_var(--color-accent)]">
        {number}
      </div>
      <p className="mt-6 text-[17px] font-bold text-white">{title}</p>
      <p className="mt-1.5 text-[13px] text-copy">{subtitle}</p>
    </div>
  );
}
