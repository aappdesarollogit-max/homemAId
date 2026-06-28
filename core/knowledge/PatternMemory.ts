import type { HouseholdPattern, PatternMemoryItem, Purchase } from "@/types/domain";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function productPurchaseCount(productName: string, purchases: Purchase[]) {
  const normalizedName = normalize(productName);
  return purchases.filter((purchase) =>
    purchase.items.some((item) => normalize(item.productName) === normalizedName),
  ).length;
}

export function buildPatternMemory(input: {
  patterns: HouseholdPattern[];
  purchases: Purchase[];
  existing?: PatternMemoryItem[];
}): PatternMemoryItem[] {
  const existingMap = new Map(input.existing?.map((item) => [item.id, item]) ?? []);
  const now = new Date().toISOString();

  const patternItems = input.patterns.map((pattern) => {
    const existing = existingMap.get(pattern.id);
    const occurrenceBoost = Math.max(
      1,
      pattern.relatedProducts.reduce(
        (total, productName) => total + productPurchaseCount(productName, input.purchases),
        0,
      ),
    );

    return {
      id: pattern.id,
      title: pattern.title,
      description: pattern.description,
      confidence: pattern.confidence,
      firstSeenAt: existing?.firstSeenAt ?? pattern.createdAt ?? now,
      lastSeenAt: now,
      occurrences: (existing?.occurrences ?? 0) + occurrenceBoost,
      relatedProducts: pattern.relatedProducts,
    };
  });

  return [...patternItems, ...(input.existing ?? []).filter((item) => !patternItems.some((pattern) => pattern.id === item.id))]
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 30);
}
