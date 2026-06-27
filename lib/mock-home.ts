import type {
  AiInsight,
  DashboardView,
  HouseholdMember,
  HouseholdSummary,
  InventoryProduct,
  Purchase,
} from "@/types/domain";

export const dashboardViews: Array<{
  id: DashboardView;
  label: string;
  icon: string;
}> = [
  { id: "inicio", label: "Inicio", icon: "⌂" },
  { id: "inventario", label: "Inventario", icon: "▤" },
  { id: "compras", label: "Compras", icon: "◈" },
  { id: "consumo", label: "Consumo", icon: "↗" },
  { id: "asistente", label: "Asistente IA", icon: "✦" },
  { id: "ajustes", label: "Ajustes", icon: "⚙" },
];

export const householdSummary: HouseholdSummary = {
  name: "Familia Muñoz",
  owner: "Rody",
  monthlyBudget: 600000,
  monthlySpend: 432000,
  estimatedSavings: 68000,
  healthScore: 87,
};

export const householdMembers: HouseholdMember[] = [
  { id: "rody", name: "Rody", role: "Adulto", avatar: "R" },
  { id: "camila", name: "Camila", role: "Adulto", avatar: "C" },
  { id: "sofia", name: "Sofía", role: "Hija", avatar: "S" },
  { id: "max", name: "Max", role: "Hijo", avatar: "M" },
];

export const inventoryProducts: InventoryProduct[] = [
  {
    id: "milk",
    name: "Leche entera",
    category: "Lácteos",
    quantity: "2 unidades",
    status: "critical",
    statusLabel: "Por agotarse",
    openedAt: "13 May 2025",
    estimatedDaysLeft: 3,
    isOpened: true,
    minimumStock: 2,
    currentStock: 2,
    unit: "unidades",
    icon: "🥛",
  },
  {
    id: "eggs",
    name: "Huevos",
    category: "Despensa",
    quantity: "12 unidades",
    status: "low",
    statusLabel: "Stock bajo",
    estimatedDaysLeft: 7,
    isOpened: false,
    minimumStock: 8,
    currentStock: 12,
    unit: "unidades",
    icon: "🥚",
  },
  {
    id: "rice",
    name: "Arroz",
    category: "Despensa",
    quantity: "1 kg",
    status: "ok",
    statusLabel: "Stock OK",
    estimatedDaysLeft: 18,
    isOpened: false,
    minimumStock: 1,
    currentStock: 1,
    unit: "kg",
    icon: "🍚",
  },
  {
    id: "detergent",
    name: "Detergente líquido",
    category: "Limpieza",
    quantity: "1 unidad",
    status: "ok",
    statusLabel: "Stock OK",
    estimatedDaysLeft: 26,
    isOpened: false,
    minimumStock: 1,
    currentStock: 1,
    unit: "unidad",
    icon: "🧴",
  },
  {
    id: "paper",
    name: "Papel higiénico",
    category: "Limpieza",
    quantity: "4 rollos",
    status: "low",
    statusLabel: "Stock bajo",
    estimatedDaysLeft: 6,
    isOpened: false,
    minimumStock: 3,
    currentStock: 4,
    unit: "rollos",
    icon: "🧻",
  },
];

export const purchases: Purchase[] = [
  {
    id: "purchase-1",
    store: "Supermercado",
    date: "Hoy",
    total: 7990,
    items: [
      { productId: "milk", productName: "Leche entera", quantity: 2, unit: "unidades", price: 3000 },
      { productId: "detergent", productName: "Detergente", quantity: 1, unit: "unidad", price: 4990 },
    ],
  },
  {
    id: "purchase-2",
    store: "Panadería",
    date: "Ayer",
    total: 1890,
    items: [{ productName: "Pan integral", quantity: 1, unit: "bolsa", price: 1890 }],
  },
  {
    id: "purchase-3",
    store: "Mascotas",
    date: "Hace 3 días",
    total: 12990,
    items: [{ productName: "Alimento Luna", quantity: 1, unit: "bolsa", price: 12990 }],
  },
];

export const aiInsights: AiInsight[] = [
  {
    id: "milk-forecast",
    title: "Necesitarás leche en 3 días",
    description:
      "Según el consumo promedio del hogar, conviene agregar leche a la próxima compra.",
    tone: "warning",
  },
  {
    id: "snacks-spend",
    title: "Gasto en snacks subió 18%",
    description:
      "Esta semana hubo más compras pequeñas. Puedes definir un límite para evitar desvíos.",
    tone: "info",
  },
  {
    id: "saving",
    title: "Ahorro potencial de $35.000",
    description:
      "Hay productos duplicados y compras repetidas que podrías consolidar.",
    tone: "saving",
  },
];

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}
