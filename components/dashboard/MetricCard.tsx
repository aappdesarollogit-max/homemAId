type MetricCardProps = {
  label: string;
  value: string;
  note: string;
  icon: string;
  tone?: "violet" | "green" | "orange" | "pink";
};

const toneClassNames = {
  violet: "from-violet-500/30",
  green: "from-emerald-500/30",
  orange: "from-orange-500/30",
  pink: "from-fuchsia-500/30",
};

export default function MetricCard({
  label,
  value,
  note,
  icon,
  tone = "violet",
}: MetricCardProps) {
  return (
    <article
      className={`rounded-3xl border border-white/10 bg-gradient-to-br ${toneClassNames[tone]} to-white/[0.04] p-6 shadow-xl`}
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
        {icon}
      </div>
      <p className="text-3xl font-black text-white">{value}</p>
      <p className="mt-1 font-semibold text-white/80">{label}</p>
      <p className="mt-4 text-sm font-semibold text-emerald-300">{note}</p>
    </article>
  );
}
