import type { DomainEvent, DomainEventType } from "@/core/platform/events/EventTypes";

const EVENT_STORAGE_KEY = "homemaid.platform.events";
const MAX_EVENTS = 200;

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export default class EventStore {
  private events: DomainEvent[] = [];

  constructor() {
    this.events = this.readStoredEvents();
  }

  getEvents() {
    return [...this.events];
  }

  getRecentEvents(limit = 25) {
    return this.events.slice(0, limit);
  }

  getEventsByType(type: DomainEventType) {
    return this.events.filter((event) => event.type === type);
  }

  getEventsByCorrelationId(correlationId: string) {
    return this.events.filter((event) => event.correlationId === correlationId);
  }

  append(event: DomainEvent) {
    this.events = [event, ...this.events].slice(0, MAX_EVENTS);
    this.persist();
    return event;
  }

  clear() {
    this.events = [];
    this.persist();
  }

  private readStoredEvents() {
    if (!canUseLocalStorage()) return [];

    const storedEvents = window.localStorage.getItem(EVENT_STORAGE_KEY);
    if (!storedEvents) return [];

    try {
      return JSON.parse(storedEvents) as DomainEvent[];
    } catch {
      return [];
    }
  }

  private persist() {
    if (canUseLocalStorage()) {
      window.localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(this.events));
    }
  }
}
