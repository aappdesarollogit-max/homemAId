export type DomainEventType =
  | "purchase.created"
  | "purchase.deleted"
  | "inventory.product.created"
  | "inventory.product.updated"
  | "inventory.product.deleted"
  | "inventory.product.opened"
  | "consumption.updated"
  | "settings.updated"
  | "assistant.message.sent"
  | "feedback.created"
  | "intelligence.refreshed"
  | "input.received"
  | "input.normalized"
  | "input.failed"
  | "text.input.received"
  | "text.input.parsed"
  | "text.input.confirmed"
  | "text.input.failed";

export type DomainEventSource =
  | "inventory"
  | "purchases"
  | "consumption"
  | "settings"
  | "assistant"
  | "intelligence"
  | "input"
  | "system";

export type DomainEvent<TPayload = unknown> = {
  id: string;
  type: DomainEventType;
  payload: TPayload;
  source: DomainEventSource;
  createdAt: string;
  correlationId?: string;
  metadata?: Record<string, string | number | boolean | undefined>;
};

export type DomainEventHandler<TPayload = unknown> = (
  event: DomainEvent<TPayload>,
) => void | Promise<void>;

export type DomainEventDraft<TPayload = unknown> = Omit<
  DomainEvent<TPayload>,
  "id" | "createdAt"
> & {
  id?: string;
  createdAt?: string;
};

export function createEventId(type: DomainEventType) {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : String(Date.now());

  return `${type}-${suffix}`;
}

export function createDomainEvent<TPayload>(
  draft: DomainEventDraft<TPayload>,
): DomainEvent<TPayload> {
  return {
    ...draft,
    id: draft.id ?? createEventId(draft.type),
    createdAt: draft.createdAt ?? new Date().toISOString(),
  };
}
