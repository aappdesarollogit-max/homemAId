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
  productName: string;
  quantity: string;
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
