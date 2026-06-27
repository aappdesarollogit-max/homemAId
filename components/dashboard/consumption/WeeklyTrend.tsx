import { formatCurrency } from "@/lib/mock-home";
import type { WeeklySpendPoint } from "@/lib/services/consumption-service";

type WeeklyTrendProps = {
  points: WeeklySpendPoint[];
};

export default function WeeklyTrend({ points }: WeeklyTrendProps) {
  const maxAmount = Math.max(...points.map((point) => point.amount), 0);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <h2 className="text-2xl font-black">Tendencia semanal</h2>
      {points.length > 0 ? (
        <>
          <div className="mt-8 flex h-52 items-end gap-3">
            {points.map((point) => {
              const height = maxAmount > 0 ? Math.max(8, Math.round((point.amount / maxAmount) * 100)) : 8;

              return (
                <div key={point.label} className="flex h-full w-full flex-col justify-end gap-2">
                  <span
                    className="w-full rounded-t-2xl bg-violet-500"
                    style={{ height: `${height}%` }}
                    title={formatCurrency(point.amount)}
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-3 grid gap-2 text-xs font-bold text-white/45" style={{ gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))` }}>
            {points.map((point) => (
              <span key={point.label} className="truncate text-center">
                {point.label}
              </span>
            ))}
          </div>
        </>
      ) : (
        <p className="mt-5 text-sm font-bold text-white/55">Aún no hay fechas suficientes para graficar.</p>
      )}
    </section>
  );
}
