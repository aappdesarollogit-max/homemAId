"use client";

import SectionHeader from "@/components/dashboard/SectionHeader";
import { usePurchases } from "@/hooks/usePurchases";
import { formatCurrency, householdSummary } from "@/lib/mock-home";

export default function ConsumptionView() {
  const { monthlySpend, isLoaded } = usePurchases();
  const currentMonthlySpend = isLoaded ? monthlySpend : householdSummary.monthlySpend;
  const budgetUsage = Math.round(
    (currentMonthlySpend / householdSummary.monthlyBudget) * 100,
  );

  return (
    <>
      <SectionHeader
        eyebrow="Consumo"
        title="Dashboard de consumo"
        description="Resumen de gasto mensual, presupuesto y categorías principales."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm font-bold text-white/55">Gasto del mes</p>
          <p className="mt-2 text-4xl font-black">{formatCurrency(currentMonthlySpend)}</p>
          <p className="mt-2 text-sm font-bold text-red-300">
            {budgetUsage}% del presupuesto mensual
          </p>
          <div className="mt-8 flex h-52 items-end gap-3">
            {[45, 58, 42, 50, 66, 46, 76, 54, 88, 72].map((height, index) => (
              <span
                key={`${height}-${index}`}
                className="w-full rounded-t-2xl bg-violet-500"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black">Categorías</h2>
          <div className="mt-5 space-y-4">
            {[
              ["Alimentos", 250000, 58],
              ["Limpieza", 80000, 19],
              ["Mascotas", 52000, 12],
              ["Otros", 50000, 11],
            ].map(([label, amount, percentage]) => (
              <div key={label} className="rounded-2xl bg-white/5 p-4">
                <div className="flex justify-between text-sm font-black">
                  <span>{label}</span>
                  <span>{formatCurrency(Number(amount))}</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-violet-400"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
