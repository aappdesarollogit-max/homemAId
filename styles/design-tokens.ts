export const designTokens = {
  colors: {
    surface: "bg-white/[0.04]",
    surfaceStrong: "bg-white/[0.07]",
    border: "border-white/10",
    textPrimary: "text-white",
    textSecondary: "text-white/60",
    textMuted: "text-white/45",
    violet: "bg-violet-500",
    violetSoft: "bg-violet-500/15",
    successSoft: "bg-emerald-500/15",
    warningSoft: "bg-orange-500/15",
    dangerSoft: "bg-red-500/15",
  },
  spacing: {
    card: "p-5",
    cardCompact: "p-4",
    section: "gap-6",
  },
  radius: {
    card: "rounded-3xl",
    control: "rounded-2xl",
    pill: "rounded-full",
  },
  shadow: {
    card: "shadow-xl shadow-black/10",
    active: "shadow-lg shadow-violet-950/30",
  },
  animation: {
    base: "transition duration-200 ease-out",
    press: "active:scale-[0.98]",
    hoverLift: "hover:-translate-y-0.5",
  },
  typography: {
    h1: "text-3xl font-black tracking-normal sm:text-4xl",
    h2: "text-2xl font-black tracking-normal",
    label: "text-xs font-black uppercase tracking-[0.16em]",
    body: "text-sm leading-relaxed",
    kpi: "text-3xl font-black tracking-normal",
  },
} as const;
