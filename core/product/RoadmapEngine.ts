import { getProductSnapshot } from "@/core/product/ProductStorage";
import type { Feedback, ProductPriority, RoadmapItem } from "@/core/product/ProductTypes";

function priorityScore(priority: ProductPriority) {
  if (priority === "Crítica") return 4;
  if (priority === "Alta") return 3;
  if (priority === "Media") return 2;
  return 1;
}

function inferTopic(feedback: Feedback) {
  const text = `${feedback.descripcion} ${feedback.queEsperaba}`.toLowerCase();

  if (text.includes("ocr")) return "OCR";
  if (text.includes("compra") || text.includes("compras")) return "Mejorar UX de Compras";
  if (text.includes("inventario")) return "Mejorar Inventario";
  if (text.includes("parser") || text.includes("texto")) return "Mejorar parser de texto";
  if (text.includes("asistente")) return "Mejorar Asistente";
  return feedback.tipo === "BUG" ? `Corregir ${feedback.pantalla}` : feedback.tipo;
}

function scoreToPriority(score: number): ProductPriority {
  if (score >= 12) return "Crítica";
  if (score >= 8) return "Alta";
  if (score >= 4) return "Media";
  return "Baja";
}

export default class RoadmapEngine {
  generateRoadmap() {
    const snapshot = getProductSnapshot();
    const grouped = new Map<string, { feedback: Feedback[]; score: number }>();

    snapshot.feedback.forEach((feedback) => {
      const topic = inferTopic(feedback);
      const current = grouped.get(topic) ?? { feedback: [], score: 0 };

      current.feedback.push(feedback);
      current.score += priorityScore(feedback.prioridad);
      grouped.set(topic, current);
    });

    snapshot.featureRequests.forEach((request) => {
      const current = grouped.get(request.idea) ?? { feedback: [], score: 0 };
      current.score += priorityScore(request.impacto) + request.frecuencia;
      grouped.set(request.idea, current);
    });

    return Array.from(grouped.entries())
      .map(([topic, value]): RoadmapItem => ({
        id: `roadmap-${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        titulo: topic,
        descripcion: `${value.feedback.length} feedback${value.feedback.length === 1 ? "" : "s"} relacionado${value.feedback.length === 1 ? "" : "s"}.`,
        prioridad: scoreToPriority(value.score),
        fuente: "Feedback Alpha Cerrada",
        votos: value.feedback.length,
        estado: "Nuevo",
      }))
      .sort((a, b) => priorityScore(b.prioridad) - priorityScore(a.prioridad));
  }
}
