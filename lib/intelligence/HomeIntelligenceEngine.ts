import { generateHouseholdAlerts } from "@/lib/intelligence/AlertEngine";
import { refreshKnowledge } from "@/core/knowledge/KnowledgeRepository";
import {
  calculateHouseholdHealthScore,
  getRiskLevel,
} from "@/lib/intelligence/IntelligenceScoring";
import {
  getHouseholdMemory,
  persistIntelligenceSnapshot,
} from "@/lib/intelligence/HouseholdMemory";
import { analyzeHouseholdPatterns } from "@/lib/intelligence/PatternAnalyzer";
import { predictHouseholdNeeds } from "@/lib/intelligence/PredictionEngine";
import { generateHouseholdRecommendations } from "@/lib/intelligence/RecommendationEngine";
import {
  getBudgetUsage,
  getMonthlySpend,
} from "@/lib/services/consumption-service";
import type {
  HouseholdIntelligenceSummary,
  HouseholdMember,
  HouseholdSettings,
  InventoryProduct,
  Purchase,
} from "@/types/domain";

export type HomeIntelligenceInput = {
  inventoryProducts: InventoryProduct[];
  purchases: Purchase[];
  settings: HouseholdSettings;
  members: HouseholdMember[];
  persistMemory?: boolean;
};

export function generateHomeIntelligence({
  inventoryProducts,
  purchases,
  settings,
  members,
  persistMemory = true,
}: HomeIntelligenceInput): HouseholdIntelligenceSummary {
  const memory = getHouseholdMemory();
  const monthlySpend = getMonthlySpend(purchases);
  const budgetUsage = getBudgetUsage(monthlySpend, settings.monthlyBudget);
  const patterns = analyzeHouseholdPatterns({
    inventoryProducts,
    purchases,
    settings,
  });
  const predictions = predictHouseholdNeeds({
    inventoryProducts,
    purchases,
    settings,
    patterns,
  });
  const alerts = generateHouseholdAlerts({
    inventoryProducts,
    purchases,
    settings,
    memory,
  });
  const healthScore = calculateHouseholdHealthScore({
    inventoryProducts,
    purchases,
    settings,
    members,
    alerts,
    budgetUsage,
    monthlySpend,
  });
  const recommendations = generateHouseholdRecommendations({
    inventoryProducts,
    settings,
    patterns,
    predictions,
    alerts,
    budgetUsage,
  });
  const knowledge = refreshKnowledge({
    inventoryProducts,
    purchases,
    settings,
    members,
    patterns,
    predictions,
    recommendations,
    alerts,
  });
  const recommendationsWithKnowledge = recommendations.map((recommendation) => {
    const explanation = knowledge.explanations.find(
      (candidate) => candidate.targetId === recommendation.id,
    );

    return {
      ...recommendation,
      confidence: explanation?.confidence,
      explanation: explanation?.summary,
      origin: explanation?.origin,
    };
  });
  const summary: HouseholdIntelligenceSummary = {
    healthScore,
    riskLevel: getRiskLevel(healthScore),
    monthlySpend,
    budgetUsage,
    criticalProductsCount: inventoryProducts.filter((product) => product.status !== "ok")
      .length,
    predictedStockOuts: predictions.filter(
      (prediction) =>
        prediction.predictionType === "stock_out" ||
        prediction.predictionType === "restock",
    ),
    recommendations: recommendationsWithKnowledge,
    alerts,
    patterns,
    knowledge,
  };

  if (persistMemory) {
    persistIntelligenceSnapshot({
      patterns,
      recommendations: recommendationsWithKnowledge,
      alerts,
      healthScore,
    });
  }

  return summary;
}
