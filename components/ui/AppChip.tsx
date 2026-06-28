type AppChipTone = "violet" | "green" | "orange" | "red" | "slate";

type AppChipProps = {
  children: React.ReactNode;
  tone?: AppChipTone;
  className?: string;
};

const toneClassNames: Record<AppChipTone, string> = {
  violet: "bg-violet-500/15 text-violet-100 ring-violet-300/20",
  green: "bg-emerald-500/15 text-emerald-100 ring-emerald-300/20",
  orange: "bg-orange-500/15 text-orange-100 ring-orange-300/20",
  red: "bg-red-500/15 text-red-100 ring-red-300/20",
  slate: "bg-white/10 text-white/70 ring-white/10",
};

export default function AppChip({ children, tone = "slate", className = "" }: AppChipProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-black leading-none ring-1 ${toneClassNames[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
