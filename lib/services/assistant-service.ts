import { generateHomeIntelligence } from "@/lib/intelligence/HomeIntelligenceEngine";
import { formatCurrency } from "@/lib/mock-home";
import {
  getBudgetUsage,
  getConsumptionAlerts,
  getCriticalProducts,
  getMonthlySpend,
  getSpendByStore,
  getTopPurchasedProducts,
} from "@/lib/services/consumption-service";
import { getInventoryProducts } from "@/lib/services/inventory-service";
import { getPurchases } from "@/lib/services/purchase-service";
import { getHouseholdMembers, getHouseholdSettings } from "@/lib/services/settings-service";
import type { AssistantContext, AssistantIntent } from "@/types/domain";

export const assistantQuickActions = [
  {
    id: "stock",
    label: "Productos críticos",
    message: "¿Qué productos están por agotarse?",
  },
  {
    id: "spend",
    label: "Gasto mensual",
    message: "¿Cuánto gasté este mes?",
  },
  {
    id: "weekly-list",
    label: "Lista sugerida",
    message: "¿Qué debería comprar?",
  },
  {
    id: "top-products",
    label: "Top productos",
    message: "¿Qué compro más?",
  },
  {
    id: "intelligence",
    label: "Inteligencia",
    message: "¿Cuál es el estado inteligente del hogar?",
  },
  {
    id: "risks",
    label: "Riesgos",
    message: "¿Qué riesgos tengo?",
  },
  {
    id: "patterns",
    label: "Patrones",
    message: "¿Qué patrones detectaste?",
  },
];

function normalizeMessage(message: string) {
  return message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function includesAny(message: string, patterns: string[]) {
  return patterns.some((pattern) => message.includes(pattern));
}

function formatProductList(products: Array<{ name: string }>) {
  if (products.length === 0) return "";
  if (products.length === 1) return products[0].name;

  const names = products.map((product) => product.name);
  return `${names.slice(0, -1).join(", ")} y ${names[names.length - 1]}`;
}

function formatRecommendationWithKnowledge(recommendation: {
  title: string;
  description: string;
  confidence?: number;
  explanation?: string;
  origin?: string;
}) {
  const confidence = recommendation.confidence ?? 55;
  const explanation = recommendation.explanation ?? recommendation.description;
  const origin = recommendation.origin ?? "Home Intelligence Engine";

  return `${recommendation.title}. Confianza: ${confidence}%. Explicación: ${explanation} Origen: ${origin}.`;
}

export function getAssistantContext(): AssistantContext {
  const inventoryProducts = getInventoryProducts();
  const purchases = getPurchases();
  const settings = getHouseholdSettings();
  const members = getHouseholdMembers();
  const monthlySpend = getMonthlySpend(purchases);
  const budgetUsage = getBudgetUsage(monthlySpend, settings.monthlyBudget);
  const criticalProducts = getCriticalProducts(inventoryProducts);
  const topProducts = getTopPurchasedProducts(purchases);
  const spendByStore = getSpendByStore(purchases);
  const alerts = getConsumptionAlerts(
    purchases,
    inventoryProducts,
    settings.monthlyBudget,
    settings.budgetAlertThreshold,
  );
  const intelligenceSummary = generateHomeIntelligence({
    inventoryProducts,
    purchases,
    settings,
    members,
    persistMemory: true,
  });

  return {
    inventoryProducts,
    purchases,
    settings,
    members,
    intelligenceSummary,
    consumptionMetrics: {
      monthlySpend,
      budgetUsage,
      criticalProducts,
      topProducts,
      spendByStore,
      alerts,
    },
  };
}

export function resolveAssistantIntent(message: string): AssistantIntent {
  const normalizedMessage = normalizeMessage(message);

  if (
    includesAny(normalizedMessage, [
      "que va a pasar esta semana",
      "esta semana",
      "proximos dias",
    ])
  ) {
    return "weekly_outlook";
  }

  if (
    includesAny(normalizedMessage, [
      "que me recomiendas",
      "recomendaciones",
      "recomienda",
    ])
  ) {
    return "intelligence_recommendation";
  }

  if (
    includesAny(normalizedMessage, [
      "estado inteligente",
      "inteligente del hogar",
      "estado del hogar inteligente",
    ])
  ) {
    return "intelligence_status";
  }

  if (includesAny(normalizedMessage, ["que riesgos tengo", "riesgos inteligentes"])) {
    return "intelligence_risks";
  }

  if (includesAny(normalizedMessage, ["patrones detectaste", "que patrones", "patrones"])) {
    return "intelligence_patterns";
  }

  if (includesAny(normalizedMessage, ["como puedo ahorrar", "ahorrar", "ahorro"])) {
    return "savings_advice";
  }

  if (includesAny(normalizedMessage, ["que deberia revisar hoy", "revisar hoy"])) {
    return "today_review";
  }

  if (
    includesAny(normalizedMessage, [
      "por agotarse",
      "que me falta",
      "productos criticos",
      "stock bajo",
      "agotado",
      "productos se acabaran pronto",
      "se acabaran pronto",
    ])
  ) {
    return "critical_products";
  }

  if (
    includesAny(normalizedMessage, [
      "cuanto gaste",
      "gasto del mes",
      "presupuesto",
      "gasto mensual",
    ])
  ) {
    return "monthly_spend";
  }

  if (
    includesAny(normalizedMessage, [
      "que deberia comprar",
      "sugiere una lista",
      "lista de compras",
      "que compro",
      "comprar",
    ])
  ) {
    return "shopping_recommendation";
  }

  if (
    includesAny(normalizedMessage, [
      "compro mas",
      "productos mas comprados",
      "producto mas comprado",
    ])
  ) {
    return "top_products";
  }

  if (
    includesAny(normalizedMessage, [
      "donde gaste mas",
      "tienda principal",
      "tienda con mayor gasto",
    ])
  ) {
    return "top_store";
  }

  if (includesAny(normalizedMessage, ["alertas", "riesgos", "problemas"])) {
    return "budget_alert";
  }

  if (includesAny(normalizedMessage, ["resumen", "como esta mi hogar", "estado del hogar"])) {
    return "home_summary";
  }

  if (includesAny(normalizedMessage, ["ayuda", "que puedes hacer", "opciones"])) {
    return "help";
  }

  return "unknown";
}

export function getCriticalProductsAnswer(context: AssistantContext) {
  const criticalProducts = context.consumptionMetrics.criticalProducts;

  if (criticalProducts.length === 0) {
    return "Tu inventario está en buen estado. No encontré productos críticos ni con stock bajo.";
  }

  return `Tienes ${criticalProducts.length} producto${criticalProducts.length === 1 ? "" : "s"} que requieren atención: ${formatProductList(criticalProducts)}. Te recomiendo agregarlos a tu próxima compra.`;
}

export function getMonthlySpendAnswer(context: AssistantContext) {
  const { monthlySpend, budgetUsage } = context.consumptionMetrics;
  const budget = context.settings.monthlyBudget;

  if (budget <= 0) {
    return `Este mes llevas ${formatCurrency(monthlySpend)} gastados. No hay presupuesto configurado para calcular porcentaje.`;
  }

  return `Este mes llevas ${formatCurrency(monthlySpend)} gastados. Eso equivale al ${budgetUsage}% de tu presupuesto mensual de ${formatCurrency(budget)}.`;
}

export function getShoppingRecommendation(context: AssistantContext) {
  const recommendation = context.intelligenceSummary?.recommendations.find(
    (candidate) => candidate.type === "shopping" || candidate.type === "inventory",
  );

  if (recommendation) {
    return formatRecommendationWithKnowledge(recommendation);
  }

  const criticalProducts = context.consumptionMetrics.criticalProducts;

  if (criticalProducts.length === 0) {
    return "No veo productos urgentes para comprar. Puedes revisar ofertas o reponer básicos cuando baje el stock.";
  }

  return `Te recomiendo comprar: ${formatProductList(criticalProducts)}. Los prioricé porque están críticos, agotados o con stock bajo.`;
}

export function getTopProductsAnswer(context: AssistantContext) {
  const topProducts = context.consumptionMetrics.topProducts;

  if (topProducts.length === 0) {
    return "Aún no hay historial suficiente de compras para detectar tus productos más comprados.";
  }

  const summary = topProducts
    .slice(0, 3)
    .map((product) => `${product.productName} (${product.quantity} ${product.unit})`)
    .join(", ");

  return `Tus productos más comprados son: ${summary}.`;
}

export function getTopStoreAnswer(context: AssistantContext) {
  const topStore = context.consumptionMetrics.spendByStore[0];

  if (!topStore) {
    return "Aún no hay compras registradas para identificar la tienda con mayor gasto.";
  }

  return `La tienda con mayor gasto es ${topStore.label}, con ${formatCurrency(topStore.amount)} (${topStore.percentage}% del total).`;
}

export function getBudgetAlertAnswer(context: AssistantContext) {
  const alerts = context.intelligenceSummary?.alerts ?? context.consumptionMetrics.alerts;

  if (alerts.length === 0) {
    return "No veo alertas importantes por ahora. El consumo y el inventario se ven controlados.";
  }

  return alerts.map((alert) => `${alert.title}: ${alert.description}`).join(" ");
}

export function getHomeSummaryAnswer(context: AssistantContext) {
  const productsCount = context.inventoryProducts.length;
  const purchasesCount = context.purchases.length;
  const criticalCount = context.consumptionMetrics.criticalProducts.length;
  const monthlySpend = formatCurrency(context.consumptionMetrics.monthlySpend);

  return `Resumen de ${context.settings.name}: ${context.settings.owner} tiene ${productsCount} productos en inventario, ${context.members.length} integrantes, ${criticalCount} requieren atención, ${purchasesCount} compras registradas y lleva ${monthlySpend} gastados este mes.`;
}

export function getWeeklyOutlookAnswer(context: AssistantContext) {
  const intelligence = context.intelligenceSummary;
  if (!intelligence) return getHomeSummaryAnswer(context);

  const predictions = intelligence.predictedStockOuts.slice(0, 3);
  const recommendation = intelligence.recommendations[0];

  if (predictions.length === 0 && !recommendation) {
    return "Esta semana no veo riesgos urgentes. Mantén inventario y compras actualizados para mejorar las predicciones.";
  }

  const stockText =
    predictions.length > 0
      ? `Productos a vigilar: ${predictions.map((prediction) => prediction.productName).join(", ")}.`
      : "No veo productos con agotamiento cercano.";
  const actionText = recommendation ? ` Próxima acción sugerida: ${recommendation.title}.` : "";

  return `${stockText}${actionText}`;
}

export function getIntelligenceRecommendationAnswer(context: AssistantContext) {
  const recommendations = context.intelligenceSummary?.recommendations ?? [];

  if (recommendations.length === 0) {
    return "No tengo recomendaciones inteligentes suficientes todavía. Agrega compras e inventario para detectar mejores señales.";
  }

  return recommendations.slice(0, 3).map(formatRecommendationWithKnowledge).join(" ");
}

export function getIntelligenceStatusAnswer(context: AssistantContext) {
  const intelligence = context.intelligenceSummary;
  if (!intelligence) return getHomeSummaryAnswer(context);

  return `El estado inteligente del hogar tiene score ${intelligence.healthScore}/100 y riesgo ${intelligence.riskLevel}. Detecté ${intelligence.alerts.length} alerta${intelligence.alerts.length === 1 ? "" : "s"}, ${intelligence.patterns.length} patrón${intelligence.patterns.length === 1 ? "" : "es"} y ${intelligence.criticalProductsCount} producto${intelligence.criticalProductsCount === 1 ? "" : "s"} en atención.`;
}

export function getIntelligenceRisksAnswer(context: AssistantContext) {
  const alerts = context.intelligenceSummary?.alerts ?? [];

  if (alerts.length === 0) {
    return "No detecté riesgos importantes por ahora. El hogar se ve controlado.";
  }

  return alerts
    .slice(0, 4)
    .map((alert) => `${alert.title}: ${alert.description}`)
    .join(" ");
}

export function getIntelligencePatternsAnswer(context: AssistantContext) {
  const patterns = context.intelligenceSummary?.patterns ?? [];

  if (patterns.length === 0) {
    return "Todavía no hay patrones fuertes. Con más compras registradas podré detectar hábitos y riesgos con mejor confianza.";
  }

  return patterns
    .slice(0, 3)
    .map((pattern) => `${pattern.title}: ${pattern.description}`)
    .join(" ");
}

export function getSavingsAdviceAnswer(context: AssistantContext) {
  const recommendations =
    context.intelligenceSummary?.recommendations.filter(
      (recommendation) =>
        recommendation.impact === "ahorro" || recommendation.impact === "presupuesto",
    ) ?? [];

  if (recommendations.length === 0) {
    return "Para ahorrar, empieza por mantener compras e inventario actualizados. Por ahora no veo una fuga clara de gasto.";
  }

  return recommendations
    .slice(0, 3)
    .map((recommendation) => recommendation.description)
    .join(" ");
}

export function getTodayReviewAnswer(context: AssistantContext) {
  const alert = context.intelligenceSummary?.alerts[0];
  const recommendation = context.intelligenceSummary?.recommendations[0];

  if (!alert && !recommendation) {
    return "Hoy no veo tareas urgentes. Una buena revisión rápida sería confirmar stock de básicos y registrar cualquier compra pendiente.";
  }

  return `${alert ? `Revisa esto primero: ${alert.title}. ${alert.description}` : ""}${recommendation ? ` Luego: ${recommendation.description}` : ""}`;
}

function getHelpAnswer() {
  return "Puedo ayudarte con productos críticos, gasto mensual, lista de compras sugerida, productos más comprados, tienda con mayor gasto, alertas, resumen del hogar, predicciones, riesgos, patrones y recomendaciones inteligentes.";
}

export function generateAssistantResponse(message: string, context: AssistantContext) {
  const intent = resolveAssistantIntent(message);

  if (intent === "critical_products") return getCriticalProductsAnswer(context);
  if (intent === "monthly_spend") return getMonthlySpendAnswer(context);
  if (intent === "shopping_recommendation") return getShoppingRecommendation(context);
  if (intent === "top_products") return getTopProductsAnswer(context);
  if (intent === "top_store") return getTopStoreAnswer(context);
  if (intent === "budget_alert") return getBudgetAlertAnswer(context);
  if (intent === "home_summary") return getHomeSummaryAnswer(context);
  if (intent === "weekly_outlook") return getWeeklyOutlookAnswer(context);
  if (intent === "intelligence_recommendation") return getIntelligenceRecommendationAnswer(context);
  if (intent === "intelligence_status") return getIntelligenceStatusAnswer(context);
  if (intent === "intelligence_risks") return getIntelligenceRisksAnswer(context);
  if (intent === "intelligence_patterns") return getIntelligencePatternsAnswer(context);
  if (intent === "savings_advice") return getSavingsAdviceAnswer(context);
  if (intent === "today_review") return getTodayReviewAnswer(context);
  if (intent === "help") return getHelpAnswer();

  return `No estoy seguro de haber entendido. ${getHelpAnswer()}`;
}

export function registerPurchaseFromConversation() {
  // Future integration point: AI-parsed purchases must enter through DataIngestionEngine.
  throw new Error("registerPurchaseFromConversation is reserved for a future AI ingestion sprint.");
}
