import type {
  HouseholdAlert,
  HouseholdMemorySnapshot,
  HouseholdPattern,
  HouseholdRecommendation,
} from "@/types/domain";

const MEMORY_STORAGE_KEY = "homemaid.household.intelligence.memory";

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function emptyMemory(): HouseholdMemorySnapshot {
  return {
    patterns: [],
    recommendations: [],
    alerts: [],
    scoreHistory: [],
  };
}

export function getHouseholdMemory(): HouseholdMemorySnapshot {
  if (!canUseLocalStorage()) return emptyMemory();

  const storedMemory = window.localStorage.getItem(MEMORY_STORAGE_KEY);
  if (!storedMemory) return emptyMemory();

  try {
    return {
      ...emptyMemory(),
      ...(JSON.parse(storedMemory) as HouseholdMemorySnapshot),
    };
  } catch {
    return emptyMemory();
  }
}

export function saveHouseholdMemory(memory: HouseholdMemorySnapshot) {
  const nextMemory: HouseholdMemorySnapshot = {
    ...memory,
    patterns: memory.patterns.slice(0, 20),
    recommendations: memory.recommendations.slice(0, 20),
    alerts: memory.alerts.slice(0, 30),
    scoreHistory: memory.scoreHistory.slice(-30),
  };

  if (canUseLocalStorage()) {
    window.localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(nextMemory));
  }

  return nextMemory;
}

export function persistIntelligenceSnapshot(input: {
  patterns: HouseholdPattern[];
  recommendations: HouseholdRecommendation[];
  alerts: HouseholdAlert[];
  healthScore: number;
}) {
  const currentMemory = getHouseholdMemory();
  const createdAt = new Date().toISOString();

  return saveHouseholdMemory({
    patterns: input.patterns,
    recommendations: input.recommendations,
    alerts: [
      ...input.alerts,
      ...currentMemory.alerts.filter((alert) => alert.resolved),
    ],
    lastAnalysisAt: createdAt,
    scoreHistory: [
      ...currentMemory.scoreHistory,
      {
        score: input.healthScore,
        createdAt,
      },
    ],
  });
}

export function resolveHouseholdAlert(id: string) {
  const memory = getHouseholdMemory();
  const nextAlerts = memory.alerts.map((alert) =>
    alert.id === id ? { ...alert, resolved: true } : alert,
  );

  return saveHouseholdMemory({
    ...memory,
    alerts: nextAlerts,
  });
}
