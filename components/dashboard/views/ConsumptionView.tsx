"use client";

import BudgetSummary from "@/components/dashboard/consumption/BudgetSummary";
import ConsumptionAlerts from "@/components/dashboard/consumption/ConsumptionAlerts";
import SpendByCategory from "@/components/dashboard/consumption/SpendByCategory";
import SpendByStore from "@/components/dashboard/consumption/SpendByStore";
import TopProducts from "@/components/dashboard/consumption/TopProducts";
import WeeklyTrend from "@/components/dashboard/consumption/WeeklyTrend";
import SectionHeader from "@/components/dashboard/SectionHeader";
import { useConsumption } from "@/hooks/useConsumption";
import { householdSummary } from "@/lib/mock-home";

export default function ConsumptionView() {
  const {
    isLoaded,
    monthlySpend,
    spendByCategory,
    spendByStore,
    topPurchasedProducts,
    weeklyTrend,
    budgetUsage,
    alerts,
    criticalProducts,
  } = useConsumption(householdSummary.monthlyBudget);
  const visibleMonthlySpend = isLoaded ? monthlySpend : householdSummary.monthlySpend;
  const visibleBudgetUsage = isLoaded
    ? budgetUsage
    : Math.round((householdSummary.monthlySpend / householdSummary.monthlyBudget) * 100);

  return (
    <>
      <SectionHeader
        eyebrow="Consumo"
        title="Dashboard de consumo"
        description="Resumen de gasto mensual, presupuesto y categorías principales."
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <BudgetSummary
            monthlySpend={visibleMonthlySpend}
            monthlyBudget={householdSummary.monthlyBudget}
            budgetUsage={visibleBudgetUsage}
          />
          <WeeklyTrend points={weeklyTrend} />
          <SpendByCategory items={spendByCategory} />
        </div>

        <div className="space-y-6">
          <ConsumptionAlerts alerts={alerts} />
          <SpendByStore items={spendByStore} />
          <TopProducts products={topPurchasedProducts} />
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Inventario crítico</h2>
            <div className="mt-5 space-y-3">
              {criticalProducts.length > 0 ? (
                criticalProducts.map((product) => (
                  <div key={product.id} className="rounded-2xl bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-black">{product.name}</p>
                        <p className="mt-1 text-sm text-white/50">
                          {product.category} · {product.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-black text-orange-300">{product.statusLabel}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm font-bold text-white/55">No hay productos críticos.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
