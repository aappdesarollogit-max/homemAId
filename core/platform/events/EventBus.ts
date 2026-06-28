import EventDispatcher from "@/core/platform/events/EventDispatcher";
import EventLogger from "@/core/platform/events/EventLogger";
import EventStore from "@/core/platform/events/EventStore";
import {
  createDomainEvent,
  type DomainEvent,
  type DomainEventDraft,
  type DomainEventHandler,
  type DomainEventType,
} from "@/core/platform/events/EventTypes";

export default class EventBus {
  constructor(
    private readonly logger = new EventLogger(new EventStore()),
    private readonly dispatcher = new EventDispatcher(),
  ) {}

  publish<TPayload>(draft: DomainEventDraft<TPayload>) {
    const event = createDomainEvent(draft);

    this.logger.log(event);
    this.dispatcher.dispatch(event);

    return event;
  }

  subscribe(type: DomainEventType, handler: DomainEventHandler) {
    return this.dispatcher.subscribe(type, handler);
  }

  unsubscribe(type: DomainEventType, handler: DomainEventHandler) {
    this.dispatcher.unsubscribe(type, handler);
  }

  getEvents() {
    return this.logger.getEvents();
  }

  getRecentEvents(limit = 25) {
    return this.logger.getRecentEvents(limit);
  }

  getEventsByType(type: DomainEventType) {
    return this.logger.getEventsByType(type);
  }

  getEventsByCorrelationId(correlationId: string) {
    return this.logger.getEventsByCorrelationId(correlationId);
  }

  clearEvents() {
    this.logger.clearEvents();
  }
}

let eventBusInstance: EventBus | undefined;

export function getEventBus() {
  eventBusInstance ??= new EventBus();
  return eventBusInstance;
}

export function publishDomainEvent<TPayload>(draft: DomainEventDraft<TPayload>) {
  return getEventBus().publish(draft);
}

export type { DomainEvent, DomainEventDraft, DomainEventType };
