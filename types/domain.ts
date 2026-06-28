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

export type HouseholdSettings = {
  name: string;
  owner: string;
  monthlyBudget: number;
  currency: string;
  language: string;
  budgetAlertThreshold: number;
  favoriteStores: string[];
  priorityCategories: string[];
  purchaseFrequency: string;
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
  | "weekly_outlook"
  | "intelligence_recommendation"
  | "intelligence_status"
  | "intelligence_risks"
  | "intelligence_patterns"
  | "savings_advice"
  | "today_review"
  | "help"
  | "unknown";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type HouseholdPattern = {
  id: string;
  type:
    | "repeated_product"
    | "top_category"
    | "top_store"
    | "recurring_critical"
    | "long_low_stock"
    | "unusual_purchase"
    | "concentrated_category"
    | "frequent_new_products";
  title: string;
  description: string;
  confidence: number;
  severity: RiskLevel;
  relatedProducts: string[];
  relatedCategory?: string;
  createdAt: string;
};

export type HouseholdPrediction = {
  id: string;
  productId?: string;
  productName: string;
  predictionType:
    | "stock_out"
    | "next_purchase"
    | "budget_risk"
    | "restock"
    | "category_trend";
  title: string;
  description: string;
  estimatedDate?: string;
  confidence: number;
  severity: RiskLevel;
};

export type HouseholdRecommendation = {
  id: string;
  type:
    | "shopping"
    | "budget"
    | "inventory"
    | "organization"
    | "saving"
    | "prevention";
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  impact: "ahorro" | "urgencia" | "organización" | "prevención" | "presupuesto";
  actionLabel?: string;
  relatedProducts: string[];
};

export type HouseholdAlert = {
  id: string;
  type:
    | "product_out"
    | "product_critical"
    | "budget_threshold"
    | "budget_over"
    | "unusual_purchase"
    | "spend_concentration"
    | "no_recent_purchases"
    | "inventory_stale";
  title: string;
  description: string;
  severity: RiskLevel;
  createdAt: string;
  resolved?: boolean;
};

export type HouseholdIntelligenceSummary = {
  healthScore: number;
  riskLevel: RiskLevel;
  monthlySpend: number;
  budgetUsage: number;
  criticalProductsCount: number;
  predictedStockOuts: HouseholdPrediction[];
  recommendations: HouseholdRecommendation[];
  alerts: HouseholdAlert[];
  patterns: HouseholdPattern[];
};

export type HouseholdMemorySnapshot = {
  patterns: HouseholdPattern[];
  recommendations: HouseholdRecommendation[];
  alerts: HouseholdAlert[];
  lastAnalysisAt?: string;
  scoreHistory: Array<{
    score: number;
    createdAt: string;
  }>;
};

export type AssistantContext = {
  inventoryProducts: InventoryProduct[];
  purchases: Purchase[];
  settings: HouseholdSettings;
  members: HouseholdMember[];
  intelligenceSummary?: HouseholdIntelligenceSummary;
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
