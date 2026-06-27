import Link from "next/link";
import SectionHeader from "@/components/dashboard/SectionHeader";
import { formatCurrency, purchases } from "@/lib/mock-home";

type PurchasesViewProps = {
  selectedPurchaseId?: string;
  activeMode?: string;
};

export default function PurchasesView({
  selectedPurchaseId,
  activeMode,
}: PurchasesViewProps) {
  const selectedPurchase =
    purchases.find((purchase) => purchase.id === selectedPurchaseId) ?? purchases[0];
  const isCreatingPurchase = activeMode === "nueva";

  return (
    <>
      <SectionHeader
        eyebrow="Compras"
        title="Registro de compras"
        description="Historial de compras recientes y productos que luego alimentarán el inventario."
        action={
          <Link
            href="/dashboard?view=compras&mode=nueva"
            className="rounded-2xl bg-violet-500 px-5 py-3 text-sm font-black text-white"
          >
            + Nueva compra
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="grid gap-5 lg:grid-cols-2">
          {purchases.map((purchase) => {
            const isSelected = purchase.id === selectedPurchase?.id;

            return (
              <Link
                key={purchase.id}
                href={`/dashboard?view=compras&purchase=${purchase.id}`}
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

        {isCreatingPurchase ? (
          <aside className="rounded-3xl bg-white p-6 text-slate-950">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-600">
              Nueva compra
            </p>
            <h2 className="mt-3 text-2xl font-black">Registrar compra</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Formulario visual preparado para conectar validación y persistencia.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-xs font-black text-slate-600">
                  Tienda
                </label>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold">
                  Supermercado
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-black text-slate-600">
                  Productos
                </label>
                <div className="space-y-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-black">Leche entera</p>
                    <p className="mt-1 text-sm text-slate-500">2 unidades · $3.000</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-black">Detergente</p>
                    <p className="mt-1 text-sm text-slate-500">1 unidad · $4.990</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5">
              <span className="text-sm font-bold text-slate-500">Total</span>
              <span className="text-2xl font-black text-violet-600">{formatCurrency(7990)}</span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link
                href="/dashboard?view=compras"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-black text-slate-700"
              >
                Cancelar
              </Link>
              <button className="rounded-2xl bg-violet-500 px-4 py-3 text-sm font-black text-white">
                Guardar
              </button>
            </div>
          </aside>
        ) : (
          <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-300">
              Detalle
            </p>
            <h2 className="mt-3 text-2xl font-black">{selectedPurchase?.store}</h2>
            <p className="mt-1 text-sm text-white/50">{selectedPurchase?.date}</p>

            <div className="mt-6 space-y-3">
              {selectedPurchase?.items.map((item) => (
                <div key={item.productName} className="rounded-2xl bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold">{item.productName}</p>
                      <p className="mt-1 text-sm text-white/50">{item.quantity}</p>
                    </div>
                    <p className="font-black">{formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
              <span className="text-sm font-bold text-white/55">Total</span>
              <span className="text-2xl font-black text-violet-300">
                {formatCurrency(selectedPurchase?.total ?? 0)}
              </span>
            </div>
          </aside>
        )}
      </div>
    </>
  );
}
