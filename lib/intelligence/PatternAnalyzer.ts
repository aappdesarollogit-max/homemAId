import {
  getMonthlySpend,
  getSpendByCategory,
  getSpendByStore,
  getTopPurchasedProducts,
} from "@/lib/services/consumption-service";
import type {
  HouseholdPattern,
  HouseholdSettings,
  InventoryProduct,
  Purchase,
  RiskLevel,
} from "@/types/domain";

type PatternInput = {
  inventoryProducts: InventoryProduct[];
  purchases: Purchase[];
  settings: HouseholdSettings;
};

function nowIso() {
  return new Date().toISOString();
}

function severityFromPercentage(percentage: number): RiskLevel {
  if (percentage >= 80) return "critical";
  if (percentage >= 65) return "high";
  if (percentage >= 45) return "medium";
  return "low";
}

function confidence(value: number) {
  return Math.min(95, Math.max(45, Math.round(value)));
}

export function analyzeHouseholdPatterns({
  inventoryProducts,
  purchases,
  settings,
}: PatternInput): HouseholdPattern[] {
  const patterns: HouseholdPattern[] = [];
  const createdAt = nowIso();
  const monthlySpend = getMonthlySpend(purchases);
  const spendByCategory = getSpendByCategory(purchases, inventoryProducts);
  const spendByStore = getSpendByStore(purchases);
  const topProducts = getTopPurchasedProducts(purchases);

  topProducts
    .filter((product) => product.quantity >= 3)
    .slice(0, 3)
    .forEach((product) => {
      patterns.push({
        id: `pattern-repeated-${product.productName.toLowerCase()}`,
        type: "repeated_product",
        title: "Producto comprado repetidamente",
        description: `${product.productName} aparece con ${product.quantity} ${product.unit} en el historial reciente.`,
        confidence: confidence(60 + product.quantity * 8),
        severity: product.quantity >= 6 ? "medium" : "low",
        relatedProducts: [product.productName],
        createdAt,
      });
    });

  const topCategory = spendByCategory[0];
  if (topCategory) {
    patterns.push({
      id: `pattern-top-category-${topCategory.label}`,
      type: "top_category",
      title: "Categoría con mayor gasto",
      description: `${topCategory.label} concentra ${topCategory.percentage}% del gasto registrado.`,
      confidence: confidence(topCategory.percentage + 35),
      severity: severityFromPercentage(topCategory.percentage),
      relatedProducts: [],
      relatedCategory: topCategory.label,
      createdAt,
    });
  }

  const topStore = spendByStore[0];
  if (topStore) {
    patterns.push({
      id: `pattern-top-store-${topStore.label}`,
      type: "top_store",
      title: "Tienda principal detectada",
      description: `${topStore.label} concentra ${topStore.percentage}% del gasto de compras.`,
      confidence: confidence(topStore.percentage + 30),
      severity: topStore.percentage >= 70 ? "medium" : "low",
      relatedProducts: [],
      createdAt,
    });
  }

  const criticalProducts = inventoryProducts.filter((product) => product.status !== "ok");
  if (criticalProducts.length > 0) {
    patterns.push({
      id: "pattern-recurring-critical-products",
      type: "recurring_critical",
      title: "Productos críticos activos",
      description: `${criticalProducts.length} producto${criticalProducts.length === 1 ? "" : "s"} requieren atención en inventario.`,
      confidence: confidence(55 + criticalProducts.length * 10),
      severity: criticalProducts.length >= 4 ? "high" : "medium",
      relatedProducts: criticalProducts.slice(0, 5).map((product) => product.name),
      createdAt,
    });
  }

  const longLowStockProducts = inventoryProducts.filter(
    (product) => product.status !== "ok" && product.estimatedDaysLeft >= 7,
  );
  if (longLowStockProducts.length > 0) {
    patterns.push({
      id: "pattern-long-low-stock",
      type: "long_low_stock",
      title: "Stock bajo sostenido",
      description: `${longLowStockProducts.length} producto${longLowStockProducts.length === 1 ? "" : "s"} llevan varios días estimados en estado de atención.`,
      confidence: 68,
      severity: "medium",
      relatedProducts: longLowStockProducts.slice(0, 5).map((product) => product.name),
      createdAt,
    });
  }

  const averagePurchase =
    purchases.length > 0 ? monthlySpend / Math.max(1, purchases.length) : 0;
  const unusualPurchase = purchases.find(
    (purchase) => averagePurchase > 0 && purchase.total > averagePurchase * 1.8,
  );
  if (unusualPurchase) {
    patterns.push({
      id: `pattern-unusual-purchase-${unusualPurchase.id}`,
      type: "unusual_purchase",
      title: "Compra inusual por monto",
      description: `${unusualPurchase.store} supera claramente el promedio reciente de compra.`,
      confidence: 72,
      severity: "medium",
      relatedProducts: unusualPurchase.items.map((item) => item.productName).slice(0, 5),
      createdAt,
    });
  }

  const concentratedCategory = spendByCategory.find((category) => category.percentage >= 60);
  if (concentratedCategory) {
    patterns.push({
      id: `pattern-concentrated-category-${concentratedCategory.label}`,
      type: "concentrated_category",
      title: "Gasto concentrado",
      description: `${concentratedCategory.label} concentra una parte alta del gasto mensual.`,
      confidence: confidence(concentratedCategory.percentage + 25),
      severity: severityFromPercentage(concentratedCategory.percentage),
      relatedProducts: [],
      relatedCategory: concentratedCategory.label,
      createdAt,
    });
  }

  const newProducts = purchases
    .flatMap((purchase) => purchase.items)
    .filter(
      (item) =>
        !inventoryProducts.some(
          (product) => product.name.toLowerCase() === item.productName.toLowerCase(),
        ),
    );
  if (newProducts.length >= Math.max(2, settings.priorityCategories.length)) {
    patterns.push({
      id: "pattern-frequent-new-products",
      type: "frequent_new_products",
      title: "Productos nuevos frecuentes",
      description: "Varias compras recientes incluyen productos que no estaban identificados en inventario.",
      confidence: 62,
      severity: "low",
      relatedProducts: newProducts.slice(0, 5).map((item) => item.productName),
      createdAt,
    });
  }

  return patterns.slice(0, 8);
}
