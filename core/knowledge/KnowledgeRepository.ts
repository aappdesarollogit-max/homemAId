import { buildConfidenceInsights } from "@/core/knowledge/ConfidenceEngine";
import { buildKnowledgeExplanations } from "@/core/knowledge/ExplanationEngine";
import { buildHouseholdTimeline } from "@/core/knowledge/HouseholdTimeline";
import { buildKnowledgeGraph } from "@/core/knowledge/KnowledgeGraph";
import { buildPatternMemory } from "@/core/knowledge/PatternMemory";
import type {
  HouseholdAlert,
  HouseholdKnowledge,
  HouseholdMember,
  HouseholdPattern,
  HouseholdPrediction,
  HouseholdRecommendation,
  HouseholdSettings,
  InventoryProduct,
  Purchase,
} from "@/types/domain";

const KNOWLEDGE_STORAGE_KEY = "homemaid.household.knowledge";

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function emptyKnowledge(): HouseholdKnowledge {
  return {
    graph: {
      nodes: [],
      edges: [],
      generatedAt: new Date().toISOString(),
    },
    timeline: [],
    patternMemory: [],
    confidenceInsights: [],
    explanations: [],
    updatedAt: new Date().toISOString(),
  };
}

export function getKnowledge(): HouseholdKnowledge {
  if (!canUseLocalStorage()) return emptyKnowledge();

  const storedKnowledge = window.localStorage.getItem(KNOWLEDGE_STORAGE_KEY);
  if (!storedKnowledge) return emptyKnowledge();

  try {
    return {
      ...emptyKnowledge(),
      ...(JSON.parse(storedKnowledge) as HouseholdKnowledge),
    };
  } catch {
    return emptyKnowledge();
  }
}

export function saveKnowledge(knowledge: HouseholdKnowledge) {
  const nextKnowledge = {
    ...knowledge,
    timeline: knowledge.timeline.slice(0, 80),
    patternMemory: knowledge.patternMemory.slice(0, 40),
    explanations: knowledge.explanations.slice(0, 40),
    updatedAt: new Date().toISOString(),
  };

  if (canUseLocalStorage()) {
    window.localStorage.setItem(KNOWLEDGE_STORAGE_KEY, JSON.stringify(nextKnowledge));
  }

  return nextKnowledge;
}

export function updateKnowledge(updates: Partial<HouseholdKnowledge>) {
  return saveKnowledge({
    ...getKnowledge(),
    ...updates,
  });
}

export function refreshKnowledge(input: {
  inventoryProducts: InventoryProduct[];
  purchases: Purchase[];
  settings: HouseholdSettings;
  members: HouseholdMember[];
  patterns: HouseholdPattern[];
  predictions: HouseholdPrediction[];
  recommendations: HouseholdRecommendation[];
  alerts: HouseholdAlert[];
}) {
  const currentKnowledge = getKnowledge();
  const graph = buildKnowledgeGraph(input);
  const timeline = buildHouseholdTimeline(input);
  const patternMemory = buildPatternMemory({
    patterns: input.patterns,
    purchases: input.purchases,
    existing: currentKnowledge.patternMemory,
  });
  const confidenceInsights = buildConfidenceInsights({
    inventoryProducts: input.inventoryProducts,
    purchases: input.purchases,
    predictions: input.predictions,
  });
  const explanations = buildKnowledgeExplanations(input);

  return saveKnowledge({
    graph,
    timeline: [...timeline, ...currentKnowledge.timeline]
      .filter(
        (event, index, events) =>
          events.findIndex((candidate) => candidate.id === event.id) === index,
      )
      .slice(0, 80),
    patternMemory,
    confidenceInsights,
    explanations,
    updatedAt: new Date().toISOString(),
  });
}
