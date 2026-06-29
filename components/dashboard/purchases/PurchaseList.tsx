"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/mock-home";
import type { Purchase } from "@/types/domain";

type PurchaseListProps = {
  purchases: Purchase[];
  activePurchaseId?: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSelect: (id: string) => void;
};

export default function PurchaseList({
  purchases,
  activePurchaseId,
  searchTerm,
  onSearchChange,
  onSelect,
}: PurchaseListProps) {
  return (
    <div className="space-y-5">
      <input
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Buscar por tienda o producto..."
        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/35 focus:border-violet-400"
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {purchases.map((purchase) => {
          const isSelected = purchase.id === activePurchaseId;

          return (
            <Link
              key={purchase.id}
              href={`/dashboard?view=compras&purchase=${purchase.id}`}
              onClick={() => onSelect(purchase.id)}
              className={`rounded-3xl border p-6 transition ${
                isSelected
                  ? "border-violet-400 bg-violet-500/20"
                  : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-black">{purchase.store}</p>
                  <p className="mt-1 text-sm text-white/50">{purchase.date}</p>
                </div>
                <p className="font-black text-violet-300">{formatCurrency(purchase.total)}</p>
              </div>
              <p className="mt-5 text-sm font-semibold text-white/55">
                {purchase.items.length} producto{purchase.items.length === 1 ? "" : "s"} registrado
              </p>
            </Link>
          );
        })}
      </div>

      {purchases.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-sm font-bold text-white/55">
          {searchTerm.trim()
            ? "No hay compras que coincidan con la búsqueda."
            : "Agrega tu primera compra."}
        </div>
      ) : null}
    </div>
  );
}
