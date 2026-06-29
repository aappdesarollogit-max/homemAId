"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  completeOnboarding,
  markStarted,
  type OnboardingMode,
} from "@/lib/services/first-run-service";

type OnboardingForm = {
  householdName: string;
  owner: string;
  memberCount: number;
  monthlyBudget: number;
  currency: string;
  favoriteStore: string;
  mode: OnboardingMode;
};

const initialForm: OnboardingForm = {
  householdName: "",
  owner: "",
  memberCount: 1,
  monthlyBudget: 0,
  currency: "CLP",
  favoriteStore: "",
  mode: "empty",
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formValues, setFormValues] = useState(initialForm);
  const canContinue = useMemo(() => {
    if (step === 2) {
      return Boolean(formValues.householdName.trim() && formValues.owner.trim());
    }

    if (step === 3) {
      return formValues.monthlyBudget >= 0 && Boolean(formValues.currency.trim());
    }

    return true;
  }, [formValues, step]);

  function updateField<Key extends keyof OnboardingForm>(
    key: Key,
    value: OnboardingForm[Key],
  ) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));
  }

  function handleStart() {
    markStarted();
    setStep(2);
  }

  function handleFinish() {
    completeOnboarding(formValues);
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#060814] px-6 py-10 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center">
        <div className="w-full rounded-[32px] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/30 sm:p-8">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-300">
                First Run
              </p>
              <p className="mt-2 text-sm font-bold text-white/50">Paso {step} de 4</p>
            </div>
            <div className="h-2 w-32 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-violet-400 transition-all"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {step === 1 ? (
            <div>
              <h1 className="text-4xl font-black">Bienvenido a homemAId</h1>
              <p className="mt-4 text-lg leading-relaxed text-white/70">
                Configuraremos tu hogar en menos de un minuto.
              </p>
              <button
                type="button"
                onClick={handleStart}
                className="mt-8 rounded-2xl bg-violet-500 px-6 py-4 font-black text-white"
              >
                Comenzar
              </button>
            </div>
          ) : null}

          {step === 2 ? (
            <div>
              <h1 className="text-3xl font-black">Datos del hogar</h1>
              <div className="mt-6 grid gap-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-white/75">
                    Nombre del hogar
                  </span>
                  <input
                    value={formValues.householdName}
                    onChange={(event) => updateField("householdName", event.target.value)}
                    placeholder="Casa, Departamento, Familia..."
                    className="w-full rounded-2xl border border-white/10 bg-white px-4 py-3 font-bold text-slate-950 outline-none focus:border-violet-400"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-white/75">
                    Responsable
                  </span>
                  <input
                    value={formValues.owner}
                    onChange={(event) => updateField("owner", event.target.value)}
                    placeholder="Nombre de quien administrará el hogar"
                    className="w-full rounded-2xl border border-white/10 bg-white px-4 py-3 font-bold text-slate-950 outline-none focus:border-violet-400"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-white/75">
                    Cantidad de integrantes
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={formValues.memberCount}
                    onChange={(event) =>
                      updateField("memberCount", Number(event.target.value))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white px-4 py-3 font-bold text-slate-950 outline-none focus:border-violet-400"
                  />
                </label>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div>
              <h1 className="text-3xl font-black">Presupuesto y compras</h1>
              <div className="mt-6 grid gap-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-white/75">
                    Presupuesto mensual
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={formValues.monthlyBudget}
                    onChange={(event) =>
                      updateField("monthlyBudget", Number(event.target.value))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white px-4 py-3 font-bold text-slate-950 outline-none focus:border-violet-400"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-white/75">
                    Moneda
                  </span>
                  <select
                    value={formValues.currency}
                    onChange={(event) => updateField("currency", event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white px-4 py-3 font-bold text-slate-950 outline-none focus:border-violet-400"
                  >
                    <option value="CLP">CLP</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-white/75">
                    Supermercado habitual (opcional)
                  </span>
                  <input
                    value={formValues.favoriteStore}
                    onChange={(event) => updateField("favoriteStore", event.target.value)}
                    placeholder="Ej: Lider, Jumbo, Unimarc"
                    className="w-full rounded-2xl border border-white/10 bg-white px-4 py-3 font-bold text-slate-950 outline-none focus:border-violet-400"
                  />
                </label>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div>
              <h1 className="text-3xl font-black">¿Cómo quieres comenzar?</h1>
              <div className="mt-6 grid gap-4">
                <label className="block cursor-pointer rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex gap-3">
                    <input
                      type="radio"
                      name="mode"
                      checked={formValues.mode === "empty"}
                      onChange={() => updateField("mode", "empty")}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-black">Empezar con mi hogar vacío</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">
                        Comenzarás sin productos ni compras. Es ideal si quieres registrar
                        sólo datos reales desde el primer día.
                      </p>
                    </div>
                  </div>
                </label>
                <label className="block cursor-pointer rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex gap-3">
                    <input
                      type="radio"
                      name="mode"
                      checked={formValues.mode === "demo"}
                      onChange={() => updateField("mode", "demo")}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-black">Cargar datos de ejemplo</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">
                        Verás inventario, compras y consumo demo para explorar la app.
                        Podrás volver a comenzar desde cero cuando quieras.
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          ) : null}

          {step > 1 ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => setStep((currentStep) => Math.max(1, currentStep - 1))}
                className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-black text-white"
              >
                Atrás
              </button>
              {step < 4 ? (
                <button
                  type="button"
                  disabled={!canContinue}
                  onClick={() => setStep((currentStep) => currentStep + 1)}
                  className="rounded-2xl bg-violet-500 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/45"
                >
                  Continuar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  className="rounded-2xl bg-violet-500 px-5 py-3 text-sm font-black text-white"
                >
                  Ir al Dashboard
                </button>
              )}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
