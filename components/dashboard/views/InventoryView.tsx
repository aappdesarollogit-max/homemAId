import Link from "next/link";
import { InventoryLinkRow } from "@/components/dashboard/InventoryRows";
import SectionHeader from "@/components/dashboard/SectionHeader";
import Badge from "@/components/ui/Badge";
import {
  filterInventoryProducts,
  inventoryFilters,
  statusTone,
} from "@/lib/dashboard-utils";
import { inventoryProducts } from "@/lib/mock-home";

type InventoryViewProps = {
  activeFilter: string;
  selectedProductId?: string;
  activeAction?: string;
};

export default function InventoryView({
  activeFilter,
  selectedProductId,
  activeAction,
}: InventoryViewProps) {
  const filteredProducts = filterInventoryProducts(activeFilter);
  const selectedProduct =
    inventoryProducts.find((product) => product.id === selectedProductId) ??
    filteredProducts[0] ??
    inventoryProducts[0];

  return (
    <>
      <SectionHeader
        eyebrow="Inventario"
        title="Productos del hogar"
        description="Vista central para controlar stock, productos abiertos y próximos agotamientos."
        action={
          <button className="rounded-2xl bg-violet-500 px-5 py-3 text-sm font-black text-white">
            + Agregar producto
          </button>
        }
      />

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
          {filteredProducts.map((product) => (
            <InventoryLinkRow
              key={product.id}
              product={product}
              href={`/dashboard?view=inventario&filter=${activeFilter}&product=${product.id}`}
              isSelected={product.id === selectedProduct?.id}
            />
          ))}
        </div>

        <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-300">
            Producto
          </p>
          <div className="mt-5 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-4xl">
              {selectedProduct?.icon}
            </div>
            <div>
              <h2 className="text-2xl font-black">{selectedProduct?.name}</h2>
              <p className="mt-1 text-sm text-white/50">{selectedProduct?.category}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
              <span className="text-sm font-bold text-white/55">Estado</span>
              {selectedProduct ? (
                <Badge tone={statusTone(selectedProduct.status)}>
                  {selectedProduct.statusLabel}
                </Badge>
              ) : null}
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
              <span className="text-sm font-bold text-white/55">Cantidad</span>
              <span className="font-black">{selectedProduct?.quantity}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
              <span className="text-sm font-bold text-white/55">Duración estimada</span>
              <span className="font-black">{selectedProduct?.estimatedDaysLeft} días</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
              <span className="text-sm font-bold text-white/55">Abierto el</span>
              <span className="font-black">{selectedProduct?.openedAt ?? "Sin registrar"}</span>
            </div>
          </div>

          {activeAction === "apertura" ? (
            <div className="mt-6 rounded-3xl bg-white p-5 text-slate-950">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-violet-600">
                Registrar apertura
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Este formulario visual quedará listo para conectarse a datos reales.
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-black text-slate-600">
                    Producto
                  </label>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold">
                    {selectedProduct?.name}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-black text-slate-600">
                    Cantidad abierta
                  </label>
                  <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <span className="text-xl font-black text-slate-400">−</span>
                    <span className="text-2xl font-black">1</span>
                    <span className="text-xl font-black text-violet-600">+</span>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-black text-slate-600">
                    Fecha
                  </label>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold">
                    Hoy
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <Link
                  href={`/dashboard?view=inventario&filter=${activeFilter}&product=${selectedProduct?.id}`}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-black text-slate-700"
                >
                  Cancelar
                </Link>
                <button className="rounded-2xl bg-violet-500 px-4 py-3 text-sm font-black text-white">
                  Guardar
                </button>
              </div>
            </div>
          ) : (
            <Link
              href={`/dashboard?view=inventario&filter=${activeFilter}&product=${selectedProduct?.id}&action=apertura`}
              className="mt-6 block w-full rounded-2xl bg-violet-500 px-5 py-3 text-center text-sm font-black text-white hover:bg-violet-400"
            >
              Registrar apertura
            </Link>
          )}
        </aside>
      </div>
    </>
  );
}
