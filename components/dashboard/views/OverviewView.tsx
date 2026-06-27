"use client";

import Link from "next/link";
import MetricCard from "@/components/dashboard/MetricCard";
import { InventoryRow } from "@/components/dashboard/InventoryRows";
import SectionHeader from "@/components/dashboard/SectionHeader";
import { useInventory } from "@/hooks/useInventory";
import { usePurchases } from "@/hooks/usePurchases";
import {
  formatCurrency,
  householdSummary,
  inventoryProducts,
} from "@/lib/mock-home";

export default function OverviewView() {
  const { monthlySpend, isLoaded } = usePurchases();
  const { products, isLoaded: isInventoryLoaded } = useInventory("todos");
  const currentMonthlySpend = isLoaded ? monthlySpend : householdSummary.monthlySpend;
  const currentInventoryProducts = isInventoryLoaded ? products : inventoryProducts;
  const budgetUsage = Math.round(
    (currentMonthlySpend / householdSummary.monthlyBudget) * 100,
  );
  const urgentProducts = currentInventoryProducts.filter((product) => product.status !== "ok");
  const firstUrgentProduct = urgentProducts[0] ?? currentInventoryProducts[0];
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
        eyebrow={householdSummary.name}
        title={`¡Hola, ${householdSummary.owner}!`}
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
          value={`${householdSummary.healthScore}/100`}
          note="Muy buen estado"
          tone="green"
        />
      </div>

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
