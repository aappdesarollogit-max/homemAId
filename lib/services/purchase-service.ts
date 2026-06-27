import {
  createInventoryProduct,
  getInventoryProducts,
  saveInventoryProducts,
} from "@/lib/services/inventory-service";
import { purchases as mockPurchases } from "@/lib/mock-home";
import type { InventoryProduct, Purchase, PurchaseItem } from "@/types/domain";

const PURCHASE_STORAGE_KEY = "homemaid.purchases";

export type PurchaseInput = {
  store: string;
  date?: string;
  items: PurchaseItemInput[];
};

export type PurchaseItemInput = {
  productId?: string;
  productName: string;
  quantity: number;
  unit: string;
  price: number;
};

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function generatePurchaseId() {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : String(Date.now());

  return `purchase-${suffix}`;
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function todayLabel() {
  return new Date().toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function normalizePurchase(purchase: Purchase): Purchase {
  const normalizedItems = purchase.items.map((item) => ({
    ...item,
    quantity: Math.max(0, Number(item.quantity)),
    unit: item.unit || "unidad",
    price: Math.max(0, Number(item.price)),
  }));

  return {
    ...purchase,
    total: calculatePurchaseTotal(normalizedItems),
    items: normalizedItems,
  };
}

export function calculatePurchaseTotal(items: Array<Pick<PurchaseItem, "price">>) {
  return items.reduce((total, item) => total + Math.max(0, Number(item.price)), 0);
}

export function getPurchases() {
  if (!canUseLocalStorage()) return mockPurchases.map(normalizePurchase);

  const storedPurchases = window.localStorage.getItem(PURCHASE_STORAGE_KEY);

  if (!storedPurchases) {
    const initialPurchases = mockPurchases.map(normalizePurchase);
    savePurchases(initialPurchases);
    return initialPurchases;
  }

  try {
    const parsedPurchases = JSON.parse(storedPurchases) as Purchase[];
    return parsedPurchases.map(normalizePurchase);
  } catch {
    const initialPurchases = mockPurchases.map(normalizePurchase);
    savePurchases(initialPurchases);
    return initialPurchases;
  }
}

export function savePurchases(purchases: Purchase[]) {
  const normalizedPurchases = purchases.map(normalizePurchase);

  if (canUseLocalStorage()) {
    window.localStorage.setItem(PURCHASE_STORAGE_KEY, JSON.stringify(normalizedPurchases));
  }

  return normalizedPurchases;
}

function findInventoryProduct(item: PurchaseItemInput, products: InventoryProduct[]) {
  if (item.productId) {
    const productById = products.find((product) => product.id === item.productId);
    if (productById) return productById;
  }

  return products.find(
    (product) => normalizeText(product.name) === normalizeText(item.productName),
  );
}

export function applyPurchaseToInventory(purchase: Purchase) {
  let products = getInventoryProducts();

  purchase.items.forEach((item) => {
    const existingProduct = findInventoryProduct(item, products);

    if (existingProduct) {
      products = saveInventoryProducts(
        products.map((product) => {
          if (product.id !== existingProduct.id) return product;

          return {
            ...product,
            currentStock: product.currentStock + item.quantity,
            unit: item.unit || product.unit,
          };
        }),
      );
      return;
    }

    createInventoryProduct({
      name: item.productName,
      category: "Despensa",
      currentStock: item.quantity,
      minimumStock: Math.max(1, Math.ceil(item.quantity * 0.25)),
      unit: item.unit,
      estimatedDaysLeft: 14,
      icon: "□",
    });
    products = getInventoryProducts();
  });
}

export function createPurchase(purchaseInput: PurchaseInput) {
  const items = purchaseInput.items.map((item) => ({
    productId: item.productId,
    productName: item.productName.trim(),
    quantity: Math.max(0, Number(item.quantity)),
    unit: item.unit.trim(),
    price: Math.max(0, Number(item.price)),
  }));
  const purchase: Purchase = {
    id: generatePurchaseId(),
    store: purchaseInput.store.trim(),
    date: purchaseInput.date || todayLabel(),
    total: calculatePurchaseTotal(items),
    items,
  };

  applyPurchaseToInventory(purchase);
  savePurchases([purchase, ...getPurchases()]);

  return purchase;
}

export function deletePurchase(id: string) {
  const nextPurchases = getPurchases().filter((purchase) => purchase.id !== id);
  savePurchases(nextPurchases);

  return nextPurchases;
}

export function getMonthlyPurchaseSpend() {
  return getPurchases().reduce((total, purchase) => total + purchase.total, 0);
}
