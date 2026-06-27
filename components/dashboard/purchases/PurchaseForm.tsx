"use client";

import { useMemo, useState } from "react";
import { formatCurrency } from "@/lib/mock-home";
import type { PurchaseInput, PurchaseItemInput } from "@/lib/services/purchase-service";
import type { InventoryProduct } from "@/types/domain";

type PurchaseFormProps = {
  inventoryProducts: InventoryProduct[];
  onCancel: () => void;
  onSubmit: (purchase: PurchaseInput) => void;
};

type PurchaseFormItem = PurchaseItemInput & {
  localId: string;
};

type PurchaseFormErrors = {
  store?: string;
  items?: string;
  itemErrors: Record<string, Partial<Record<keyof PurchaseItemInput, string>>>;
};

function createEmptyItem(): PurchaseFormItem {
  return {
    localId: String(Date.now() + Math.random()),
    productName: "",
    quantity: 1,
    unit: "unidad",
    price: 0,
  };
}

function readNumber(value: string) {
  return Number.isNaN(Number(value)) ? 0 : Number(value);
}

function validatePurchase(store: string, items: PurchaseFormItem[]) {
  const errors: PurchaseFormErrors = {
    itemErrors: {},
  };

  if (!store.trim()) errors.store = "Tienda obligatoria";
  if (items.length === 0) errors.items = "Debes agregar al menos 1 producto";

  items.forEach((item) => {
    const itemErrors: Partial<Record<keyof PurchaseItemInput, string>> = {};

    if (!item.productName.trim()) itemErrors.productName = "Nombre obligatorio";
    if (item.quantity <= 0) itemErrors.quantity = "Debe ser mayor a 0";
    if (!item.unit.trim()) itemErrors.unit = "Unidad obligatoria";
    if (item.price < 0) itemErrors.price = "No puede ser negativo";

    if (Object.keys(itemErrors).length > 0) {
      errors.itemErrors[item.localId] = itemErrors;
    }
  });

  return errors;
}

export default function PurchaseForm({
  inventoryProducts,
  onCancel,
  onSubmit,
}: PurchaseFormProps) {
  const [store, setStore] = useState("Supermercado");
  const [items, setItems] = useState<PurchaseFormItem[]>([createEmptyItem()]);
  const [errors, setErrors] = useState<PurchaseFormErrors>({ itemErrors: {} });
  const total = useMemo(
    () => items.reduce((sum, item) => sum + Math.max(0, Number(item.price)), 0),
    [items],
  );

  function updateItem<Key extends keyof PurchaseItemInput>(
    localId: string,
    field: Key,
    value: PurchaseItemInput[Key],
  ) {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.localId !== localId) return item;

        const selectedProduct =
          field === "productName"
            ? inventoryProducts.find((product) => product.name === value)
            : undefined;

        return {
          ...item,
          [field]: value,
          productId: selectedProduct?.id ?? item.productId,
          unit: selectedProduct?.unit ?? item.unit,
        };
      }),
    );
  }

  function removeItem(localId: string) {
    setItems((currentItems) =>
      currentItems.length > 1
        ? currentItems.filter((item) => item.localId !== localId)
        : currentItems,
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validatePurchase(store, items);
    setErrors(nextErrors);

    if (nextErrors.store || nextErrors.items || Object.keys(nextErrors.itemErrors).length > 0) {
      return;
    }

    onSubmit({
      store,
      items: items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
      })),
    });
  }

  return (
    <aside className="rounded-3xl bg-white p-6 text-slate-950">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-600">
        Nueva compra
      </p>
      <h2 className="mt-3 text-2xl font-black">Registrar compra</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        Guarda la compra y actualiza el inventario de forma local.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs font-black text-slate-600">Tienda</span>
          <input
            value={store}
            onChange={(event) => setStore(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-400"
          />
          {errors.store ? <span className="mt-1 block text-xs font-bold text-red-500">{errors.store}</span> : null}
        </label>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-black text-slate-600">Productos</span>
            <button
              type="button"
              onClick={() => setItems((currentItems) => [...currentItems, createEmptyItem()])}
              className="text-xs font-black text-violet-600"
            >
              + Agregar
            </button>
          </div>

          <datalist id="inventory-products">
            {inventoryProducts.map((product) => (
              <option key={product.id} value={product.name} />
            ))}
          </datalist>

          <div className="space-y-3">
            {items.map((item) => {
              const itemErrors = errors.itemErrors[item.localId] ?? {};

              return (
                <div key={item.localId} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="grid gap-3">
                    <label className="block">
                      <span className="mb-2 block text-xs font-black text-slate-600">
                        Producto
                      </span>
                      <input
                        list="inventory-products"
                        value={item.productName}
                        onChange={(event) =>
                          updateItem(item.localId, "productName", event.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-violet-400"
                      />
                      {itemErrors.productName ? (
                        <span className="mt-1 block text-xs font-bold text-red-500">
                          {itemErrors.productName}
                        </span>
                      ) : null}
                    </label>

                    <div className="grid grid-cols-3 gap-3">
                      <label className="block">
                        <span className="mb-2 block text-xs font-black text-slate-600">
                          Cantidad
                        </span>
                        <input
                          type="number"
                          min={0}
                          value={item.quantity}
                          onChange={(event) =>
                            updateItem(item.localId, "quantity", readNumber(event.target.value))
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-violet-400"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-xs font-black text-slate-600">
                          Unidad
                        </span>
                        <input
                          value={item.unit}
                          onChange={(event) =>
                            updateItem(item.localId, "unit", event.target.value)
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-violet-400"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-xs font-black text-slate-600">
                          Precio
                        </span>
                        <input
                          type="number"
                          min={0}
                          value={item.price}
                          onChange={(event) =>
                            updateItem(item.localId, "price", readNumber(event.target.value))
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-violet-400"
                        />
                      </label>
                    </div>

                    {itemErrors.quantity || itemErrors.unit || itemErrors.price ? (
                      <p className="text-xs font-bold text-red-500">
                        {itemErrors.quantity ?? itemErrors.unit ?? itemErrors.price}
                      </p>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => removeItem(item.localId)}
                      className="text-left text-xs font-black text-red-500"
                    >
                      Eliminar producto
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {errors.items ? <span className="mt-1 block text-xs font-bold text-red-500">{errors.items}</span> : null}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 pt-5">
          <span className="text-sm font-bold text-slate-500">Total</span>
          <span className="text-2xl font-black text-violet-600">{formatCurrency(total)}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-black text-slate-700"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-2xl bg-violet-500 px-4 py-3 text-sm font-black text-white"
          >
            Guardar
          </button>
        </div>
      </form>
    </aside>
  );
}
