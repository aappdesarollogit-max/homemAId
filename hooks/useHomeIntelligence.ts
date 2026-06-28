"use client";

import { useCallback, useEffect, useState } from "react";
import { generateHomeIntelligence } from "@/lib/intelligence/HomeIntelligenceEngine";
import {
  getHouseholdMemory,
  resolveHouseholdAlert,
} from "@/lib/intelligence/HouseholdMemory";
import { getInventoryProducts } from "@/lib/services/inventory-service";
import { getPurchases } from "@/lib/services/purchase-service";
import { getHouseholdMembers, getHouseholdSettings } from "@/lib/services/settings-service";
import type { HouseholdIntelligenceSummary, HouseholdMemorySnapshot } from "@/types/domain";

export function useHomeIntelligence() {
  const [intelligenceSummary, setIntelligenceSummary] =
    useState<HouseholdIntelligenceSummary>();
  const [memory, setMemory] = useState<HouseholdMemorySnapshot>(getHouseholdMemory());
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshIntelligence = useCallback(() => {
    const summary = generateHomeIntelligence({
      inventoryProducts: getInventoryProducts(),
      purchases: getPurchases(),
      settings: getHouseholdSettings(),
      members: getHouseholdMembers(),
      persistMemory: true,
    });

    setIntelligenceSummary(summary);
    setMemory(getHouseholdMemory());
    setIsLoaded(true);
    return summary;
  }, []);

  useEffect(() => {
    queueMicrotask(refreshIntelligence);
  }, [refreshIntelligence]);

  function resolveAlert(id: string) {
    resolveHouseholdAlert(id);
    return refreshIntelligence();
  }

  return {
    isLoaded,
    memory,
    intelligenceSummary,
    patterns: intelligenceSummary?.patterns ?? [],
    predictions: intelligenceSummary?.predictedStockOuts ?? [],
    recommendations: intelligenceSummary?.recommendations ?? [],
    alerts: intelligenceSummary?.alerts ?? [],
    healthScore: intelligenceSummary?.healthScore ?? 0,
    riskLevel: intelligenceSummary?.riskLevel ?? "low",
    refreshIntelligence,
    resolveAlert,
  };
}
