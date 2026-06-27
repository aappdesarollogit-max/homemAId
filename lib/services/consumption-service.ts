import type { InventoryProduct, Purchase } from "@/types/domain";

export type ConsumptionBreakdownItem = {
  label: string;
  amount: number;
  percentage: number;
};

export type TopPurchasedProduct = {
  productName: string;
  quantity: number;
  unit: string;
  totalSpend: number;
};

export type WeeklySpendPoint = {
  label: string;
  amount: number;
};

export type ConsumptionAlert = {
  id: string;
  title: string;
  description: string;
  tone: "warning" | "danger" | "info";
};

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function getPercentage(amount: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((amount / total) * 100);
}

function findInventoryProduct(
  productId: string | undefined,
  productName: string,
  inventoryProducts: InventoryProduct[],
) {
  if (productId) {
    const productById = inventoryProducts.find((product) => product.id === productId);
    if (productById) return productById;
  }

  return inventoryProducts.find(
    (product) => normalizeText(product.name) === normalizeText(productName),
  );
}

function parsePurchaseDate(date: string) {
  const parsedDate = new Date(date);
  if (!Number.isNaN(parsedDate.getTime())) return parsedDate;

  const normalizedDate = normalizeText(date);
  const today = new Date();

  if (normalizedDate === "hoy") return today;
  if (normalizedDate === "ayer") {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return yesterday;
  }

  return undefined;
}

function getWeekLabel(date: string) {
  const parsedDate = parsePurchaseDate(date);
  if (!parsedDate) return "Sin fecha";

  const weekStart = new Date(parsedDate);
  weekStart.setDate(parsedDate.getDate() - parsedDate.getDay());

  return weekStart.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
  });
}

function getProductCategory(
  productId: string | undefined,
  productName: string,
  inventoryProducts: InventoryProduct[],
) {
  return findInventoryProduct(productId, productName, inventoryProducts)?.category ?? "Sin categoría";
}

export function getMonthlySpend(purchases: Purchase[]) {
  return purchases.reduce((total, purchase) => total + purchase.total, 0);
}

export function getSpendByCategory(
  purchases: Purchase[],
  inventoryProducts: InventoryProduct[],
) {
  const totalSpend = getMonthlySpend(purchases);
  const categoryTotals = new Map<string, number>();

  purchases.forEach((purchase) => {
    purchase.items.forEach((item) => {
      const category = getProductCategory(item.productId, item.productName, inventoryProducts);
      categoryTotals.set(category, (categoryTotals.get(category) ?? 0) + item.price);
    });
  });

  return Array.from(categoryTotals.entries())
    .map(([label, amount]) => ({
      label,
      amount,
      percentage: getPercentage(amount, totalSpend),
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function getSpendByStore(purchases: Purchase[]) {
  const totalSpend = getMonthlySpend(purchases);
  const storeTotals = new Map<string, number>();

  purchases.forEach((purchase) => {
    storeTotals.set(purchase.store, (storeTotals.get(purchase.store) ?? 0) + purchase.total);
  });

  return Array.from(storeTotals.entries())
    .map(([label, amount]) => ({
      label,
      amount,
      percentage: getPercentage(amount, totalSpend),
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function getTopPurchasedProducts(purchases: Purchase[]) {
  const productTotals = new Map<string, TopPurchasedProduct>();

  purchases.forEach((purchase) => {
    purchase.items.forEach((item) => {
      const key = normalizeText(item.productName);
      const currentProduct = productTotals.get(key);

      productTotals.set(key, {
        productName: item.productName,
        quantity: (currentProduct?.quantity ?? 0) + item.quantity,
        unit: currentProduct?.unit ?? item.unit,
        totalSpend: (currentProduct?.totalSpend ?? 0) + item.price,
      });
    });
  });

  return Array.from(productTotals.values())
    .sort((a, b) => b.totalSpend - a.totalSpend)
    .slice(0, 5);
}

export function getWeeklySpendTrend(purchases: Purchase[]) {
  const weeklyTotals = new Map<string, number>();

  purchases.forEach((purchase) => {
    const label = getWeekLabel(purchase.date);
    weeklyTotals.set(label, (weeklyTotals.get(label) ?? 0) + purchase.total);
  });

  return Array.from(weeklyTotals.entries()).map(([label, amount]) => ({
    label,
    amount,
  }));
}

export function getBudgetUsage(monthlySpend: number, monthlyBudget: number) {
  return getPercentage(monthlySpend, monthlyBudget);
}

export function getCriticalProducts(inventoryProducts: InventoryProduct[]) {
  return inventoryProducts.filter((product) => product.status !== "ok");
}

export function getConsumptionAlerts(
  purchases: Purchase[],
  inventoryProducts: InventoryProduct[],
  monthlyBudget: number,
) {
  const monthlySpend = getMonthlySpend(purchases);
  const budgetUsage = getBudgetUsage(monthlySpend, monthlyBudget);
  const criticalProducts = getCriticalProducts(inventoryProducts);
  const spendByCategory = getSpendByCategory(purchases, inventoryProducts);
  const topProducts = getTopPurchasedProducts(purchases);
  const alerts: ConsumptionAlert[] = [];

  if (budgetUsage > 100) {
    alerts.push({
      id: "budget-over",
      title: "Presupuesto superado",
      description: `El gasto va en ${budgetUsage}% del presupuesto mensual.`,
      tone: "danger",
    });
  } else if (budgetUsage >= 80) {
    alerts.push({
      id: "budget-warning",
      title: "Presupuesto sobre 80%",
      description: `El gasto ya alcanzó ${budgetUsage}% del presupuesto mensual.`,
      tone: "warning",
    });
  }

  if (criticalProducts.length > 0) {
    alerts.push({
      id: "critical-products",
      title: "Productos críticos",
      description: `${criticalProducts.length} producto${criticalProducts.length === 1 ? "" : "s"} requiere atención.`,
      tone: "warning",
    });
  }

  const dominantCategory = spendByCategory[0];
  if (dominantCategory && dominantCategory.percentage >= 60) {
    alerts.push({
      id: "dominant-category",
      title: "Gasto concentrado",
      description: `${dominantCategory.label} concentra ${dominantCategory.percentage}% del gasto.`,
      tone: "info",
    });
  }

  const repeatedProduct = topProducts.find((product) => product.quantity >= 3);
  if (repeatedProduct) {
    alerts.push({
      id: "repeated-product",
      title: "Compra repetida",
      description: `${repeatedProduct.productName} aparece con ${repeatedProduct.quantity} ${repeatedProduct.unit}.`,
      tone: "info",
    });
  }

  return alerts;
}
