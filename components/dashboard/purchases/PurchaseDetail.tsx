"use client";

import { formatCurrency } from "@/lib/mock-home";
import type { Purchase } from "@/types/domain";

type PurchaseDetailProps = {
  purchase?: Purchase;
  onDelete: () => void;
};

export default function PurchaseDetail({ purchase, onDelete }: PurchaseDetailProps) {
  if (!purchase) {
    return (
      <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-300">
          Detalle
        </p>
        <p className="mt-5 text-sm text-white/55">No hay compras para mostrar.</p>
      </aside>
    );
  }

  return (
    <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-300">
        Detalle
      </p>
      <h2 className="mt-3 text-2xl font-black">{purchase.store}</h2>
      <p className="mt-1 text-sm text-white/50">{purchase.date}</p>

      <div className="mt-6 space-y-3">
        {purchase.items.map((item, index) => (
          <div key={`${item.productName}-${index}`} className="rounded-2xl bg-white/5 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-bold">{item.productName}</p>
                <p className="mt-1 text-sm text-white/50">
                  {item.quantity} {item.unit}
                </p>
              </div>
              <p className="font-black">{formatCurrency(item.price)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
        <span className="text-sm font-bold text-white/55">Total</span>
        <span className="text-2xl font-black text-violet-300">
          {formatCurrency(purchase.total)}
        </span>
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="mt-5 w-full rounded-2xl bg-red-500/15 px-4 py-3 text-sm font-black text-red-200 hover:bg-red-500/25"
      >
        Eliminar compra
      </button>
    </aside>
  );
}
