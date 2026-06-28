import EventStore from "@/core/platform/events/EventStore";
import type { DomainEvent, DomainEventType } from "@/core/platform/events/EventTypes";

export default class EventLogger {
  constructor(private readonly store: EventStore) {}

  log(event: DomainEvent) {
    return this.store.append(event);
  }

  getEvents() {
    return this.store.getEvents();
  }

  getRecentEvents(limit = 25) {
    return this.store.getRecentEvents(limit);
  }

  getEventsByType(type: DomainEventType) {
    return this.store.getEventsByType(type);
  }

  getEventsByCorrelationId(correlationId: string) {
    return this.store.getEventsByCorrelationId(correlationId);
  }

  clearEvents() {
    this.store.clear();
  }
}
