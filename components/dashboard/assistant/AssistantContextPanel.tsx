import { formatCurrency } from "@/lib/mock-home";
import type { AssistantContext } from "@/types/domain";

type AssistantContextPanelProps = {
  context?: AssistantContext;
};

export default function AssistantContextPanel({ context }: AssistantContextPanelProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <h2 className="text-2xl font-black">Contexto usado</h2>
      {context ? (
        <div className="mt-5 space-y-3">
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-sm font-bold text-white/55">Inventario</p>
            <p className="mt-1 text-2xl font-black">{context.inventoryProducts.length}</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-sm font-bold text-white/55">Compras</p>
            <p className="mt-1 text-2xl font-black">{context.purchases.length}</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-sm font-bold text-white/55">Gasto mensual</p>
            <p className="mt-1 text-2xl font-black">
              {formatCurrency(context.consumptionMetrics.monthlySpend)}
            </p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-sm font-bold text-white/55">Alertas</p>
            <p className="mt-1 text-2xl font-black">{context.consumptionMetrics.alerts.length}</p>
          </div>
        </div>
      ) : (
        <p className="mt-5 text-sm font-bold text-white/55">Cargando datos locales...</p>
      )}
    </section>
  );
}
