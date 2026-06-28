import type {
  HouseholdAlert,
  HouseholdMember,
  HouseholdSettings,
  InventoryProduct,
  Purchase,
  RiskLevel,
} from "@/types/domain";

type ScoreInput = {
  inventoryProducts: InventoryProduct[];
  purchases: Purchase[];
  settings: HouseholdSettings;
  members: HouseholdMember[];
  alerts: HouseholdAlert[];
  budgetUsage: number;
  monthlySpend: number;
};

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getRiskLevel(score: number): RiskLevel {
  if (score < 35) return "critical";
  if (score < 55) return "high";
  if (score < 75) return "medium";
  return "low";
}

export function calculateHouseholdHealthScore({
  inventoryProducts,
  purchases,
  settings,
  members,
  alerts,
  budgetUsage,
  monthlySpend,
}: ScoreInput) {
  let score = 100;
  const criticalProducts = inventoryProducts.filter((product) => product.status !== "ok");
  const categories = new Set(
    purchases.flatMap((purchase) => purchase.items.map((item) => item.productName)),
  );

  score -= criticalProducts.length * 6;
  score -= alerts.filter((alert) => alert.severity === "critical").length * 12;
  score -= alerts.filter((alert) => alert.severity === "high").length * 8;
  score -= alerts.filter((alert) => alert.severity === "medium").length * 4;

  if (budgetUsage > 100) score -= 20;
  else if (budgetUsage >= settings.budgetAlertThreshold) score -= 10;

  if (purchases.length === 0) score -= 8;
  if (inventoryProducts.length === 0) score -= 12;
  if (categories.size <= 2 && purchases.length >= 3) score -= 5;
  if (monthlySpend <= 0 && purchases.length > 0) score -= 4;

  if (!settings.name.trim()) score -= 4;
  if (!settings.owner.trim()) score -= 4;
  if (settings.monthlyBudget <= 0) score -= 8;
  if (members.length === 0) score -= 6;
  if (settings.favoriteStores.length === 0) score -= 3;
  if (settings.priorityCategories.length === 0) score -= 3;

  return clampScore(score);
}
