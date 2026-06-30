"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  getWelcomeState,
  markWelcomeCompleted,
  updateWelcomeChecklist,
  type WelcomeStepId,
} from "@/lib/services/first-run-service";
import { getProductSnapshot } from "@/core/product/ProductStorage";
import { getInventoryProducts } from "@/lib/services/inventory-service";
import { getPurchases } from "@/lib/services/purchase-service";

const steps: Array<{
  id: WelcomeStepId;
  label: string;
  href: string;
}> = [
  { id: "first_product", label: "Agregar primer producto", href: "/dashboard?view=inventario&action=crear" },
  { id: "first_purchase", label: "Registrar primera compra", href: "/dashboard?view=compras&mode=nueva" },
  { id: "quick_purchase", label: "Probar compra rápida", href: "/dashboard?view=compras&mode=rapida" },
  { id: "first_feedback", label: "Enviar primer feedback", href: "/dashboard?view=ajustes&settings=feedback" },
];

export default function DashboardWelcomeChecklist() {
  const [state, setState] = useState(() => getWelcomeState());

  useEffect(() => {
    queueMicrotask(() => {
      const nextState = updateWelcomeChecklist({
        first_product: getInventoryProducts().length > 0,
        first_purchase: getPurchases().length > 0,
        first_feedback: getProductSnapshot().feedback.length > 0,
      });
      setState(nextState);
    });
  }, []);

  const completedCount = useMemo(
    () => steps.filter((step) => state.welcomeChecklist[step.id]).length,
    [state.welcomeChecklist],
  );
  const progress = Math.round((completedCount / steps.length) * 100);

  if (state.welcomeCompleted) return null;

  return (
    <section className="mb-6 rounded-[32px] border border-white/10 bg-white/[0.05] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-300">
            Bienvenida
          </p>
          <h1 className="mt-2 text-2xl font-black text-white">¡Bienvenido a homemAId!</h1>
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Estos son los primeros pasos recomendados.
          </p>
        </div>
        <div className="min-w-36 rounded-2xl bg-white/5 p-3 text-sm font-black text-white">
          {completedCount}/{steps.length} completados
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-violet-400" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {steps.map((step) => {
          const isDone = state.welcomeChecklist[step.id];

          return (
            <Link
              key={step.id}
              href={step.href}
              className="min-touch flex items-center gap-3 rounded-2xl bg-white/5 p-4 text-sm font-bold text-white/75 hover:bg-white/10"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/20 bg-black/20 text-xs">
                {isDone ? "✓" : ""}
              </span>
              {step.label}
            </Link>
          );
        })}
      </div>

      {completedCount === steps.length ? (
        <button
          type="button"
          onClick={() => setState(markWelcomeCompleted())}
          className="mt-5 rounded-2xl bg-violet-500 px-5 py-3 text-sm font-black text-white"
        >
          Finalizar bienvenida
        </button>
      ) : null}
    </section>
  );
}
