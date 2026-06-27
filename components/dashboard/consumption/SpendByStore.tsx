import { formatCurrency } from "@/lib/mock-home";
import type { ConsumptionBreakdownItem } from "@/lib/services/consumption-service";

type SpendByStoreProps = {
  items: ConsumptionBreakdownItem[];
};

export default function SpendByStore({ items }: SpendByStoreProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <h2 className="text-2xl font-black">Tiendas</h2>
      <div className="mt-5 space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.label} className="rounded-2xl bg-white/5 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-black">{item.label}</p>
                  <p className="mt-1 text-xs font-bold text-white/45">{item.percentage}% del total</p>
                </div>
                <p className="font-black text-violet-300">{formatCurrency(item.amount)}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm font-bold text-white/55">Aún no hay tiendas registradas.</p>
        )}
      </div>
    </section>
  );
}
