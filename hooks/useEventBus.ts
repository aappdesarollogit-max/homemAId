"use client";

import { useCallback, useState } from "react";
import { getEventBus } from "@/core/platform/events/EventBus";
import type {
  DomainEvent,
  DomainEventDraft,
} from "@/core/platform/events/EventTypes";

export function useEventBus(limit = 25) {
  const [events, setEvents] = useState<DomainEvent[]>(() =>
    getEventBus().getRecentEvents(limit),
  );

  const refreshEvents = useCallback(() => {
    setEvents(getEventBus().getRecentEvents(limit));
  }, [limit]);

  function publishEvent<TPayload>(event: DomainEventDraft<TPayload>) {
    const publishedEvent = getEventBus().publish(event);
    refreshEvents();
    return publishedEvent;
  }

  function clearEvents() {
    getEventBus().clearEvents();
    refreshEvents();
  }

  return {
    events,
    publishEvent,
    clearEvents,
    refreshEvents,
  };
}
