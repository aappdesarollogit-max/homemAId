"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PurchaseDetail from "@/components/dashboard/purchases/PurchaseDetail";
import PurchaseForm from "@/components/dashboard/purchases/PurchaseForm";
import PurchaseList from "@/components/dashboard/purchases/PurchaseList";
import SectionHeader from "@/components/dashboard/SectionHeader";
import { usePurchases } from "@/hooks/usePurchases";
import { getInventoryProducts } from "@/lib/services/inventory-service";
import type { PurchaseInput } from "@/lib/services/purchase-service";
import type { InventoryProduct } from "@/types/domain";

type PurchasesViewProps = {
  selectedPurchaseId?: string;
  activeMode?: string;
};

type PanelMode = "detail" | "create";

export default function PurchasesView({
  selectedPurchaseId,
  activeMode,
}: PurchasesViewProps) {
  const {
    filteredPurchases,
    isLoaded,
    searchTerm,
    setSearchTerm,
    addPurchase,
    removePurchase,
  } = usePurchases();
  const [inventoryProducts, setInventoryProducts] = useState<InventoryProduct[]>([]);
  const [panelMode, setPanelMode] = useState<PanelMode>(
    activeMode === "nueva" ? "create" : "detail",
  );
  const [selectedLocalPurchaseId, setSelectedLocalPurchaseId] = useState(selectedPurchaseId);
  const selectedPurchaseCandidateId = selectedLocalPurchaseId ?? selectedPurchaseId;

  useEffect(() => {
    queueMicrotask(() => setInventoryProducts(getInventoryProducts()));
  }, []);

  const selectedPurchase = useMemo(
    () =>
      filteredPurchases.find((purchase) => purchase.id === selectedPurchaseCandidateId) ??
      filteredPurchases[0],
    [filteredPurchases, selectedPurchaseCandidateId],
  );

  function handleCreate(purchaseInput: PurchaseInput) {
    const purchase = addPurchase(purchaseInput);
    setInventoryProducts(getInventoryProducts());
    setSelectedLocalPurchaseId(purchase.id);
    setPanelMode("detail");
  }

  function handleDelete() {
    if (!selectedPurchase) return;
    const shouldDelete = window.confirm(`¿Eliminar la compra de ${selectedPurchase.store}?`);

    if (!shouldDelete) return;

    const nextPurchases = removePurchase(selectedPurchase.id);
    setSelectedLocalPurchaseId(nextPurchases[0]?.id);
    setPanelMode("detail");
  }

  return (
    <>
      <SectionHeader
        eyebrow="Compras"
        title="Registro de compras"
        description="Historial de compras recientes y productos que luego alimentarán el inventario."
        action={
          <Link
            href="/dashboard?view=compras&mode=nueva"
            onClick={() => setPanelMode("create")}
            className="rounded-2xl bg-violet-500 px-5 py-3 text-sm font-black text-white"
          >
            + Nueva compra
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div>
          {!isLoaded ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-sm font-bold text-white/55">
              Cargando compras...
            </div>
          ) : (
            <PurchaseList
              purchases={filteredPurchases}
              activePurchaseId={selectedPurchase?.id}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onSelect={(id) => {
                setSelectedLocalPurchaseId(id);
                setPanelMode("detail");
              }}
            />
          )}
        </div>

        {panelMode === "create" ? (
          <PurchaseForm
            inventoryProducts={inventoryProducts}
            onCancel={() => setPanelMode("detail")}
            onSubmit={handleCreate}
          />
        ) : (
          <PurchaseDetail purchase={selectedPurchase} onDelete={handleDelete} />
        )}
      </div>
    </>
  );
}
