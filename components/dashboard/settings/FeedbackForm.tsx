"use client";

import { useState } from "react";
import AnalyticsEngine from "@/core/product/AnalyticsEngine";
import FeedbackEngine from "@/core/product/FeedbackEngine";
import type { FeedbackType, ProductPriority } from "@/core/product/ProductTypes";
import { getReleaseLabel } from "@/lib/release";

const feedbackTypes: FeedbackType[] = [
  "BUG",
  "MEJORA",
  "IDEA",
  "CONFUSIÓN",
  "PREGUNTA",
  "PERFORMANCE",
  "UX",
  "OTRO",
];

const priorities: ProductPriority[] = ["Crítica", "Alta", "Media", "Baja"];

export default function FeedbackForm() {
  const [formValues, setFormValues] = useState({
    usuario: "Alpha user",
    pantalla: "Ajustes",
    tipo: "MEJORA" as FeedbackType,
    descripcion: "",
    queEsperaba: "",
    prioridad: "Media" as ProductPriority,
    captura: "",
    logs: "",
  });
  const [sentMessage, setSentMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formValues.descripcion.trim()) return;

    const feedbackEngine = new FeedbackEngine();
    const analyticsEngine = new AnalyticsEngine();

    feedbackEngine.createFeedback({
      ...formValues,
      version: getReleaseLabel(),
    });
    analyticsEngine.track({
      tipo: "feedback.enviado",
      pantalla: formValues.pantalla,
      usuario: formValues.usuario,
      metadata: {
        feedbackType: formValues.tipo,
        priority: formValues.prioridad,
      },
    });

    setFormValues((currentValues) => ({
      ...currentValues,
      descripcion: "",
      queEsperaba: "",
      captura: "",
      logs: "",
    }));
    setSentMessage("Feedback enviado. Gracias por ayudar a mejorar homemAId.");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 text-slate-950">
      <h2 className="text-2xl font-black">Enviar Feedback</h2>
      <p className="mt-2 text-sm text-slate-500">
        Cuéntanos qué pasó, qué esperabas y en qué pantalla ocurrió.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs font-black text-slate-600">Tipo</span>
          <select
            value={formValues.tipo}
            onChange={(event) =>
              setFormValues((currentValues) => ({
                ...currentValues,
                tipo: event.target.value as FeedbackType,
              }))
            }
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-400"
          >
            {feedbackTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-black text-slate-600">Prioridad</span>
          <select
            value={formValues.prioridad}
            onChange={(event) =>
              setFormValues((currentValues) => ({
                ...currentValues,
                prioridad: event.target.value as ProductPriority,
              }))
            }
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-400"
          >
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-2 block text-xs font-black text-slate-600">Descripción</span>
        <textarea
          value={formValues.descripcion}
          onChange={(event) =>
            setFormValues((currentValues) => ({
              ...currentValues,
              descripcion: event.target.value,
            }))
          }
          rows={4}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-400"
        />
      </label>

      <label className="mt-4 block">
        <span className="mb-2 block text-xs font-black text-slate-600">Qué esperabas</span>
        <textarea
          value={formValues.queEsperaba}
          onChange={(event) =>
            setFormValues((currentValues) => ({
              ...currentValues,
              queEsperaba: event.target.value,
            }))
          }
          rows={3}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-400"
        />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-500">
          Adjuntar captura estará disponible próximamente.
        </p>
        <input
          value={formValues.logs}
          onChange={(event) =>
            setFormValues((currentValues) => ({
              ...currentValues,
              logs: event.target.value,
            }))
          }
          placeholder="Logs opcionales"
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-400"
        />
      </div>

      <button
        type="submit"
        className="mt-6 rounded-2xl bg-violet-500 px-5 py-3 text-sm font-black text-white"
      >
        Enviar
      </button>
      {sentMessage ? <p className="mt-3 text-sm font-bold text-emerald-600">{sentMessage}</p> : null}
    </form>
  );
}
