"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import InventoryProductDetail from "@/components/dashboard/inventory/InventoryProductDetail";
import InventoryProductForm from "@/components/dashboard/inventory/InventoryProductForm";
import { InventoryLinkRow } from "@/components/dashboard/InventoryRows";
import SectionHeader from "@/components/dashboard/SectionHeader";
import Badge from "@/components/ui/Badge";
import { inventoryFilters } from "@/lib/dashboard-utils";
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

  return (
    <>
      <SectionHeader
        eyebrow="Inventario"
        title="Productos del hogar"
        description="Vista central para controlar stock, productos abiertos y próximos agotamientos."
        action={
          <button
            type="button"
            onClick={() => setPanelMode("create")}
            className="rounded-2xl bg-violet-500 px-5 py-3 text-sm font-black text-white"
          >
            + Agregar producto
          </button>
        }
      />

      <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_220px_220px]">
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Buscar producto..."
          className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/35 focus:border-violet-400"
        />
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="rounded-2xl border border-white/10 bg-[#080b19] px-4 py-3 text-sm font-bold text-white outline-none focus:border-violet-400"
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
          className="rounded-2xl border border-white/10 bg-[#080b19] px-4 py-3 text-sm font-bold text-white outline-none focus:border-violet-400"
        >
          {statusOptions.map((status) => (
            <option key={status.id} value={status.id}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {inventoryFilters.map((filter) => (
          <Link key={filter.id} href={`/dashboard?view=inventario&filter=${filter.id}`}>
            <Badge tone={activeFilter === filter.id ? "violet" : "slate"}>
              {filter.label}
            </Badge>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-3">
          {!isLoaded ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-sm font-bold text-white/55">
              Cargando inventario...
            </div>
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
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-sm font-bold text-white/55">
              No hay productos que coincidan con la búsqueda.
            </div>
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
