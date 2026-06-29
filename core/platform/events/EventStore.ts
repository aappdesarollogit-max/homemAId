import type { DomainEvent, DomainEventType } from "@/core/platform/events/EventTypes";
import { readStorageJson, writeStorageJson } from "@/lib/safe-storage";

const EVENT_STORAGE_KEY = "homemaid.platform.events";
const MAX_EVENTS = 200;

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
    return readStorageJson<DomainEvent[]>(EVENT_STORAGE_KEY, []);
  }

  private persist() {
    writeStorageJson(EVENT_STORAGE_KEY, this.events);
  }
}
