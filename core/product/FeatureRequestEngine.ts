import {
  appendFeatureRequest,
  createProductId,
  getProductSnapshot,
} from "@/core/product/ProductStorage";
import type { FeatureRequest, ProductPriority } from "@/core/product/ProductTypes";

export type FeatureRequestDraft = Omit<
  FeatureRequest,
  "id" | "fecha" | "estado" | "impacto"
> & {
  fecha?: string;
  impacto?: ProductPriority;
};

export default class FeatureRequestEngine {
  createFeatureRequest(draft: FeatureRequestDraft) {
    const featureRequest: FeatureRequest = {
      ...draft,
      id: createProductId("feature"),
      fecha: draft.fecha ?? new Date().toISOString(),
      impacto: draft.impacto ?? "Media",
      estado: "Nuevo",
    };

    appendFeatureRequest(featureRequest);
    return featureRequest;
  }

  getFeatureRequests() {
    return getProductSnapshot().featureRequests;
  }

  getIdeas() {
    return this.getFeatureRequests().filter((request) => request.estado !== "Rechazado");
  }
}
