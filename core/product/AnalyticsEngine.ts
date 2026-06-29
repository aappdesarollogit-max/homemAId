import {
  appendAnalyticsEvent,
  createProductId,
  getProductSnapshot,
} from "@/core/product/ProductStorage";
import type { AnalyticsEvent } from "@/core/product/ProductTypes";
import { getEventBus } from "@/core/platform/events/EventBus";
import { getReleaseLabel } from "@/lib/release";

export type AnalyticsEventDraft = Omit<AnalyticsEvent, "id" | "fecha"> & {
  fecha?: string;
};

export default class AnalyticsEngine {
  track(event: AnalyticsEventDraft) {
    const analyticsEvent: AnalyticsEvent = {
      ...event,
      id: createProductId("analytics"),
      fecha: event.fecha ?? new Date().toISOString(),
    };

    appendAnalyticsEvent(analyticsEvent);
    return analyticsEvent;
  }

  getEvents() {
    return getProductSnapshot().analytics;
  }

  getEventsByType(type: AnalyticsEvent["tipo"]) {
    return this.getEvents().filter((event) => event.tipo === type);
  }

  getKpis() {
    const snapshot = getProductSnapshot();
    const platformEvents = getEventBus().getEvents();
    const openFeedback = snapshot.feedback.filter(
      (feedback) => !["Resuelto", "Liberado", "Rechazado"].includes(feedback.estado),
    );
    const resolvedFeedback = snapshot.feedback.filter((feedback) =>
      ["Resuelto", "Liberado"].includes(feedback.estado),
    );

    return {
      feedbackAbiertos: openFeedback.length,
      feedbackResueltos: resolvedFeedback.length,
      bugsCriticos: snapshot.bugs.filter((bug) => bug.prioridad === "Crítica").length,
      ideas:
        snapshot.feedback.filter((feedback) => feedback.tipo === "IDEA").length +
        snapshot.featureRequests.length,
      parserFallidos:
        this.getEventsByType("parser.fallo").length +
        platformEvents.filter((event) =>
          ["input.failed", "text.input.failed"].includes(event.type),
        ).length,
      parserExitosos:
        this.getEventsByType("parser.usado").length +
        platformEvents.filter((event) =>
          ["input.normalized", "text.input.parsed", "text.input.confirmed"].includes(event.type),
        ).length,
      comprasCreadas:
        this.getEventsByType("compra.creada").length +
        platformEvents.filter((event) => event.type === "purchase.created").length,
      asistenteUsado:
        this.getEventsByType("asistente.usado").length +
        platformEvents.filter((event) => event.type === "assistant.message.sent").length,
      usuariosAlpha: new Set(snapshot.feedback.map((feedback) => feedback.usuario)).size,
      version: getReleaseLabel(),
    };
  }
}
