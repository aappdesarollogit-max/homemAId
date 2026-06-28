import type {
  ConfidenceInsight,
  HouseholdPrediction,
  InventoryProduct,
  Purchase,
} from "@/types/domain";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function clampConfidence(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function getProductPurchaseHistory(productName: string, purchases: Purchase[]) {
  const normalizedName = normalize(productName);

  return purchases.filter((purchase) =>
    purchase.items.some((item) => normalize(item.productName) === normalizedName),
  );
}

export function calculateProductConfidence(
  product: Pick<InventoryProduct, "name" | "status" | "estimatedDaysLeft">,
  purchases: Purchase[],
) {
  const productHistory = getProductPurchaseHistory(product.name, purchases);
  const historyScore = Math.min(55, productHistory.length * 12);
  const stockScore = product.status === "out" || product.status === "critical" ? 25 : 12;
  const timingScore = product.estimatedDaysLeft <= 3 ? 15 : product.estimatedDaysLeft <= 7 ? 10 : 4;

  return clampConfidence(18 + historyScore + stockScore + timingScore);
}

export function calculatePredictionConfidence(
  prediction: HouseholdPrediction,
  purchases: Purchase[],
) {
  const historyCount = getProductPurchaseHistory(prediction.productName, purchases).length;
  const base = prediction.confidence;
  const historyBonus = Math.min(20, historyCount * 5);

  return clampConfidence((base + historyBonus) / 1.15);
}

export function buildConfidenceInsights(input: {
  inventoryProducts: InventoryProduct[];
  purchases: Purchase[];
  predictions: HouseholdPrediction[];
}): ConfidenceInsight[] {
  const productInsights = input.inventoryProducts
    .slice(0, 6)
    .map((product) => {
      const history = getProductPurchaseHistory(product.name, input.purchases);
      const confidence = calculateProductConfidence(product, input.purchases);

      return {
        id: `confidence-product-${product.id}`,
        label: product.name,
        confidence,
        reason:
          history.length > 0
            ? `${history.length} compra${history.length === 1 ? "" : "s"} registrada${history.length === 1 ? "" : "s"} y estado ${product.statusLabel}.`
            : "Poca información histórica; confianza conservadora.",
      };
    });

  const predictionInsights = input.predictions.slice(0, 4).map((prediction) => ({
    id: `confidence-prediction-${prediction.id}`,
    label: prediction.productName,
    confidence: calculatePredictionConfidence(prediction, input.purchases),
    reason: prediction.description,
  }));

  return [...productInsights, ...predictionInsights]
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 8);
}
