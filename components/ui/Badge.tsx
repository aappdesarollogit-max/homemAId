type BadgeProps = {
  children: React.ReactNode;
  tone?: "violet" | "green" | "orange" | "red" | "slate";
};

const toneClassNames = {
  violet: "bg-violet-100 text-violet-700",
  green: "bg-emerald-100 text-emerald-700",
  orange: "bg-orange-100 text-orange-700",
  red: "bg-red-100 text-red-700",
  slate: "bg-slate-100 text-slate-700",
};

export default function Badge({ children, tone = "slate" }: BadgeProps) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${toneClassNames[tone]}`}>
      {children}
    </span>
  );
}
