"use client";

import { useState } from "react";
import type { HouseholdSettings } from "@/types/domain";

type PreferencesFormProps = {
  settings: HouseholdSettings;
  onSave: (settings: Partial<HouseholdSettings>) => void;
};

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function PreferencesForm({ settings, onSave }: PreferencesFormProps) {
  const [favoriteStores, setFavoriteStores] = useState(settings.favoriteStores.join(", "));
  const [priorityCategories, setPriorityCategories] = useState(
    settings.priorityCategories.join(", "),
  );
  const [purchaseFrequency, setPurchaseFrequency] = useState(settings.purchaseFrequency);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({
      favoriteStores: splitList(favoriteStores),
      priorityCategories: splitList(priorityCategories),
      purchaseFrequency,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 text-slate-950">
      <h2 className="text-2xl font-black">Preferencias</h2>
      <p className="mt-2 text-sm text-slate-500">Define hábitos y prioridades de compra.</p>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs font-black text-slate-600">Supermercados favoritos</span>
          <input
            value={favoriteStores}
            onChange={(event) => setFavoriteStores(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-400"
          />
          <span className="mt-1 block text-xs font-bold text-slate-400">Separados por coma</span>
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-black text-slate-600">Categorías prioritarias</span>
          <input
            value={priorityCategories}
            onChange={(event) => setPriorityCategories(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-400"
          />
          <span className="mt-1 block text-xs font-bold text-slate-400">Separadas por coma</span>
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-black text-slate-600">Frecuencia de compra</span>
          <select
            value={purchaseFrequency}
            onChange={(event) => setPurchaseFrequency(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-400"
          >
            <option>Diaria</option>
            <option>Semanal</option>
            <option>Quincenal</option>
            <option>Mensual</option>
          </select>
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 rounded-2xl bg-violet-500 px-5 py-3 text-sm font-black text-white"
      >
        Guardar preferencias
      </button>
    </form>
  );
}
