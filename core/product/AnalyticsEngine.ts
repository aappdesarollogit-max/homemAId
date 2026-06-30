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

  getQualityMetrics() {
    const snapshot = getProductSnapshot();
    const platformEvents = getEventBus().getEvents();
    const parserSuccess = platformEvents.filter((event) =>
      ["input.normalized", "text.input.parsed", "text.input.confirmed"].includes(event.type),
    ).length;
    const parserFail = platformEvents.filter((event) =>
      ["input.failed", "text.input.failed"].includes(event.type),
    ).length;
    const onboardingStarted = snapshot.analytics.filter(
      (event) => event.tipo === "first_run_started",
    ).length;
    const onboardingCompleted = snapshot.analytics.filter(
      (event) => event.tipo === "onboarding_completed",
    ).length;
    const onboardingCompletion =
      onboardingStarted > 0 ? Math.round((onboardingCompleted / onboardingStarted) * 100) : 0;

    return {
      parserSuccess,
      parserFail,
      onboardingCompletion,
      feedbackEnviados: snapshot.feedback.length,
      erroresCriticos: snapshot.bugs.filter((bug) =>
        bug.prioridad.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().startsWith("crit"),
      ).length,
    };
  }
}
