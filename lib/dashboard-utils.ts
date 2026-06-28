import {
  formatCurrency,
  householdSummary,
  inventoryProducts,
  purchases,
} from "@/lib/mock-home";
import type { DashboardView, ProductStatus } from "@/types/domain";

const validViews = new Set<DashboardView>([
  "inicio",
  "inventario",
  "compras",
  "consumo",
  "asistente",
  "ajustes",
]);

export const inventoryFilters = [
  { id: "todos", label: "Todos" },
  { id: "despensa", label: "Despensa" },
  { id: "lacteos", label: "Lácteos" },
  { id: "limpieza", label: "Limpieza" },
  { id: "criticos", label: "Críticos" },
];

export const assistantPrompts = [
  {
    id: "stock",
    question: "¿Qué productos están por agotarse?",
    answer:
      "Tienes 3 productos que requieren atención: leche entera, huevos y papel higiénico. Recomiendo agregarlos a la próxima compra.",
  },
  {
    id: "purchase",
    question: "Registra una compra de supermercado",
    answer:
      "Puedes escribir una compra en lenguaje natural. Por ejemplo: “Compré 2 leches y un detergente”. HomeMaid la convertirá en productos del inventario.",
  },
  {
    id: "spend",
    question: "¿Cuánto gasté este mes?",
    answer: `Este mes llevas ${formatCurrency(householdSummary.monthlySpend)}, equivalente al 72% de tu presupuesto mensual.`,
  },
  {
    id: "weekly-list",
    question: "Sugiere una lista para la semana",
    answer:
      "Para esta semana sugiero comprar leche, huevos, papel higiénico, pan integral y frutas. La lista prioriza productos por agotarse.",
  },
  {
    id: "top-products",
    question: "Productos mas comprados",
    answer: "Te mostrare los productos mas comprados desde tu historial.",
  },
  {
    id: "top-store",
    question: "Tienda con mayor gasto",
    answer: "Te mostrare la tienda con mayor gasto registrado.",
  },
  {
    id: "alerts",
    question: "Alertas del hogar",
    answer: "Revisare presupuesto, inventario critico y patrones de compra.",
  },
  {
    id: "home-summary",
    question: "Resumen del hogar",
    answer: "Preparare un resumen con inventario, compras y consumo.",
  },
];

export const settingsSections = [
  { id: "hogar", label: "Hogar" },
  { id: "integrantes", label: "Integrantes" },
  { id: "presupuesto", label: "Presupuesto" },
  { id: "preferencias", label: "Preferencias" },
];

export function resolveView(view?: string): DashboardView {
  return validViews.has(view as DashboardView) ? (view as DashboardView) : "inicio";
}

export function resolveInventoryFilter(filter?: string): string {
  return inventoryFilters.some((item) => item.id === filter) ? String(filter) : "todos";
}

export function filterInventoryProducts(filter: string) {
  if (filter === "criticos") {
    return inventoryProducts.filter((product) => product.status !== "ok");
  }

  if (filter === "despensa") {
    return inventoryProducts.filter((product) => product.category === "Despensa");
  }

  if (filter === "lacteos") {
    return inventoryProducts.filter((product) => product.category === "Lácteos");
  }

  if (filter === "limpieza") {
    return inventoryProducts.filter((product) => product.category === "Limpieza");
  }

  return inventoryProducts;
}

export function resolvePurchaseId(purchaseId?: string) {
  return purchaseId ?? purchases[0]?.id;
}

export function resolveProductId(productId?: string) {
  return productId ?? inventoryProducts[0]?.id;
}

export function resolvePromptId(promptId?: string) {
  return assistantPrompts.some((prompt) => prompt.id === promptId)
    ? promptId
    : assistantPrompts[0]?.id;
}

export function resolveInventoryAction(action?: string) {
  return action === "apertura" ? action : undefined;
}

export function resolvePurchaseMode(mode?: string) {
  return mode === "nueva" ? mode : undefined;
}

export function resolveSettingsSection(section?: string) {
  return settingsSections.some((item) => item.id === section)
    ? section
    : settingsSections[0]?.id;
}

export function statusTone(status: ProductStatus) {
  if (status === "out") return "red";
  if (status === "critical") return "red";
  if (status === "low") return "orange";
  return "green";
}
