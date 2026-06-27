export type DashboardView =
  | "inicio"
  | "inventario"
  | "compras"
  | "consumo"
  | "asistente"
  | "ajustes";

export type HouseholdMember = {
  id: string;
  name: string;
  role: string;
  avatar: string;
};

export type ProductStatus = "ok" | "low" | "critical" | "out";

export type InventoryProduct = {
  id: string;
  name: string;
  category: string;
  quantity: string;
  status: ProductStatus;
  statusLabel: string;
  openedAt?: string;
  estimatedDaysLeft: number;
  icon: string;
  isOpened: boolean;
  minimumStock: number;
  currentStock: number;
  unit: string;
};

export type PurchaseItem = {
  productId?: string;
  productName: string;
  quantity: number;
  unit: string;
  price: number;
};

export type Purchase = {
  id: string;
  store: string;
  date: string;
  total: number;
  items: PurchaseItem[];
};

export type AiInsight = {
  id: string;
  title: string;
  description: string;
  tone: "saving" | "warning" | "info";
};

export type HouseholdSummary = {
  name: string;
  owner: string;
  monthlyBudget: number;
  monthlySpend: number;
  estimatedSavings: number;
  healthScore: number;
};

export type AssistantMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type AssistantIntent =
  | "critical_products"
  | "monthly_spend"
  | "shopping_recommendation"
  | "top_products"
  | "top_store"
  | "budget_alert"
  | "home_summary"
  | "help"
  | "unknown";

export type AssistantContext = {
  inventoryProducts: InventoryProduct[];
  purchases: Purchase[];
  consumptionMetrics: {
    monthlySpend: number;
    budgetUsage: number;
    criticalProducts: InventoryProduct[];
    topProducts: Array<{
      productName: string;
      quantity: number;
      unit: string;
      totalSpend: number;
    }>;
    spendByStore: Array<{
      label: string;
      amount: number;
      percentage: number;
    }>;
    alerts: Array<{
      id: string;
      title: string;
      description: string;
      tone: "warning" | "danger" | "info";
    }>;
  };
};
