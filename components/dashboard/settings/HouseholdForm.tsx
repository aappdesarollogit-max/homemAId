"use client";

import { useState } from "react";
import type { HouseholdSettings } from "@/types/domain";

type HouseholdFormProps = {
  settings: HouseholdSettings;
  onSave: (settings: Partial<HouseholdSettings>) => void;
};

type HouseholdFormErrors = Partial<Record<"name" | "owner" | "currency" | "language", string>>;

export default function HouseholdForm({ settings, onSave }: HouseholdFormProps) {
  const [formValues, setFormValues] = useState({
    name: settings.name,
    owner: settings.owner,
    currency: settings.currency,
    language: settings.language,
  });
  const [errors, setErrors] = useState<HouseholdFormErrors>({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: HouseholdFormErrors = {};

    if (!formValues.name.trim()) nextErrors.name = "Nombre obligatorio";
    if (!formValues.owner.trim()) nextErrors.owner = "Responsable obligatorio";
    if (!formValues.currency.trim()) nextErrors.currency = "Moneda obligatoria";
    if (!formValues.language.trim()) nextErrors.language = "Idioma obligatorio";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSave(formValues);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 text-slate-950">
      <h2 className="text-2xl font-black">Información del hogar</h2>
      <p className="mt-2 text-sm text-slate-500">Datos base que usa el dashboard y el asistente.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          ["name", "Nombre del hogar"],
          ["owner", "Responsable"],
          ["currency", "Moneda"],
          ["language", "Idioma"],
        ].map(([field, label]) => (
          <label key={field} className="block">
            <span className="mb-2 block text-xs font-black text-slate-600">{label}</span>
            <input
              value={formValues[field as keyof typeof formValues]}
              onChange={(event) =>
                setFormValues((currentValues) => ({
                  ...currentValues,
                  [field]: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-400"
            />
            {errors[field as keyof HouseholdFormErrors] ? (
              <span className="mt-1 block text-xs font-bold text-red-500">
                {errors[field as keyof HouseholdFormErrors]}
              </span>
            ) : null}
          </label>
        ))}
      </div>

      <button
        type="submit"
        className="mt-6 rounded-2xl bg-violet-500 px-5 py-3 text-sm font-black text-white"
      >
        Guardar información
      </button>
    </form>
  );
}
