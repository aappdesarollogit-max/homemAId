"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ContextHelp from "@/components/ui/ContextHelp";
import {
  completeOnboarding,
  markStarted,
  type OnboardingMode,
} from "@/lib/services/first-run-service";

type OnboardingForm = {
  householdName: string;
  owner: string;
  memberCount: string;
  monthlyBudget: string;
  currency: string;
  favoriteStore: string;
  mode: OnboardingMode;
};

const initialForm: OnboardingForm = {
  householdName: "",
  owner: "",
  memberCount: "1",
  monthlyBudget: "0",
  currency: "CLP",
  favoriteStore: "",
  mode: "empty",
};

function sanitizeIntegerInput(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return digits.replace(/^0+(?=\d)/, "");
}

function parseIntegerInput(value: string, fallback: number) {
  const parsedValue = Number(sanitizeIntegerInput(value));
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formValues, setFormValues] = useState(initialForm);
  const canContinue = useMemo(() => {
    if (step === 2) {
      return Boolean(formValues.householdName.trim() && formValues.owner.trim());
    }

    if (step === 3) {
      return parseIntegerInput(formValues.monthlyBudget, 0) >= 0 && Boolean(formValues.currency.trim());
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
    completeOnboarding({
      ...formValues,
      memberCount: parseIntegerInput(formValues.memberCount, 1),
      monthlyBudget: parseIntegerInput(formValues.monthlyBudget, 0),
    });
    router.push("/dashboard");
  }

  function handleNumericFocus(event: React.FocusEvent<HTMLInputElement>) {
    if (event.currentTarget.value === "0") {
      event.currentTarget.select();
    }
  }

  return (
    <main className="h-[100dvh] overflow-y-auto bg-[#060814] px-4 py-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] text-white sm:px-6 sm:py-10">
      <section className="mx-auto flex min-h-[calc(100dvh-3rem)] max-w-3xl items-center">
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
                className="min-touch mt-8 rounded-2xl bg-violet-500 px-6 py-4 font-black text-white"
              >
                Comenzar
              </button>
            </div>
          ) : null}

          {step === 2 ? (
            <div>
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-3xl font-black">Datos del hogar</h1>
                <ContextHelp text="Estos datos solo quedan en este navegador durante la Alpha." />
              </div>
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
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formValues.memberCount}
                    onFocus={handleNumericFocus}
                    onChange={(event) =>
                      updateField("memberCount", sanitizeIntegerInput(event.target.value))
                    }
                    className="min-touch w-full rounded-2xl border border-white/10 bg-white px-4 py-3 font-bold text-slate-950 outline-none focus:border-violet-400"
                  />
                </label>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div>
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-3xl font-black">Presupuesto y compras</h1>
                <ContextHelp text="El presupuesto ayuda a calcular consumo cuando registres compras." />
              </div>
              <div className="mt-6 grid gap-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-white/75">
                    Presupuesto mensual
                  </span>
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formValues.monthlyBudget}
                    onFocus={handleNumericFocus}
                    onChange={(event) =>
                      updateField("monthlyBudget", sanitizeIntegerInput(event.target.value))
                    }
                    className="min-touch w-full rounded-2xl border border-white/10 bg-white px-4 py-3 font-bold text-slate-950 outline-none focus:border-violet-400"
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
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-3xl font-black">¿Cómo quieres comenzar?</h1>
                <ContextHelp text="El modo demo carga ejemplos. El hogar vacío empieza sin productos ni compras." />
              </div>
              <div className="mt-6 grid gap-4">
                <label
                  htmlFor="onboarding-mode-empty"
                  className={`block cursor-pointer rounded-3xl border p-5 transition ${
                    formValues.mode === "empty"
                      ? "border-violet-300 bg-violet-500/20"
                      : "border-white/10 bg-white/[0.04]"
                  }`}
                >
                  <div className="flex gap-3">
                    <input
                      id="onboarding-mode-empty"
                      type="radio"
                      name="mode"
                      checked={formValues.mode === "empty"}
                      onChange={() => updateField("mode", "empty")}
                      className="min-touch mt-1 h-11 w-11 accent-violet-400"
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
                <label
                  htmlFor="onboarding-mode-demo"
                  className={`block cursor-pointer rounded-3xl border p-5 transition ${
                    formValues.mode === "demo"
                      ? "border-violet-300 bg-violet-500/20"
                      : "border-white/10 bg-white/[0.04]"
                  }`}
                >
                  <div className="flex gap-3">
                    <input
                      id="onboarding-mode-demo"
                      type="radio"
                      name="mode"
                      checked={formValues.mode === "demo"}
                      onChange={() => updateField("mode", "demo")}
                      className="min-touch mt-1 h-11 w-11 accent-violet-400"
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
            <div className="sticky bottom-0 -mx-6 mt-8 flex flex-col gap-3 border-t border-white/10 bg-[#060814]/95 px-6 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-4 backdrop-blur sm:-mx-8 sm:flex-row sm:justify-between sm:px-8">
              <button
                type="button"
                onClick={() => setStep((currentStep) => Math.max(1, currentStep - 1))}
                className="min-touch rounded-2xl border border-white/15 px-5 py-3 text-sm font-black text-white"
              >
                Atrás
              </button>
              {step < 4 ? (
                <button
                  type="button"
                  disabled={!canContinue}
                  onClick={() => setStep((currentStep) => currentStep + 1)}
                  className="min-touch rounded-2xl bg-violet-500 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/45"
                >
                  Continuar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  className="min-touch rounded-2xl bg-violet-500 px-5 py-3 text-sm font-black text-white"
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
