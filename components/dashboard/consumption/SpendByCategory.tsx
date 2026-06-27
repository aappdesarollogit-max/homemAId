import { formatCurrency } from "@/lib/mock-home";
import type { ConsumptionBreakdownItem } from "@/lib/services/consumption-service";

type SpendByCategoryProps = {
  items: ConsumptionBreakdownItem[];
};

export default function SpendByCategory({ items }: SpendByCategoryProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <h2 className="text-2xl font-black">Categorías</h2>
      <div className="mt-5 space-y-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.label} className="rounded-2xl bg-white/5 p-4">
              <div className="flex justify-between text-sm font-black">
                <span>{item.label}</span>
                <span>{formatCurrency(item.amount)}</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-violet-400"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <p className="mt-2 text-xs font-bold text-white/45">{item.percentage}% del gasto</p>
            </div>
          ))
        ) : (
          <p className="text-sm font-bold text-white/55">Aún no hay categorías para analizar.</p>
        )}
      </div>
    </section>
  );
}
