import type { DomainEvent, DomainEventType } from "@/core/platform/events/EventTypes";

export type AutomationRule = {
  id: string;
  name: string;
  enabled: boolean;
  eventTypes: DomainEventType[];
  evaluate: (event: DomainEvent) => boolean;
};

export const futureAutomationRules: AutomationRule[] = [
  {
    id: "budget-over-80",
    name: "Presupuesto sobre 80%",
    enabled: false,
    eventTypes: ["consumption.updated", "intelligence.refreshed"],
    evaluate: () => false,
  },
  {
    id: "critical-product",
    name: "Producto crítico",
    enabled: false,
    eventTypes: ["inventory.product.updated", "intelligence.refreshed"],
    evaluate: () => false,
  },
  {
    id: "unusual-purchase",
    name: "Compra inusual",
    enabled: false,
    eventTypes: ["purchase.created"],
    evaluate: () => false,
  },
];
