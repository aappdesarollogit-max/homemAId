"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import InventoryProductDetail from "@/components/dashboard/inventory/InventoryProductDetail";
import InventoryProductForm from "@/components/dashboard/inventory/InventoryProductForm";
import { InventoryLinkRow } from "@/components/dashboard/InventoryRows";
import AppButton from "@/components/ui/AppButton";
import AppEmptyState from "@/components/ui/AppEmptyState";
import AppMetric from "@/components/ui/AppMetric";
import AppSearch from "@/components/ui/AppSearch";
import Badge from "@/components/ui/Badge";
import { usePurchases } from "@/hooks/usePurchases";
import { useSettings } from "@/hooks/useSettings";
import { inventoryFilters } from "@/lib/dashboard-utils";
import { formatCurrency, householdSummary } from "@/lib/mock-home";
import type { InventoryProductDraft } from "@/lib/services/inventory-service";
import { useInventory } from "@/hooks/useInventory";
import type { ProductStatus } from "@/types/domain";

type InventoryViewProps = {
  activeFilter: string;
  selectedProductId?: string;
  activeAction?: string;
};

type PanelMode = "detail" | "create" | "edit";

const statusOptions: Array<{ id: ProductStatus | "todos"; label: string }> = [
  { id: "todos", label: "Todos los estados" },
  { id: "out", label: "Agotado" },
  { id: "critical", label: "Por agotarse" },
  { id: "low", label: "Stock bajo" },
  { id: "ok", label: "Stock OK" },
];

export default function InventoryView({
  activeFilter,
  selectedProductId,
}: InventoryViewProps) {
  const {
    products,
    filteredProducts,
    categories,
    isLoaded,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    createProduct,
    updateProduct,
    deleteProduct,
    markAsOpened,
  } = useInventory(activeFilter);
  const { monthlySpend } = usePurchases();
  const { settings } = useSettings();
  const [panelMode, setPanelMode] = useState<PanelMode>("detail");
  const [selectedLocalProductId, setSelectedLocalProductId] = useState(selectedProductId);
  const selectedProductCandidateId = selectedLocalProductId ?? selectedProductId;

  const selectedProduct = useMemo(
    () =>
      filteredProducts.find((product) => product.id === selectedProductCandidateId) ??
      filteredProducts[0],
    [filteredProducts, selectedProductCandidateId],
  );

  function handleCreate(product: InventoryProductDraft) {
    const newProduct = createProduct(product);
    setSelectedLocalProductId(newProduct.id);
    setPanelMode("detail");
  }

  function handleUpdate(product: InventoryProductDraft) {
    if (!selectedProduct) return;

    const updatedProduct = updateProduct(selectedProduct.id, product);
    setSelectedLocalProductId(updatedProduct?.id ?? selectedProduct.id);
    setPanelMode("detail");
  }

  function handleDelete() {
    if (!selectedProduct) return;
    const shouldDelete = window.confirm(`¿Eliminar ${selectedProduct.name} del inventario?`);

    if (!shouldDelete) return;

    const nextProducts = deleteProduct(selectedProduct.id);
    setSelectedLocalProductId(nextProducts[0]?.id);
    setPanelMode("detail");
  }

  function handleOpen(openedAt: string) {
    if (!selectedProduct) return;

    const updatedProduct = markAsOpened(selectedProduct.id, openedAt);
    setSelectedLocalProductId(updatedProduct?.id ?? selectedProduct.id);
  }

  const attentionProducts = products.filter((product) => product.status !== "ok");
  const activeHouseholdName = settings?.name ?? householdSummary.name;

  return (
    <>
      <div className="mb-6 rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-5 shadow-2xl shadow-black/10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-300">
              {activeHouseholdName}
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-normal text-white sm:text-4xl">
              Inventario del hogar
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              Productos, stock y alertas con una vista más densa para uso diario.
            </p>
          </div>
          <AppButton type="button" onClick={() => setPanelMode("create")}>
            + Agregar producto
          </AppButton>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <AppMetric label="Productos" value={String(products.length)} note="Total guardado" />
          <AppMetric
            label="Atención"
            value={String(attentionProducts.length)}
            note="Stock bajo o crítico"
          />
          <AppMetric label="Gasto este mes" value={formatCurrency(monthlySpend)} note="Compras reales" />
        </div>
      </div>

      <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_220px_220px]">
        <AppSearch
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Buscar producto..."
        />
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="min-touch rounded-2xl border border-white/10 bg-[#080b19] px-4 py-3 text-sm font-bold text-white outline-none transition duration-200 focus:border-violet-300 focus:ring-4 focus:ring-violet-500/10"
        >
          <option value="todas">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as ProductStatus | "todos")}
          className="min-touch rounded-2xl border border-white/10 bg-[#080b19] px-4 py-3 text-sm font-bold text-white outline-none transition duration-200 focus:border-violet-300 focus:ring-4 focus:ring-violet-500/10"
        >
          {statusOptions.map((status) => (
            <option key={status.id} value={status.id}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5 -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 scroll-smooth sm:mx-0 sm:px-0">
        {inventoryFilters.map((filter) => (
          <Link
            key={filter.id}
            href={`/dashboard?view=inventario&filter=${filter.id}`}
            className="shrink-0 transition duration-200 active:scale-95"
          >
            <Badge tone={activeFilter === filter.id ? "violet" : "slate"}>
              {filter.label}
            </Badge>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-3">
          {!isLoaded ? (
            <AppEmptyState
              title="Cargando inventario"
              description="Estamos preparando tus productos guardados en este dispositivo."
            />
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <InventoryLinkRow
                key={product.id}
                product={product}
                href={`/dashboard?view=inventario&filter=${activeFilter}&product=${product.id}`}
                isSelected={product.id === selectedProduct?.id}
                onSelect={() => {
                  setSelectedLocalProductId(product.id);
                  setPanelMode("detail");
                }}
              />
            ))
          ) : (
            <AppEmptyState
              title="No encontramos productos"
              description="Prueba con otra búsqueda o cambia los filtros activos."
              action={
                <AppButton type="button" onClick={() => setPanelMode("create")}>
                  Agregar producto
                </AppButton>
              }
            />
          )}
        </div>

        {panelMode === "create" ? (
          <InventoryProductForm
            title="Nuevo producto"
            description="Crea un producto y se guardará en este navegador."
            submitLabel="Guardar"
            onCancel={() => setPanelMode("detail")}
            onSubmit={handleCreate}
          />
        ) : panelMode === "edit" && selectedProduct ? (
          <InventoryProductForm
            product={selectedProduct}
            title="Editar producto"
            description="Actualiza el stock, categoría y datos principales."
            submitLabel="Guardar cambios"
            onCancel={() => setPanelMode("detail")}
            onSubmit={handleUpdate}
          />
        ) : (
          <InventoryProductDetail
            product={selectedProduct}
            onEdit={() => setPanelMode("edit")}
            onDelete={handleDelete}
            onOpen={handleOpen}
          />
        )}
      </div>
    </>
  );
}
