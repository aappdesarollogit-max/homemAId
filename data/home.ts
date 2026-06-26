export type Feature = {
  icon: string;
  title: string;
  description: string;
};

export type DashboardKpi = {
  icon: string;
  value: string;
  label: string;
  note: string;
  gradient: string;
};

export type InventoryItem = {
  icon: string;
  product: string;
  status: string;
  level: string;
  badgeClassName: string;
};

export type Purchase = {
  icon: string;
  product: string;
  date: string;
  price: string;
};

export type Recommendation = {
  title: string;
  text: string;
};

export const features: Feature[] = [
  {
    icon: "🏠",
    title: "ADN del hogar",
    description:
      "Registra integrantes, mascotas, gustos, presupuesto y hábitos de compra para personalizar la experiencia.",
  },
  {
    icon: "📦",
    title: "Inventario inteligente",
    description:
      "Controla productos disponibles, abiertos y próximos a agotarse dentro del hogar.",
  },
  {
    icon: "💬",
    title: "Compras por lenguaje natural",
    description:
      "Escribe frases como “compré 2 leches” y HomeMaid las interpreta automáticamente.",
  },
  {
    icon: "🥛",
    title: "Consumo predictivo",
    description:
      "Aprende cuánto dura cada producto según el comportamiento real de tu familia.",
  },
  {
    icon: "💰",
    title: "Ahorro familiar",
    description:
      "Detecta compras impulsivas, productos duplicados y oportunidades de ahorro.",
  },
  {
    icon: "🤖",
    title: "Asistente IA",
    description:
      "Pregunta qué falta, qué comprar o cómo organizar mejor el presupuesto del hogar.",
  },
];

export const howItWorksSteps = [
  {
    step: "01",
    title: "Configura tu hogar",
    description:
      "Define integrantes, presupuesto, productos frecuentes y hábitos reales de consumo.",
  },
  {
    step: "02",
    title: "Registra compras y uso",
    description:
      "Agrega compras, productos abiertos y agotados para mantener vivo el inventario.",
  },
  {
    step: "03",
    title: "Recibe alertas inteligentes",
    description:
      "HomeMaid anticipa faltantes, detecta gasto innecesario y recomienda mejores decisiones.",
  },
];

export const dashboardMenuItems = [
  ["🏠", "Inicio"],
  ["📦", "Inventario"],
  ["🛒", "Compras"],
  ["📈", "Consumo"],
  ["💰", "Ahorro"],
  ["🤖", "Asistente IA"],
  ["⚙️", "Configuración"],
];

export const dashboardKpis: DashboardKpi[] = [
  {
    icon: "📦",
    value: "42",
    label: "Productos totales",
    note: "+5 esta semana",
    gradient: "from-blue-500/30",
  },
  {
    icon: "🟧",
    value: "15",
    label: "Productos abiertos",
    note: "Requieren atención",
    gradient: "from-orange-500/30",
  },
  {
    icon: "💰",
    value: "$12.500",
    label: "Ahorro estimado",
    note: "Este mes",
    gradient: "from-green-500/30",
  },
  {
    icon: "⭐",
    value: "87/100",
    label: "Score del hogar",
    note: "¡Excelente!",
    gradient: "from-purple-500/30",
  },
];

export const criticalInventory: InventoryItem[] = [
  {
    icon: "🥛",
    product: "Leche entera",
    status: "Se agotará en 3 días",
    level: "Crítico",
    badgeClassName: "bg-red-500/20 text-red-300",
  },
  {
    icon: "🧻",
    product: "Papel higiénico",
    status: "Stock bajo",
    level: "Bajo",
    badgeClassName: "bg-orange-500/20 text-orange-300",
  },
  {
    icon: "🧴",
    product: "Detergente líquido",
    status: "Se agotará en 7 días",
    level: "Medio",
    badgeClassName: "bg-yellow-500/20 text-yellow-300",
  },
];

export const recentPurchases: Purchase[] = [
  { icon: "🥛", product: "Leche entera", date: "Hoy", price: "$1.250" },
  { icon: "🍞", product: "Pan integral", date: "Ayer", price: "$1.890" },
  {
    icon: "🧴",
    product: "Detergente líquido",
    date: "Hace 3 días",
    price: "$4.990",
  },
];

export const aiRecommendations: Recommendation[] = [
  {
    title: "Necesitarás leche en 3 días",
    text: "Según el consumo promedio de tu familia.",
  },
  {
    title: "Compra impulsiva detectada",
    text: "Gastaste 18% más en snacks esta semana.",
  },
  {
    title: "Posible ahorro de $4.500",
    text: "Tienes productos duplicados en tu lista.",
  },
];

export const quickActions = [
  ["➕", "Registrar compra", "Agrega productos comprados"],
  ["🥛", "Abrí un producto", "Registrar producto abierto"],
  ["📦", "Ver inventario completo", "Gestionar productos"],
  ["💬", "Consultar a la IA", "Pregunta lo que necesites"],
];
