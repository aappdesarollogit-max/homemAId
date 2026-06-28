import type {
  HouseholdAlert,
  HouseholdPrediction,
  HouseholdSettings,
  HouseholdTimelineEvent,
  InventoryProduct,
  Purchase,
} from "@/types/domain";

function parseDateOrNow(value?: string) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

export function buildHouseholdTimeline(input: {
  inventoryProducts: InventoryProduct[];
  purchases: Purchase[];
  settings: HouseholdSettings;
  predictions: HouseholdPrediction[];
  alerts: HouseholdAlert[];
}): HouseholdTimelineEvent[] {
  const events: HouseholdTimelineEvent[] = [];

  input.purchases.forEach((purchase) => {
    events.push({
      id: `timeline-purchase-${purchase.id}`,
      type: "purchase_created",
      title: `Compra en ${purchase.store}`,
      description: `${purchase.items.length} producto${purchase.items.length === 1 ? "" : "s"} registrado${purchase.items.length === 1 ? "" : "s"}.`,
      createdAt: parseDateOrNow(purchase.date),
      source: "purchases",
      relatedEntityId: purchase.id,
    });
  });

  input.inventoryProducts.forEach((product) => {
    events.push({
      id: `timeline-product-${product.id}`,
      type: "product_added",
      title: `${product.name} en inventario`,
      description: `${product.quantity} disponible en ${product.category}.`,
      createdAt: parseDateOrNow(product.openedAt),
      source: "inventory",
      relatedEntityId: product.id,
    });

    if (product.status === "out" || product.status === "critical") {
      events.push({
        id: `timeline-stock-${product.id}`,
        type: product.status === "out" ? "product_out" : "stock_critical",
        title: product.status === "out" ? `${product.name} agotado` : `${product.name} crítico`,
        description: product.statusLabel,
        createdAt: new Date().toISOString(),
        source: "inventory",
        relatedEntityId: product.id,
      });
    }
  });

  input.predictions.slice(0, 5).forEach((prediction) => {
    events.push({
      id: `timeline-prediction-${prediction.id}`,
      type: "prediction_fulfilled",
      title: prediction.title,
      description: prediction.description,
      createdAt: prediction.estimatedDate
        ? parseDateOrNow(prediction.estimatedDate)
        : new Date().toISOString(),
      source: "intelligence",
      relatedEntityId: prediction.productId,
    });
  });

  if (input.settings.monthlyBudget > 0) {
    events.push({
      id: "timeline-budget-current",
      type: "budget_changed",
      title: "Presupuesto configurado",
      description: `Presupuesto mensual activo: ${input.settings.monthlyBudget} ${input.settings.currency}.`,
      createdAt: new Date().toISOString(),
      source: "settings",
    });
  }

  events.push({
    id: "timeline-knowledge-refreshed",
    type: "knowledge_refreshed",
    title: "Conocimiento actualizado",
    description: `${input.alerts.length} alerta${input.alerts.length === 1 ? "" : "s"} y ${input.predictions.length} predicción${input.predictions.length === 1 ? "" : "es"} recalculadas.`,
    createdAt: new Date().toISOString(),
    source: "system",
  });

  return events
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 40);
}
