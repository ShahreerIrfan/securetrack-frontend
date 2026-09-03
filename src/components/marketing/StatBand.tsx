export interface StatBandProps {
  value: string;
  label: string;
}

export function StatBand({ value, label }: StatBandProps) {
  return (
    <div className="text-center">
      <p className="text-[32px] font-bold text-accent">{value}</p>
      <p className="mt-2 text-sm text-copy">{label}</p>
    </div>
  );
}
