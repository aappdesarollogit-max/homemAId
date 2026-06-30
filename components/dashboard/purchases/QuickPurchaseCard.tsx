"use client";

import { useEffect, useRef, useState } from "react";
import { formatCurrency } from "@/lib/mock-home";
import type { ParsedPurchase } from "@/core/platform/input/InputTypes";

type QuickPurchaseCardProps = {
  onAnalyze: (text: string) => ParsedPurchase;
  onConfirm: (text: string) => void;
  shouldFocus?: boolean;
};

const exampleText = "Compré 2 leches, pan y detergente en Lider por $18.500";

export default function QuickPurchaseCard({
  onAnalyze,
  onConfirm,
  shouldFocus = false,
}: QuickPurchaseCardProps) {
  const [text, setText] = useState("");
  const [parsedPurchase, setParsedPurchase] = useState<ParsedPurchase>();
  const [error, setError] = useState<string>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canConfirm = Boolean(parsedPurchase && parsedPurchase.products.length > 0);

  useEffect(() => {
    if (!shouldFocus) return;

    queueMicrotask(() => {
      textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      textareaRef.current?.focus({ preventScroll: true });
    });
  }, [shouldFocus]);

  function handleAnalyze() {
    try {
      const result = onAnalyze(text);
      setParsedPurchase(result);
      setError(result.errors[0]);
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : "No se pudo analizar.");
    }
  }

  function handleConfirm() {
    if (!canConfirm) return;
    onConfirm(text);
    setText("");
    setParsedPurchase(undefined);
    setError(undefined);
  }

  function handleCancel() {
    setParsedPurchase(undefined);
    setError(undefined);
  }

  return (
    <section
      className={`mb-6 rounded-3xl border p-5 transition ${
        shouldFocus
          ? "border-violet-300 bg-violet-500/10 shadow-2xl shadow-violet-950/30"
          : "border-white/10 bg-white/[0.04]"
      }`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-300">
            Compra rápida
          </p>
          <h2 className="mt-2 text-2xl font-black">Registrar con texto</h2>
        </div>
        {parsedPurchase ? (
          <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-black text-violet-200">
            Confianza {parsedPurchase.confidence}%
          </span>
        ) : null}
      </div>

      <textarea
        ref={textareaRef}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={`Ejemplo:\n${exampleText}`}
        rows={4}
        className="mt-4 min-h-32 w-full resize-y rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/35 focus:border-violet-400"
      />

      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleAnalyze}
          className="min-touch rounded-2xl bg-violet-500 px-5 py-3 text-sm font-black text-white"
        >
          Analizar compra
        </button>
        {parsedPurchase ? (
          <>
            <button
              type="button"
              onClick={() => setParsedPurchase(undefined)}
              className="min-touch rounded-2xl border border-white/10 px-5 py-3 text-sm font-black text-white"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!canConfirm}
              className="min-touch rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Confirmar compra
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="min-touch rounded-2xl bg-white/5 px-5 py-3 text-sm font-black text-white"
            >
              Cancelar
            </button>
          </>
        ) : null}
      </div>

      {error ? <p className="mt-3 text-sm font-bold text-red-300">{error}</p> : null}

      {parsedPurchase ? (
        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_220px]">
          <div className="rounded-2xl bg-black/20 p-4">
            <p className="text-sm font-black text-violet-200">Productos detectados</p>
            <div className="mt-3 space-y-2">
              {parsedPurchase.products.length > 0 ? (
                parsedPurchase.products.map((product) => (
                  <div
                    key={`${product.productName}-${product.quantity}`}
                    className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-2"
                  >
                    <span className="text-sm font-bold">{product.productName}</span>
                    <span className="text-xs font-black text-white/55">
                      {product.quantity} {product.unit}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm font-bold text-white/55">No se detectaron productos.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-black/20 p-4">
            <p className="text-sm font-black text-violet-200">Resumen</p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-white/50">Tienda</dt>
                <dd className="font-black">{parsedPurchase.store ?? "Entrada de texto"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-white/50">Monto</dt>
                <dd className="font-black">
                  {parsedPurchase.totalAmount ? formatCurrency(parsedPurchase.totalAmount) : "$0"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-white/50">Fecha</dt>
                <dd className="font-black">{parsedPurchase.date ?? "Hoy"}</dd>
              </div>
            </dl>
          </div>

          {parsedPurchase.warnings.length > 0 ? (
            <div className="rounded-2xl bg-orange-500/10 p-4 lg:col-span-2">
              <p className="text-sm font-black text-orange-200">Warnings</p>
              <ul className="mt-2 space-y-1 text-sm font-bold text-orange-100/80">
                {parsedPurchase.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
