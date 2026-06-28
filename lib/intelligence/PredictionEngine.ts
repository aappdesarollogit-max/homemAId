import {
  getBudgetUsage,
  getMonthlySpend,
  getSpendByCategory,
} from "@/lib/services/consumption-service";
import type {
  HouseholdPattern,
  HouseholdPrediction,
  HouseholdSettings,
  InventoryProduct,
  Purchase,
  RiskLevel,
} from "@/types/domain";

type PredictionInput = {
  inventoryProducts: InventoryProduct[];
  purchases: Purchase[];
  settings: HouseholdSettings;
  patterns: HouseholdPattern[];
};

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + Math.max(0, days));
  return date.toISOString().slice(0, 10);
}

function stockSeverity(daysLeft: number): RiskLevel {
  if (daysLeft <= 1) return "critical";
  if (daysLeft <= 3) return "high";
  if (daysLeft <= 7) return "medium";
  return "low";
}

export function predictHouseholdNeeds({
  inventoryProducts,
  purchases,
  settings,
  patterns,
}: PredictionInput): HouseholdPrediction[] {
  const predictions: HouseholdPrediction[] = [];
  const monthlySpend = getMonthlySpend(purchases);
  const budgetUsage = getBudgetUsage(monthlySpend, settings.monthlyBudget);
  const spendByCategory = getSpendByCategory(purchases, inventoryProducts);

  inventoryProducts
    .filter((product) => product.status !== "ok" || product.estimatedDaysLeft <= 7)
    .sort((a, b) => a.estimatedDaysLeft - b.estimatedDaysLeft)
    .slice(0, 5)
    .forEach((product) => {
      const daysLeft = Math.max(0, product.estimatedDaysLeft);
      predictions.push({
        id: `prediction-stock-${product.id}`,
        productId: product.id,
        productName: product.name,
        predictionType: product.status === "out" ? "restock" : "stock_out",
        title: product.status === "out" ? "Reposición urgente" : "Podría agotarse pronto",
        description:
          product.status === "out"
            ? `${product.name} está agotado y conviene reponerlo en la próxima compra.`
            : `${product.name} podría agotarse en aproximadamente ${daysLeft} día${daysLeft === 1 ? "" : "s"}.`,
        estimatedDate: addDays(daysLeft),
        confidence: product.status === "out" ? 92 : Math.max(55, 90 - daysLeft * 5),
        severity: product.status === "out" ? "critical" : stockSeverity(daysLeft),
      });
    });

  if (purchases.length > 0) {
    const nextPurchaseDays =
      settings.purchaseFrequency.toLowerCase().includes("quincenal")
        ? 14
        : settings.purchaseFrequency.toLowerCase().includes("mensual")
          ? 30
          : 7;

    predictions.push({
      id: "prediction-next-purchase",
      productName: "Compra del hogar",
      predictionType: "next_purchase",
      title: "Próxima compra sugerida",
      description: `Según la frecuencia configurada, conviene revisar una compra en los próximos ${nextPurchaseDays} días.`,
      estimatedDate: addDays(nextPurchaseDays),
      confidence: purchases.length >= 3 ? 72 : 55,
      severity: "low",
    });
  }

  if (settings.monthlyBudget > 0 && budgetUsage >= settings.budgetAlertThreshold) {
    predictions.push({
      id: "prediction-budget-risk",
      productName: "Presupuesto mensual",
      predictionType: "budget_risk",
      title: "Riesgo de superar presupuesto",
      description: `El gasto va en ${budgetUsage}% del presupuesto mensual configurado.`,
      confidence: Math.min(95, budgetUsage),
      severity: budgetUsage >= 100 ? "critical" : budgetUsage >= 90 ? "high" : "medium",
    });
  }

  const risingCategory =
    spendByCategory.find((category) => category.percentage >= 45) ??
    patterns.find((pattern) => pattern.type === "concentrated_category");
  if (risingCategory) {
    const label = "label" in risingCategory ? risingCategory.label : risingCategory.relatedCategory;

    predictions.push({
      id: `prediction-category-${label ?? "trend"}`,
      productName: label ?? "Categoría principal",
      predictionType: "category_trend",
      title: "Categoría con tendencia alta",
      description: `${label ?? "Una categoría"} está concentrando una parte relevante del gasto.`,
      confidence: 64,
      severity: "medium",
    });
  }

  return predictions.slice(0, 8);
}
