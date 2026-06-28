import type {
  DomainEvent,
  DomainEventHandler,
  DomainEventType,
} from "@/core/platform/events/EventTypes";

export default class EventDispatcher {
  private readonly handlers = new Map<DomainEventType, Set<DomainEventHandler>>();

  subscribe(type: DomainEventType, handler: DomainEventHandler) {
    const handlers = this.handlers.get(type) ?? new Set<DomainEventHandler>();
    handlers.add(handler);
    this.handlers.set(type, handlers);

    return () => this.unsubscribe(type, handler);
  }

  unsubscribe(type: DomainEventType, handler: DomainEventHandler) {
    this.handlers.get(type)?.delete(handler);
  }

  dispatch(event: DomainEvent) {
    const handlers = this.handlers.get(event.type);
    if (!handlers) return;

    handlers.forEach((handler) => {
      void handler(event);
    });
  }
}
