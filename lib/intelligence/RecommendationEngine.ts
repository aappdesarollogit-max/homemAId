import type {
  HouseholdAlert,
  HouseholdPattern,
  HouseholdPrediction,
  HouseholdRecommendation,
  HouseholdSettings,
  InventoryProduct,
} from "@/types/domain";

type RecommendationInput = {
  inventoryProducts: InventoryProduct[];
  settings: HouseholdSettings;
  patterns: HouseholdPattern[];
  predictions: HouseholdPrediction[];
  alerts: HouseholdAlert[];
  budgetUsage: number;
};

export function generateHouseholdRecommendations({
  inventoryProducts,
  settings,
  patterns,
  predictions,
  alerts,
  budgetUsage,
}: RecommendationInput): HouseholdRecommendation[] {
  const recommendations: HouseholdRecommendation[] = [];
  const criticalProducts = inventoryProducts.filter((product) => product.status !== "ok");

  if (criticalProducts.length > 0) {
    recommendations.push({
      id: "recommend-critical-products",
      type: "shopping",
      title: "Reponer productos prioritarios",
      description: `Agrega ${criticalProducts.slice(0, 3).map((product) => product.name).join(", ")} a tu próxima compra.`,
      priority: criticalProducts.length >= 4 ? "high" : "medium",
      impact: "urgencia",
      actionLabel: "Revisar inventario",
      relatedProducts: criticalProducts.slice(0, 5).map((product) => product.name),
    });
  }

  const budgetAlert = alerts.find(
    (alert) => alert.type === "budget_over" || alert.type === "budget_threshold",
  );
  if (budgetAlert || budgetUsage >= settings.budgetAlertThreshold) {
    recommendations.push({
      id: "recommend-budget-control",
      type: "budget",
      title: "Controlar compras no esenciales",
      description: `Tu presupuesto va en ${budgetUsage}%. Conviene priorizar productos críticos y básicos.`,
      priority: budgetUsage >= 100 ? "high" : "medium",
      impact: "presupuesto",
      actionLabel: "Revisar consumo",
      relatedProducts: [],
    });
  }

  const concentratedPattern = patterns.find(
    (pattern) =>
      pattern.type === "concentrated_category" || pattern.type === "top_category",
  );
  if (concentratedPattern?.relatedCategory) {
    recommendations.push({
      id: `recommend-category-${concentratedPattern.relatedCategory}`,
      type: "saving",
      title: "Revisar gasto por categoría",
      description: `${concentratedPattern.relatedCategory} está concentrando gasto. Revisa si hay compras duplicadas o no esenciales.`,
      priority: concentratedPattern.severity === "high" ? "high" : "medium",
      impact: "ahorro",
      actionLabel: "Ver consumo",
      relatedProducts: [],
    });
  }

  const stockOutPrediction = predictions.find(
    (prediction) => prediction.predictionType === "stock_out",
  );
  if (stockOutPrediction) {
    recommendations.push({
      id: "recommend-week-review",
      type: "prevention",
      title: "Revisar antes del fin de semana",
      description: `${stockOutPrediction.productName} podría agotarse pronto. Revísalo antes de tu próxima compra.`,
      priority: "medium",
      impact: "prevención",
      actionLabel: "Planificar compra",
      relatedProducts: [stockOutPrediction.productName],
    });
  }

  if (settings.priorityCategories.length > 0 && recommendations.length < 4) {
    recommendations.push({
      id: "recommend-priority-categories",
      type: "organization",
      title: "Mantener categorías prioritarias al día",
      description: `Tus categorías prioritarias son ${settings.priorityCategories.slice(0, 3).join(", ")}. Úsalas como checklist semanal.`,
      priority: "low",
      impact: "organización",
      actionLabel: "Revisar ajustes",
      relatedProducts: [],
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      id: "recommend-healthy-home",
      type: "organization",
      title: "Hogar bajo control",
      description: "No veo riesgos urgentes. Mantén compras e inventario actualizados para mejorar las predicciones.",
      priority: "low",
      impact: "organización",
      actionLabel: "Actualizar datos",
      relatedProducts: [],
    });
  }

  return recommendations.slice(0, 6);
}
