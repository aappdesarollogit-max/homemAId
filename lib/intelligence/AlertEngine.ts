import {
  getBudgetUsage,
  getMonthlySpend,
  getSpendByCategory,
} from "@/lib/services/consumption-service";
import type {
  HouseholdAlert,
  HouseholdMemorySnapshot,
  HouseholdSettings,
  InventoryProduct,
  Purchase,
  RiskLevel,
} from "@/types/domain";

type AlertInput = {
  inventoryProducts: InventoryProduct[];
  purchases: Purchase[];
  settings: HouseholdSettings;
  memory?: HouseholdMemorySnapshot;
};

function nowIso() {
  return new Date().toISOString();
}

function alertSeverity(usage: number): RiskLevel {
  if (usage >= 100) return "critical";
  if (usage >= 90) return "high";
  if (usage >= 75) return "medium";
  return "low";
}

export function generateHouseholdAlerts({
  inventoryProducts,
  purchases,
  settings,
  memory,
}: AlertInput): HouseholdAlert[] {
  const createdAt = nowIso();
  const resolvedIds = new Set(
    memory?.alerts.filter((alert) => alert.resolved).map((alert) => alert.id) ?? [],
  );
  const alerts: HouseholdAlert[] = [];
  const monthlySpend = getMonthlySpend(purchases);
  const budgetUsage = getBudgetUsage(monthlySpend, settings.monthlyBudget);

  inventoryProducts
    .filter((product) => product.status === "out")
    .slice(0, 4)
    .forEach((product) => {
      alerts.push({
        id: `alert-out-${product.id}`,
        type: "product_out",
        title: "Producto agotado",
        description: `${product.name} está agotado.`,
        severity: "critical",
        createdAt,
      });
    });

  inventoryProducts
    .filter((product) => product.status === "critical" || product.status === "low")
    .slice(0, 5)
    .forEach((product) => {
      alerts.push({
        id: `alert-critical-${product.id}`,
        type: "product_critical",
        title: "Producto por agotarse",
        description: `${product.name} requiere atención en inventario.`,
        severity: product.status === "critical" ? "high" : "medium",
        createdAt,
      });
    });

  if (settings.monthlyBudget > 0 && budgetUsage > 100) {
    alerts.push({
      id: "alert-budget-over",
      type: "budget_over",
      title: "Presupuesto superado",
      description: `El gasto mensual va en ${budgetUsage}% del presupuesto.`,
      severity: "critical",
      createdAt,
    });
  } else if (settings.monthlyBudget > 0 && budgetUsage >= settings.budgetAlertThreshold) {
    alerts.push({
      id: "alert-budget-threshold",
      type: "budget_threshold",
      title: "Presupuesto en zona de atención",
      description: `El gasto mensual alcanzó ${budgetUsage}% del presupuesto.`,
      severity: alertSeverity(budgetUsage),
      createdAt,
    });
  }

  const averagePurchase =
    purchases.length > 0 ? monthlySpend / Math.max(1, purchases.length) : 0;
  const unusualPurchase = purchases.find(
    (purchase) => averagePurchase > 0 && purchase.total > averagePurchase * 1.8,
  );
  if (unusualPurchase) {
    alerts.push({
      id: `alert-unusual-${unusualPurchase.id}`,
      type: "unusual_purchase",
      title: "Compra inusual",
      description: `${unusualPurchase.store} superó el monto promedio reciente.`,
      severity: "medium",
      createdAt,
    });
  }

  const concentratedCategory = getSpendByCategory(purchases, inventoryProducts).find(
    (category) => category.percentage >= 60,
  );
  if (concentratedCategory) {
    alerts.push({
      id: `alert-concentration-${concentratedCategory.label}`,
      type: "spend_concentration",
      title: "Alta concentración de gasto",
      description: `${concentratedCategory.label} concentra ${concentratedCategory.percentage}% del gasto.`,
      severity: alertSeverity(concentratedCategory.percentage),
      createdAt,
    });
  }

  if (purchases.length === 0) {
    alerts.push({
      id: "alert-no-recent-purchases",
      type: "no_recent_purchases",
      title: "Sin compras registradas",
      description: "Aún no hay historial suficiente para proyectar consumo con precisión.",
      severity: "low",
      createdAt,
    });
  }

  if (inventoryProducts.length === 0) {
    alerts.push({
      id: "alert-inventory-stale",
      type: "inventory_stale",
      title: "Inventario sin datos",
      description: "Agrega productos para activar recomendaciones y predicciones más útiles.",
      severity: "medium",
      createdAt,
    });
  }

  return alerts
    .map((alert) => ({
      ...alert,
      resolved: resolvedIds.has(alert.id),
    }))
    .filter((alert) => !alert.resolved)
    .slice(0, 10);
}
