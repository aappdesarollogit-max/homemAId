"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/mock-home";
import type { HouseholdSettings } from "@/types/domain";

type BudgetSettingsProps = {
  settings: HouseholdSettings;
  monthlySpend: number;
  onSave: (settings: Partial<HouseholdSettings>) => void;
};

export default function BudgetSettings({
  settings,
  monthlySpend,
  onSave,
}: BudgetSettingsProps) {
  const [monthlyBudget, setMonthlyBudget] = useState(settings.monthlyBudget);
  const [budgetAlertThreshold, setBudgetAlertThreshold] = useState(
    settings.budgetAlertThreshold,
  );
  const [error, setError] = useState("");
  const usage = settings.monthlyBudget > 0 ? Math.round((monthlySpend / settings.monthlyBudget) * 100) : 0;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (monthlyBudget < 0) {
      setError("El presupuesto no puede ser negativo");
      return;
    }

    if (budgetAlertThreshold < 1 || budgetAlertThreshold > 100) {
      setError("El umbral debe estar entre 1 y 100");
      return;
    }

    setError("");
    onSave({
      monthlyBudget,
      budgetAlertThreshold,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 text-slate-950">
      <h2 className="text-2xl font-black">Presupuesto</h2>
      <p className="mt-2 text-sm text-slate-500">Control mensual base para medir gasto y alertas.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs font-black text-slate-600">Presupuesto mensual</span>
          <input
            type="number"
            min={0}
            value={monthlyBudget}
            onChange={(event) => setMonthlyBudget(Number(event.target.value))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-400"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-black text-slate-600">Umbral de alerta</span>
          <input
            type="number"
            min={1}
            max={100}
            value={budgetAlertThreshold}
            onChange={(event) => setBudgetAlertThreshold(Number(event.target.value))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-400"
          />
        </label>
      </div>

      <div className="mt-6 rounded-3xl bg-slate-50 p-5">
        <p className="text-sm font-bold text-slate-500">Gasto actual</p>
        <p className="mt-2 text-3xl font-black text-violet-600">{formatCurrency(monthlySpend)}</p>
        <div className="mt-5 h-3 rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-violet-500"
            style={{ width: `${Math.min(100, usage)}%` }}
          />
        </div>
        <p className="mt-3 text-sm font-bold text-slate-500">{usage}% usado</p>
      </div>

      {error ? <p className="mt-4 text-sm font-bold text-red-500">{error}</p> : null}

      <button
        type="submit"
        className="mt-6 rounded-2xl bg-violet-500 px-5 py-3 text-sm font-black text-white"
      >
        Guardar presupuesto
      </button>
    </form>
  );
}
