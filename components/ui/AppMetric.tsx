type AppMetricProps = {
  label: string;
  value: string;
  note?: string;
};

export default function AppMetric({ label, value, note }: AppMetricProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-white/45">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
      {note ? <p className="mt-1 text-xs font-bold text-white/45">{note}</p> : null}
    </div>
  );
}
