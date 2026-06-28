"use client";

import { useState } from "react";
import type { InventoryProductDraft } from "@/lib/services/inventory-service";
import type { InventoryProduct } from "@/types/domain";

type InventoryProductFormProps = {
  product?: InventoryProduct;
  title: string;
  description: string;
  submitLabel: string;
  className?: string;
  onCancel: () => void;
  onSubmit: (product: InventoryProductDraft) => void;
};

type InventoryFormErrors = Partial<Record<keyof InventoryProductDraft, string>>;

function readNumber(value: string) {
  return Number.isNaN(Number(value)) ? 0 : Number(value);
}

function validateForm(product: InventoryProductDraft) {
  const errors: InventoryFormErrors = {};

  if (!product.name.trim()) errors.name = "Nombre obligatorio";
  if (!product.category.trim()) errors.category = "Categoría obligatoria";
  if (!product.unit.trim()) errors.unit = "Unidad obligatoria";
  if (product.currentStock < 0) errors.currentStock = "No puede ser negativo";
  if (product.minimumStock < 0) errors.minimumStock = "No puede ser negativo";
  if (product.estimatedDaysLeft < 0) errors.estimatedDaysLeft = "No puede ser negativo";

  return errors;
}

export default function InventoryProductForm({
  product,
  title,
  description,
  submitLabel,
  className = "",
  onCancel,
  onSubmit,
}: InventoryProductFormProps) {
  const [formProduct, setFormProduct] = useState<InventoryProductDraft>({
    name: product?.name ?? "",
    category: product?.category ?? "",
    currentStock: product?.currentStock ?? 0,
    minimumStock: product?.minimumStock ?? 0,
    unit: product?.unit ?? "unidad",
    estimatedDaysLeft: product?.estimatedDaysLeft ?? 0,
    icon: product?.icon ?? "□",
    openedAt: product?.openedAt,
    isOpened: product?.isOpened ?? false,
  });
  const [errors, setErrors] = useState<InventoryFormErrors>({});

  function updateField<Key extends keyof InventoryProductDraft>(
    field: Key,
    value: InventoryProductDraft[Key],
  ) {
    setFormProduct((currentProduct) => ({
      ...currentProduct,
      [field]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm(formProduct);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;
    onSubmit(formProduct);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex max-h-[calc(100dvh-150px)] flex-col overflow-hidden rounded-3xl bg-white p-5 text-slate-950 ${className}`}
    >
      <div className="shrink-0">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-violet-600">
          {title}
        </p>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      </div>

      <div className="mt-5 min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
        <label className="block">
          <span className="mb-2 block text-xs font-black text-slate-600">Nombre</span>
          <input
            value={formProduct.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="min-touch w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-400"
          />
          {errors.name ? <span className="mt-1 block text-xs font-bold text-red-500">{errors.name}</span> : null}
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-black text-slate-600">Categoría</span>
            <input
              value={formProduct.category}
              onChange={(event) => updateField("category", event.target.value)}
              className="min-touch w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-400"
            />
            {errors.category ? <span className="mt-1 block text-xs font-bold text-red-500">{errors.category}</span> : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-black text-slate-600">Icono</span>
            <input
              value={formProduct.icon}
              onChange={(event) => updateField("icon", event.target.value)}
              className="min-touch w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-400"
            />
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-black text-slate-600">Stock actual</span>
            <input
              type="number"
              min={0}
              value={formProduct.currentStock}
              onChange={(event) => updateField("currentStock", readNumber(event.target.value))}
              className="min-touch w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-400"
            />
            {errors.currentStock ? <span className="mt-1 block text-xs font-bold text-red-500">{errors.currentStock}</span> : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-black text-slate-600">Stock mínimo</span>
            <input
              type="number"
              min={0}
              value={formProduct.minimumStock}
              onChange={(event) => updateField("minimumStock", readNumber(event.target.value))}
              className="min-touch w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-400"
            />
            {errors.minimumStock ? <span className="mt-1 block text-xs font-bold text-red-500">{errors.minimumStock}</span> : null}
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-black text-slate-600">Unidad</span>
            <input
              value={formProduct.unit}
              onChange={(event) => updateField("unit", event.target.value)}
              className="min-touch w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-400"
            />
            {errors.unit ? <span className="mt-1 block text-xs font-bold text-red-500">{errors.unit}</span> : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-black text-slate-600">Días estimados</span>
            <input
              type="number"
              min={0}
              value={formProduct.estimatedDaysLeft}
              onChange={(event) =>
                updateField("estimatedDaysLeft", readNumber(event.target.value))
              }
              className="min-touch w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-400"
            />
            {errors.estimatedDaysLeft ? (
              <span className="mt-1 block text-xs font-bold text-red-500">
                {errors.estimatedDaysLeft}
              </span>
            ) : null}
          </label>
        </div>
      </div>

      <div className="sticky bottom-0 z-20 -mx-5 mt-5 grid shrink-0 gap-3 bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+88px)] pt-3 sm:grid-cols-2 xl:pb-1">
        <button
          type="button"
          onClick={onCancel}
          className="min-touch rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-black text-slate-700"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="min-touch rounded-2xl bg-violet-500 px-4 py-3 text-sm font-black text-white"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
