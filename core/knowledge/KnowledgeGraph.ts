import type {
  HouseholdMember,
  HouseholdPrediction,
  HouseholdSettings,
  InventoryProduct,
  KnowledgeEdge,
  KnowledgeGraph,
  KnowledgeNode,
  Purchase,
} from "@/types/domain";

function normalizeId(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function addNode(nodes: Map<string, KnowledgeNode>, node: KnowledgeNode) {
  if (!nodes.has(node.id)) nodes.set(node.id, node);
}

function edge(
  from: string,
  to: string,
  relation: KnowledgeEdge["relation"],
  weight = 1,
  confidence = 60,
): KnowledgeEdge {
  return {
    id: `${from}-${relation}-${to}`,
    from,
    to,
    relation,
    weight,
    confidence,
  };
}

export function buildKnowledgeGraph(input: {
  inventoryProducts: InventoryProduct[];
  purchases: Purchase[];
  settings: HouseholdSettings;
  members: HouseholdMember[];
  predictions: HouseholdPrediction[];
}): KnowledgeGraph {
  const nodes = new Map<string, KnowledgeNode>();
  const edges: KnowledgeEdge[] = [];
  const budgetNodeId = "budget-monthly";
  const frequencyNodeId = `frequency-${normalizeId(input.settings.purchaseFrequency) || "default"}`;

  addNode(nodes, {
    id: budgetNodeId,
    type: "budget",
    label: "Presupuesto mensual",
    metadata: { amount: input.settings.monthlyBudget, currency: input.settings.currency },
  });
  addNode(nodes, {
    id: frequencyNodeId,
    type: "frequency",
    label: input.settings.purchaseFrequency,
  });

  input.members.forEach((member) => {
    addNode(nodes, {
      id: `member-${member.id}`,
      type: "member",
      label: member.name,
      metadata: { role: member.role },
    });
  });

  input.settings.priorityCategories.forEach((category) => {
    const categoryId = `category-${normalizeId(category)}`;
    const priorityId = `priority-${normalizeId(category)}`;

    addNode(nodes, { id: categoryId, type: "category", label: category });
    addNode(nodes, { id: priorityId, type: "priority", label: `Prioridad ${category}` });
    edges.push(edge(categoryId, priorityId, "has_priority", 1, 80));
  });

  input.inventoryProducts.forEach((product) => {
    const productId = `product-${product.id}`;
    const categoryId = `category-${normalizeId(product.category)}`;
    const stockId = `stock-${product.id}`;

    addNode(nodes, {
      id: productId,
      type: "product",
      label: product.name,
      metadata: { currentStock: product.currentStock, unit: product.unit },
    });
    addNode(nodes, { id: categoryId, type: "category", label: product.category });
    addNode(nodes, {
      id: stockId,
      type: "stock",
      label: product.statusLabel,
      metadata: { status: product.status, daysLeft: product.estimatedDaysLeft },
    });

    edges.push(edge(productId, categoryId, "belongs_to", 1, 90));
    edges.push(edge(productId, stockId, "has_stock", 1, 85));
    edges.push(edge(productId, frequencyNodeId, "has_frequency", 0.5, 45));
    edges.push(edge(productId, budgetNodeId, "affects_budget", 0.5, 55));

    input.members.forEach((member) => {
      edges.push(edge(productId, `member-${member.id}`, "used_by", 0.25, 35));
    });
  });

  input.purchases.forEach((purchase) => {
    const storeId = `store-${normalizeId(purchase.store)}`;
    const consumptionId = `consumption-${purchase.id}`;

    addNode(nodes, { id: storeId, type: "store", label: purchase.store });
    addNode(nodes, {
      id: consumptionId,
      type: "consumption",
      label: `Compra ${purchase.date}`,
      metadata: { total: purchase.total },
    });
    edges.push(edge(storeId, consumptionId, "affects_consumption", 1, 75));
    edges.push(edge(consumptionId, budgetNodeId, "affects_budget", purchase.total, 80));

    purchase.items.forEach((item) => {
      const product =
        input.inventoryProducts.find((candidate) => candidate.id === item.productId) ??
        input.inventoryProducts.find(
          (candidate) => normalizeId(candidate.name) === normalizeId(item.productName),
        );
      const productId = product ? `product-${product.id}` : `product-${normalizeId(item.productName)}`;

      addNode(nodes, {
        id: productId,
        type: "product",
        label: item.productName,
        metadata: { unit: item.unit },
      });
      edges.push(edge(productId, storeId, "bought_at", item.quantity, 70));
      edges.push(edge(productId, consumptionId, "affects_consumption", item.price, 75));
    });
  });

  input.predictions.forEach((prediction) => {
    const predictionId = `prediction-${prediction.id}`;
    const productId = prediction.productId
      ? `product-${prediction.productId}`
      : `product-${normalizeId(prediction.productName)}`;

    addNode(nodes, {
      id: predictionId,
      type: "prediction",
      label: prediction.title,
      metadata: { confidence: prediction.confidence, severity: prediction.severity },
    });
    edges.push(edge(productId, predictionId, "has_prediction", 1, prediction.confidence));
  });

  return {
    nodes: Array.from(nodes.values()),
    edges,
    generatedAt: new Date().toISOString(),
  };
}
