import {
  appendFeedback,
  createProductId,
  getProductSnapshot,
  updateProductSnapshot,
} from "@/core/product/ProductStorage";
import { publishDomainEvent } from "@/core/platform/events/EventBus";
import type {
  Feedback,
  FeedbackType,
  ProductPriority,
  ProductStatus,
} from "@/core/product/ProductTypes";

export type FeedbackDraft = Omit<Feedback, "id" | "fecha" | "estado"> & {
  fecha?: string;
  estado?: ProductStatus;
};

function matchesSearch(feedback: Feedback, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  return [
    feedback.usuario,
    feedback.pantalla,
    feedback.tipo,
    feedback.descripcion,
    feedback.queEsperaba,
    feedback.prioridad,
    feedback.estado,
  ].some((value) => value.toLowerCase().includes(normalizedQuery));
}

function feedbackToCsv(feedback: Feedback[]) {
  const rows = [
    [
      "id",
      "usuario",
      "fecha",
      "pantalla",
      "version",
      "tipo",
      "descripcion",
      "queEsperaba",
      "prioridad",
      "estado",
    ],
    ...feedback.map((item) => [
      item.id,
      item.usuario,
      item.fecha,
      item.pantalla,
      item.version,
      item.tipo,
      item.descripcion,
      item.queEsperaba,
      item.prioridad,
      item.estado,
    ]),
  ];

  return rows
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");
}

export default class FeedbackEngine {
  createFeedback(draft: FeedbackDraft) {
    const feedback: Feedback = {
      ...draft,
      id: createProductId("feedback"),
      fecha: draft.fecha ?? new Date().toISOString(),
      estado: draft.estado ?? "Nuevo",
    };

    appendFeedback(feedback);
    publishDomainEvent({
      type: "feedback.created",
      source: "system",
      payload: {
        feedbackId: feedback.id,
        type: feedback.tipo,
        priority: feedback.prioridad,
      },
    });
    return feedback;
  }

  updateFeedback(id: string, updates: Partial<Feedback>) {
    const snapshot = getProductSnapshot();
    let updatedFeedback: Feedback | undefined;

    const feedback = snapshot.feedback.map((item) => {
      if (item.id !== id) return item;
      updatedFeedback = { ...item, ...updates };
      return updatedFeedback;
    });

    updateProductSnapshot({ feedback });
    return updatedFeedback;
  }

  getFeedback() {
    return getProductSnapshot().feedback;
  }

  getByStatus(status: ProductStatus) {
    return this.getFeedback().filter((feedback) => feedback.estado === status);
  }

  getByPriority(priority: ProductPriority) {
    return this.getFeedback().filter((feedback) => feedback.prioridad === priority);
  }

  getByScreen(screen: string) {
    return this.getFeedback().filter((feedback) => feedback.pantalla === screen);
  }

  getByType(type: FeedbackType) {
    return this.getFeedback().filter((feedback) => feedback.tipo === type);
  }

  search(query: string) {
    return this.getFeedback().filter((feedback) => matchesSearch(feedback, query));
  }

  export(format: "json" | "csv") {
    const feedback = this.getFeedback();
    return format === "csv" ? feedbackToCsv(feedback) : JSON.stringify(feedback, null, 2);
  }
}
