"use client";

import BudgetSummary from "@/components/dashboard/consumption/BudgetSummary";
import ConsumptionAlerts from "@/components/dashboard/consumption/ConsumptionAlerts";
import SpendByCategory from "@/components/dashboard/consumption/SpendByCategory";
import SpendByStore from "@/components/dashboard/consumption/SpendByStore";
import TopProducts from "@/components/dashboard/consumption/TopProducts";
import WeeklyTrend from "@/components/dashboard/consumption/WeeklyTrend";
import SectionHeader from "@/components/dashboard/SectionHeader";
import Badge from "@/components/ui/Badge";
import { useConsumption } from "@/hooks/useConsumption";
import { useHomeIntelligence } from "@/hooks/useHomeIntelligence";
import { useSettings } from "@/hooks/useSettings";
import { householdSummary } from "@/lib/mock-home";

export default function ConsumptionView() {
  const { settings } = useSettings();
  const { intelligenceSummary } = useHomeIntelligence();
  const activeBudget = settings?.monthlyBudget ?? householdSummary.monthlyBudget;
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
  } = useConsumption(activeBudget, settings?.budgetAlertThreshold ?? 80);
  const visibleMonthlySpend = isLoaded ? monthlySpend : 0;
  const visibleBudgetUsage = isLoaded
    ? budgetUsage
    : activeBudget > 0
      ? Math.round((visibleMonthlySpend / activeBudget) * 100)
      : 0;
  const budgetRisk = intelligenceSummary?.riskLevel ?? "low";
  const visiblePatterns = intelligenceSummary?.patterns.slice(0, 3) ?? [];
  const visiblePredictions = intelligenceSummary?.predictedStockOuts.slice(0, 3) ?? [];
  const confidenceInsights = intelligenceSummary?.knowledge?.confidenceInsights.slice(0, 3) ?? [];
  const explanations = intelligenceSummary?.knowledge?.explanations.slice(0, 3) ?? [];
  const spendingAlerts =
    intelligenceSummary?.alerts
      .filter((alert) =>
        ["budget_threshold", "budget_over", "spend_concentration", "unusual_purchase"].includes(
          alert.type,
        ),
      )
      .slice(0, 3) ?? [];

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
            monthlyBudget={activeBudget}
            budgetUsage={visibleBudgetUsage}
          />
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-300">
                  Inteligencia de consumo
                </p>
                <h2 className="mt-3 text-2xl font-black">Riesgo presupuestario</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  Uso actual del presupuesto: {visibleBudgetUsage}%.
                </p>
              </div>
              <Badge tone={budgetRisk === "critical" || budgetRisk === "high" ? "red" : "green"}>
                {budgetRisk}
              </Badge>
            </div>
            <div className="mt-5 space-y-3">
              {spendingAlerts.length > 0 ? (
                spendingAlerts.map((alert) => (
                  <div key={alert.id} className="rounded-2xl bg-white/5 p-4">
                    <p className="font-black">{alert.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/55">
                      {alert.description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm font-bold text-white/55">
                  No hay alertas inteligentes de gasto activas.
                </p>
              )}
            </div>
          </section>
          <WeeklyTrend points={weeklyTrend} />
          <SpendByCategory items={spendByCategory} />
        </div>

        <div className="space-y-6">
          <ConsumptionAlerts alerts={alerts} />
          <SpendByStore items={spendByStore} />
          <TopProducts products={topPurchasedProducts} />
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Predicciones</h2>
            <div className="mt-5 space-y-3">
              {visiblePredictions.length > 0 ? (
                visiblePredictions.map((prediction) => (
                  <div key={prediction.id} className="rounded-2xl bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black">{prediction.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-white/55">
                          {prediction.description}
                        </p>
                      </div>
                      <Badge tone={prediction.severity === "critical" || prediction.severity === "high" ? "red" : "violet"}>
                        {prediction.confidence}%
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm font-bold text-white/55">
                  No hay predicciones de consumo activas.
                </p>
              )}
            </div>
          </section>
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Patrones detectados</h2>
            <div className="mt-5 space-y-3">
              {visiblePatterns.length > 0 ? (
                visiblePatterns.map((pattern) => (
                  <div key={pattern.id} className="rounded-2xl bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black">{pattern.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-white/55">
                          {pattern.description}
                        </p>
                      </div>
                      <span className="text-xs font-black text-violet-300">
                        {pattern.confidence}%
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm font-bold text-white/55">
                  Aún no hay historial suficiente para detectar patrones.
                </p>
              )}
            </div>
          </section>
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Confianza y explicaciones</h2>
            <div className="mt-5 space-y-3">
              {confidenceInsights.length > 0 ? (
                confidenceInsights.map((insight) => (
                  <div key={insight.id} className="rounded-2xl bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-black">{insight.label}</p>
                      <span className="text-sm font-black text-violet-300">
                        {insight.confidence}%
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-white/55">
                      {insight.reason}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm font-bold text-white/55">
                  La confianza crecerá con más compras registradas.
                </p>
              )}
              {explanations.length > 0 ? (
                <div className="rounded-2xl bg-black/20 p-4">
                  <p className="text-sm font-black text-violet-200">
                    {explanations[0].summary}
                  </p>
                  <p className="mt-2 text-xs font-bold leading-relaxed text-white/50">
                    {explanations[0].reasons.join(" ")}
                  </p>
                </div>
              ) : null}
            </div>
          </section>
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
