import { inventoryProducts } from "@/lib/mock-home";
import { publishDomainEvent } from "@/core/platform/events/EventBus";
import { readStorageJson, writeStorageJson } from "@/lib/safe-storage";
import type { InventoryProduct, ProductStatus } from "@/types/domain";

const INVENTORY_STORAGE_KEY = "homemaid.inventory.products";

export type InventoryProductDraft = {
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  estimatedDaysLeft: number;
  icon: string;
  openedAt?: string;
  isOpened?: boolean;
};

export type InventoryProductUpdate = Partial<InventoryProductDraft>;

function getStatusLabel(status: ProductStatus) {
  if (status === "out") return "Agotado";
  if (status === "critical") return "Por agotarse";
  if (status === "low") return "Stock bajo";
  return "Stock OK";
}

function buildQuantity(currentStock: number, unit: string) {
  return `${currentStock} ${unit}`.trim();
}

function normalizeProduct(product: InventoryProduct): InventoryProduct {
  const parsedQuantity = Number.parseFloat(product.quantity);
  const currentStock = Math.max(
    0,
    Number(product.currentStock ?? (Number.isNaN(parsedQuantity) ? 0 : parsedQuantity)),
  );
  const minimumStock = Math.max(0, Number(product.minimumStock ?? 1));
  const estimatedDaysLeft = Math.max(0, Number(product.estimatedDaysLeft ?? 0));
  const unit = product.unit || "unidad";
  const calculatedStatus = calculateProductStatus({
    currentStock,
    minimumStock,
  });

  return {
    ...product,
    currentStock,
    minimumStock,
    estimatedDaysLeft,
    unit,
    quantity: buildQuantity(currentStock, unit),
    status: calculatedStatus,
    statusLabel: getStatusLabel(calculatedStatus),
    isOpened: Boolean(product.isOpened || product.openedAt),
  };
}

function getInitialProducts() {
  return inventoryProducts.map(normalizeProduct);
}

function generateProductId(name: string) {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : String(Date.now());

  return `${base || "producto"}-${suffix}`;
}

export function calculateProductStatus(product: Pick<InventoryProduct, "currentStock" | "minimumStock">) {
  if (product.currentStock <= 0) return "out";
  if (product.currentStock <= product.minimumStock) return "critical";
  if (product.minimumStock > 0 && product.currentStock <= product.minimumStock * 1.5) {
    return "low";
  }
  return "ok";
}

export function getInventoryProducts() {
  return readStorageJson<InventoryProduct[]>(
    INVENTORY_STORAGE_KEY,
    getInitialProducts(),
  ).map(normalizeProduct);
}

export function saveInventoryProducts(products: InventoryProduct[]) {
  const normalizedProducts = products.map(normalizeProduct);

  writeStorageJson(INVENTORY_STORAGE_KEY, normalizedProducts);

  return normalizedProducts;
}

export function createInventoryProduct(product: InventoryProductDraft) {
  const products = getInventoryProducts();
  const newProduct = normalizeProduct({
    id: generateProductId(product.name),
    name: product.name.trim(),
    category: product.category.trim(),
    currentStock: product.currentStock,
    minimumStock: product.minimumStock,
    unit: product.unit.trim(),
    estimatedDaysLeft: product.estimatedDaysLeft,
    icon: product.icon.trim() || "□",
    openedAt: product.openedAt,
    isOpened: Boolean(product.isOpened || product.openedAt),
    quantity: "",
    status: "ok",
    statusLabel: "Stock OK",
  });
  saveInventoryProducts([newProduct, ...products]);
  publishDomainEvent({
    type: "inventory.product.created",
    source: "inventory",
    payload: {
      productId: newProduct.id,
      name: newProduct.name,
      category: newProduct.category,
    },
  });

  return newProduct;
}

export function updateInventoryProduct(id: string, updates: InventoryProductUpdate) {
  const products = getInventoryProducts();
  let updatedProduct: InventoryProduct | undefined;
  const nextProducts = products.map((product) => {
    if (product.id !== id) return product;

    updatedProduct = normalizeProduct({
      ...product,
      ...updates,
      name: updates.name?.trim() ?? product.name,
      category: updates.category?.trim() ?? product.category,
      unit: updates.unit?.trim() ?? product.unit,
      icon: updates.icon?.trim() || product.icon,
    });

    return updatedProduct;
  });

  saveInventoryProducts(nextProducts);
  if (updatedProduct) {
    publishDomainEvent({
      type: "inventory.product.updated",
      source: "inventory",
      payload: {
        productId: updatedProduct.id,
        name: updatedProduct.name,
        status: updatedProduct.status,
      },
    });
  }
  return updatedProduct;
}

export function deleteInventoryProduct(id: string) {
  const products = getInventoryProducts();
  const nextProducts = products.filter((product) => product.id !== id);
  saveInventoryProducts(nextProducts);
  publishDomainEvent({
    type: "inventory.product.deleted",
    source: "inventory",
    payload: { productId: id },
  });

  return nextProducts;
}

export function markProductAsOpened(id: string, openedAt: string) {
  const updatedProduct = updateInventoryProduct(id, {
    isOpened: true,
    openedAt,
  });
  publishDomainEvent({
    type: "inventory.product.opened",
    source: "inventory",
    payload: {
      productId: id,
      openedAt,
    },
  });
  return updatedProduct;
}
