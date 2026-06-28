import {
  calculatePredictionConfidence,
  calculateProductConfidence,
  getProductPurchaseHistory,
} from "@/core/knowledge/ConfidenceEngine";
import type {
  HouseholdPattern,
  HouseholdPrediction,
  HouseholdRecommendation,
  InventoryProduct,
  KnowledgeExplanation,
  Purchase,
} from "@/types/domain";

function averageDaysBetweenPurchases(purchases: Purchase[]) {
  if (purchases.length < 2) return undefined;

  const dates = purchases
    .map((purchase) => new Date(purchase.date).getTime())
    .filter((time) => !Number.isNaN(time))
    .sort((a, b) => a - b);

  if (dates.length < 2) return undefined;

  const gaps = dates.slice(1).map((date, index) => date - dates[index]);
  const averageGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;

  return Math.max(1, Math.round(averageGap / 86_400_000));
}

function findProduct(productName: string, products: InventoryProduct[]) {
  return products.find(
    (product) => product.name.toLowerCase() === productName.toLowerCase(),
  );
}

export function explainRecommendation(input: {
  recommendation: HouseholdRecommendation;
  inventoryProducts: InventoryProduct[];
  purchases: Purchase[];
}): KnowledgeExplanation {
  const productName = input.recommendation.relatedProducts[0];
  const product = productName ? findProduct(productName, input.inventoryProducts) : undefined;
  const history = productName ? getProductPurchaseHistory(productName, input.purchases) : [];
  const averageDays = averageDaysBetweenPurchases(history);
  const confidence = product
    ? calculateProductConfidence(product, input.purchases)
    : Math.max(45, Math.min(85, input.recommendation.priority === "high" ? 78 : 58));
  const reasons = [
    input.recommendation.description,
    product ? `Stock actual: ${product.currentStock} ${product.unit}.` : "Recomendación basada en patrones del hogar.",
    product ? `Estado de inventario: ${product.statusLabel}.` : undefined,
    history.length > 0 ? `Historial: ${history.length} compra${history.length === 1 ? "" : "s"} relacionada${history.length === 1 ? "" : "s"}.` : "Historial limitado; se usa confianza conservadora.",
    averageDays ? `Frecuencia aproximada: cada ${averageDays} días.` : undefined,
  ].filter(Boolean) as string[];

  return {
    id: `explanation-${input.recommendation.id}`,
    targetId: input.recommendation.id,
    targetType: "recommendation",
    summary: `${input.recommendation.title}. Confianza ${confidence}%.`,
    reasons,
    confidence,
    origin: "Household Knowledge Platform",
  };
}

export function explainPrediction(input: {
  prediction: HouseholdPrediction;
  purchases: Purchase[];
}): KnowledgeExplanation {
  const history = getProductPurchaseHistory(input.prediction.productName, input.purchases);
  const confidence = calculatePredictionConfidence(input.prediction, input.purchases);

  return {
    id: `explanation-${input.prediction.id}`,
    targetId: input.prediction.id,
    targetType: "prediction",
    summary: `${input.prediction.title}. Confianza ${confidence}%.`,
    reasons: [
      input.prediction.description,
      history.length > 0
        ? `Se encontraron ${history.length} compras históricas relacionadas.`
        : "Hay poco historial para este producto.",
      input.prediction.estimatedDate
        ? `Fecha estimada: ${input.prediction.estimatedDate}.`
        : "Sin fecha estimada disponible.",
    ],
    confidence,
    origin: "PredictionEngine + ConfidenceEngine",
  };
}

export function explainPattern(pattern: HouseholdPattern): KnowledgeExplanation {
  return {
    id: `explanation-${pattern.id}`,
    targetId: pattern.id,
    targetType: "pattern",
    summary: `${pattern.title}. Confianza ${pattern.confidence}%.`,
    reasons: [
      pattern.description,
      pattern.relatedCategory ? `Categoría relacionada: ${pattern.relatedCategory}.` : "Sin categoría única asociada.",
      pattern.relatedProducts.length > 0
        ? `Productos relacionados: ${pattern.relatedProducts.join(", ")}.`
        : "Patrón agregado a nivel de hogar.",
    ],
    confidence: pattern.confidence,
    origin: "PatternAnalyzer",
  };
}

export function buildKnowledgeExplanations(input: {
  recommendations: HouseholdRecommendation[];
  predictions: HouseholdPrediction[];
  patterns: HouseholdPattern[];
  inventoryProducts: InventoryProduct[];
  purchases: Purchase[];
}) {
  return [
    ...input.recommendations.map((recommendation) =>
      explainRecommendation({
        recommendation,
        inventoryProducts: input.inventoryProducts,
        purchases: input.purchases,
      }),
    ),
    ...input.predictions.map((prediction) =>
      explainPrediction({
        prediction,
        purchases: input.purchases,
      }),
    ),
    ...input.patterns.map(explainPattern),
  ].slice(0, 30);
}
