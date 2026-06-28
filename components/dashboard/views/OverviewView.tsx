"use client";

import Link from "next/link";
import MetricCard from "@/components/dashboard/MetricCard";
import { InventoryRow } from "@/components/dashboard/InventoryRows";
import SectionHeader from "@/components/dashboard/SectionHeader";
import Badge from "@/components/ui/Badge";
import { useHomeIntelligence } from "@/hooks/useHomeIntelligence";
import { useInventory } from "@/hooks/useInventory";
import { usePurchases } from "@/hooks/usePurchases";
import { useSettings } from "@/hooks/useSettings";
import {
  formatCurrency,
  householdSummary,
  inventoryProducts,
} from "@/lib/mock-home";

export default function OverviewView() {
  const { monthlySpend, isLoaded } = usePurchases();
  const { products, isLoaded: isInventoryLoaded } = useInventory("todos");
  const { settings } = useSettings();
  const { intelligenceSummary } = useHomeIntelligence();
  const activeSettings = settings ?? {
    name: householdSummary.name,
    owner: householdSummary.owner,
    monthlyBudget: householdSummary.monthlyBudget,
  };
  const currentMonthlySpend = isLoaded ? monthlySpend : householdSummary.monthlySpend;
  const currentInventoryProducts = isInventoryLoaded ? products : inventoryProducts;
  const budgetUsage =
    activeSettings.monthlyBudget > 0
      ? Math.round((currentMonthlySpend / activeSettings.monthlyBudget) * 100)
      : 0;
  const urgentProducts = currentInventoryProducts.filter((product) => product.status !== "ok");
  const firstUrgentProduct = urgentProducts[0] ?? currentInventoryProducts[0];
  const intelligenceScore = intelligenceSummary?.healthScore ?? householdSummary.healthScore;
  const riskLabel = intelligenceSummary?.riskLevel ?? "low";
  const topRecommendations = intelligenceSummary?.recommendations.slice(0, 2) ?? [];
  const topAlerts = intelligenceSummary?.alerts.slice(0, 2) ?? [];
  const nextAction = topRecommendations[0]?.actionLabel ?? "Actualizar datos";
  const aiInsights = [
    urgentProducts.length > 0
      ? {
          id: "critical-products",
          title: `${urgentProducts.length} producto${urgentProducts.length === 1 ? "" : "s"} por revisar`,
          description: `Prioriza ${urgentProducts
            .slice(0, 3)
            .map((product) => product.name)
            .join(", ")} en tu próxima compra.`,
        }
      : {
          id: "inventory-ok",
          title: "Inventario en buen estado",
          description: "No hay productos críticos ni con stock bajo en este momento.",
        },
    {
      id: "monthly-spend",
      title: `Gasto mensual al ${budgetUsage}%`,
      description: `Este mes llevas ${formatCurrency(currentMonthlySpend)} registrados en compras.`,
    },
  ];

  return (
    <>
      <SectionHeader
        eyebrow={activeSettings.name}
        title={`Hola, ${activeSettings.owner}`}
        description="Aquí tienes el estado actualizado del hogar: inventario, compras, consumo y recomendaciones."
        action={
          <Link
            href="/dashboard?view=inventario"
            className="rounded-2xl bg-violet-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-950/30 hover:bg-violet-400"
          >
            Ver inventario
          </Link>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon="▤"
          label="Productos"
          value={String(currentInventoryProducts.length)}
          note="Total en inventario"
          tone="violet"
        />
        <MetricCard
          icon="!"
          label="Por revisar"
          value={String(urgentProducts.length)}
          note="Requieren atención"
          tone="orange"
        />
        <MetricCard
          icon="$"
          label="Gasto mensual"
          value={formatCurrency(currentMonthlySpend)}
          note={`${budgetUsage}% del presupuesto`}
          tone="pink"
        />
        <MetricCard
          icon="✓"
          label="Score del hogar"
          value={`${intelligenceScore}/100`}
          note={`Riesgo ${riskLabel}`}
          tone="green"
        />
      </div>

      <section className="mt-8 rounded-[32px] border border-white/10 bg-gradient-to-br from-violet-500/25 to-white/[0.04] p-6 shadow-2xl shadow-violet-950/20">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-200">
              Inteligencia del hogar
            </p>
            <h2 className="mt-2 text-2xl font-black">Score {intelligenceScore}/100</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              Riesgo actual: {riskLabel}. Próxima acción sugerida: {nextAction}.
            </p>
          </div>
          <Badge tone={riskLabel === "critical" || riskLabel === "high" ? "red" : "green"}>
            {riskLabel}
          </Badge>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-black/20 p-4">
            <p className="text-sm font-black text-violet-100">Recomendaciones</p>
            <div className="mt-3 space-y-3">
              {topRecommendations.length > 0 ? (
                topRecommendations.map((recommendation) => (
                  <p key={recommendation.id} className="text-sm leading-relaxed text-white/70">
                    <span className="font-black text-white">{recommendation.title}:</span>{" "}
                    {recommendation.description}
                  </p>
                ))
              ) : (
                <p className="text-sm text-white/55">No hay recomendaciones urgentes.</p>
              )}
            </div>
          </div>
          <div className="rounded-2xl bg-black/20 p-4">
            <p className="text-sm font-black text-violet-100">Alertas principales</p>
            <div className="mt-3 space-y-3">
              {topAlerts.length > 0 ? (
                topAlerts.map((alert) => (
                  <p key={alert.id} className="text-sm leading-relaxed text-white/70">
                    <span className="font-black text-white">{alert.title}:</span>{" "}
                    {alert.description}
                  </p>
                ))
              ) : (
                <p className="text-sm text-white/55">No hay alertas inteligentes activas.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black">Inventario crítico</h2>
            <Link href="/dashboard?view=inventario" className="text-sm font-black text-violet-300">
              Ver todo
            </Link>
          </div>
          <div className="space-y-3">
            {urgentProducts.map((product) => (
              <InventoryRow key={product.id} product={product} />
            ))}
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-3xl bg-violet-500 p-6 shadow-2xl shadow-violet-950/30">
            <h2 className="text-2xl font-black">Recomendaciones IA</h2>
            <div className="mt-5 space-y-4">
              {aiInsights.map((insight) => (
                <div key={insight.id} className="rounded-2xl bg-black/20 p-4">
                  <p className="font-black">{insight.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-violet-50">{insight.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Acciones rápidas</h2>
            <div className="mt-5 grid gap-3">
              <Link
                href="/dashboard?view=compras&mode=nueva"
                className="rounded-2xl bg-white/5 p-4 text-sm font-black hover:bg-white/10"
              >
                + Registrar nueva compra
              </Link>
              <Link
                href={`/dashboard?view=inventario&filter=criticos&product=${firstUrgentProduct?.id}&action=apertura`}
                className="rounded-2xl bg-white/5 p-4 text-sm font-black hover:bg-white/10"
              >
                Registrar apertura de producto
              </Link>
              <Link
                href="/dashboard?view=asistente&prompt=stock"
                className="rounded-2xl bg-white/5 p-4 text-sm font-black hover:bg-white/10"
              >
                Consultar productos por agotarse
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
