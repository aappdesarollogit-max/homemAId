"use client";

import { useState } from "react";
import Badge from "@/components/ui/Badge";
import { statusTone } from "@/lib/dashboard-utils";
import type { InventoryProduct } from "@/types/domain";

type InventoryProductDetailProps = {
  product?: InventoryProduct;
  onEdit: () => void;
  onDelete: () => void;
  onOpen: (openedAt: string) => void;
};

function todayValue() {
  return new Date().toISOString().slice(0, 10);
}

export default function InventoryProductDetail({
  product,
  onEdit,
  onDelete,
  onOpen,
}: InventoryProductDetailProps) {
  const [openedAt, setOpenedAt] = useState(product?.openedAt ?? todayValue());

  if (!product) {
    return (
      <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-300">
          Producto
        </p>
        <p className="mt-5 text-sm text-white/55">No hay productos para mostrar.</p>
      </aside>
    );
  }

  return (
    <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-300">
        Producto
      </p>
      <div className="mt-5 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-4xl">
          {product.icon}
        </div>
        <div>
          <h2 className="text-2xl font-black">{product.name}</h2>
          <p className="mt-1 text-sm text-white/50">{product.category}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
          <span className="text-sm font-bold text-white/55">Estado</span>
          <Badge tone={statusTone(product.status)}>{product.statusLabel}</Badge>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
          <span className="text-sm font-bold text-white/55">Cantidad</span>
          <span className="font-black">{product.quantity}</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
          <span className="text-sm font-bold text-white/55">Stock mínimo</span>
          <span className="font-black">
            {product.minimumStock} {product.unit}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
          <span className="text-sm font-bold text-white/55">Duración estimada</span>
          <span className="font-black">{product.estimatedDaysLeft} días</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
          <span className="text-sm font-bold text-white/55">Abierto el</span>
          <span className="font-black">{product.openedAt ?? "Sin registrar"}</span>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-white p-5 text-slate-950">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-violet-600">
          Registrar apertura
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Guarda la fecha en que este producto empezó a usarse.
        </p>
        <label className="mt-5 block">
          <span className="mb-2 block text-xs font-black text-slate-600">Fecha</span>
          <input
            type="date"
            value={openedAt}
            onChange={(event) => setOpenedAt(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-400"
          />
        </label>
        <button
          type="button"
          onClick={() => onOpen(openedAt || todayValue())}
          className="mt-5 w-full rounded-2xl bg-violet-500 px-5 py-3 text-sm font-black text-white hover:bg-violet-400"
        >
          Marcar como abierto
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-2xl bg-white/5 px-4 py-3 text-sm font-black text-white hover:bg-white/10"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-2xl bg-red-500/15 px-4 py-3 text-sm font-black text-red-200 hover:bg-red-500/25"
        >
          Eliminar
        </button>
      </div>
    </aside>
  );
}
