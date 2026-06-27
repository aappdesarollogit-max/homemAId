import { formatCurrency, householdSummary } from "@/lib/mock-home";
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
    id: "top-store",
    label: "Tienda principal",
    message: "¿Dónde gasté más?",
  },
  {
    id: "alerts",
    label: "Alertas",
    message: "¿Qué alertas hay?",
  },
  {
    id: "home-summary",
    label: "Resumen hogar",
    message: "¿Cómo está mi hogar?",
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

export function getAssistantContext(): AssistantContext {
  const inventoryProducts = getInventoryProducts();
  const purchases = getPurchases();
  const monthlySpend = getMonthlySpend(purchases);
  const budgetUsage = getBudgetUsage(monthlySpend, householdSummary.monthlyBudget);
  const criticalProducts = getCriticalProducts(inventoryProducts);
  const topProducts = getTopPurchasedProducts(purchases);
  const spendByStore = getSpendByStore(purchases);
  const alerts = getConsumptionAlerts(
    purchases,
    inventoryProducts,
    householdSummary.monthlyBudget,
  );

  return {
    inventoryProducts,
    purchases,
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
      "por agotarse",
      "que me falta",
      "productos criticos",
      "stock bajo",
      "agotado",
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
  const budget = householdSummary.monthlyBudget;

  if (budget <= 0) {
    return `Este mes llevas ${formatCurrency(monthlySpend)} gastados. No hay presupuesto configurado para calcular porcentaje.`;
  }

  return `Este mes llevas ${formatCurrency(monthlySpend)} gastados. Eso equivale al ${budgetUsage}% de tu presupuesto mensual de ${formatCurrency(budget)}.`;
}

export function getShoppingRecommendation(context: AssistantContext) {
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
  const alerts = context.consumptionMetrics.alerts;

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

  return `Resumen del hogar: tienes ${productsCount} productos en inventario, ${criticalCount} requieren atención, ${purchasesCount} compras registradas y llevas ${monthlySpend} gastados este mes.`;
}

function getHelpAnswer() {
  return "Puedo ayudarte con productos críticos, gasto mensual, lista de compras sugerida, productos más comprados, tienda con mayor gasto, alertas y resumen del hogar.";
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
  if (intent === "help") return getHelpAnswer();

  return `No estoy seguro de haber entendido. ${getHelpAnswer()}`;
}
