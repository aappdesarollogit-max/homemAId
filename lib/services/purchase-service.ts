import {
  createInventoryProduct,
  getInventoryProducts,
  saveInventoryProducts,
} from "@/lib/services/inventory-service";
import DataIngestionEngine, {
  type NormalizedPurchase,
  type RawPurchaseInput,
} from "@/lib/ingestion/DataIngestionEngine";
import type { InventoryUpdaterProvider } from "@/lib/ingestion/InventoryUpdater";
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

function createStoredPurchase(normalizedPurchase: NormalizedPurchase): Purchase {
  const items = normalizedPurchase.items.map((item) => ({
    productId: item.productId,
    productName: item.productName,
    quantity: item.quantity,
    unit: item.unit,
    price: item.price,
  }));

  const purchase: Purchase = {
    id: generatePurchaseId(),
    store: normalizedPurchase.store,
    date: normalizedPurchase.date || todayLabel(),
    total: calculatePurchaseTotal(items),
    items,
  };

  savePurchases([purchase, ...getPurchases()]);

  return purchase;
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

function createInventoryUpdaterProvider(): InventoryUpdaterProvider {
  return {
    findProductById(id) {
      return getInventoryProducts().find((product) => product.id === id);
    },
    findProductByName(name) {
      return getInventoryProducts().find(
        (product) => normalizeText(product.name) === normalizeText(name),
      );
    },
    increaseProductStock(id, quantity, unit) {
      saveInventoryProducts(
        getInventoryProducts().map((product) => {
          if (product.id !== id) return product;

          return {
            ...product,
            currentStock: product.currentStock + quantity,
            unit: unit || product.unit,
          };
        }),
      );
    },
    createProductFromPurchase(input) {
      createInventoryProduct({
        name: input.name,
        category: input.category || "Despensa",
        currentStock: input.quantity,
        minimumStock: Math.max(1, Math.ceil(input.quantity * 0.25)),
        unit: input.unit,
        estimatedDaysLeft: 14,
        icon: "□",
      });
    },
  };
}

function mapPurchaseInputToRawInputs(purchaseInput: PurchaseInput): RawPurchaseInput[] {
  return purchaseInput.items.map((item) => ({
    productId: item.productId,
    producto: item.productName,
    cantidad: item.quantity,
    unidad: item.unit,
    precio: item.price,
    tienda: purchaseInput.store,
    fecha: purchaseInput.date,
    source: "manual",
  }));
}

export function createPurchase(purchaseInput: PurchaseInput) {
  const engine = new DataIngestionEngine({
    purchaseProvider: {
      createPurchase: createStoredPurchase,
    },
    inventoryProvider: createInventoryUpdaterProvider(),
  });
  const result = engine.receive(mapPurchaseInputToRawInputs(purchaseInput));

  if (!result.ok || !result.purchase) {
    throw new Error(
      result.validation.issues.map((issue) => issue.message).join(" ") ||
        "No se pudo registrar la compra.",
    );
  }

  return result.purchase;
}

export function deletePurchase(id: string) {
  const nextPurchases = getPurchases().filter((purchase) => purchase.id !== id);
  savePurchases(nextPurchases);

  return nextPurchases;
}

export function getMonthlyPurchaseSpend() {
  return getPurchases().reduce((total, purchase) => total + purchase.total, 0);
}
