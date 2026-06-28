import {
  appendDecision,
  createProductId,
  getProductSnapshot,
} from "@/core/product/ProductStorage";
import type { ProductDecision } from "@/core/product/ProductTypes";

export type ProductDecisionDraft = Omit<ProductDecision, "id" | "fecha"> & {
  fecha?: string;
};

export default class ProductDecisionEngine {
  createDecision(draft: ProductDecisionDraft) {
    const decision: ProductDecision = {
      ...draft,
      id: createProductId("decision"),
      fecha: draft.fecha ?? new Date().toISOString(),
    };

    appendDecision(decision);
    return decision;
  }

  getDecisions() {
    return getProductSnapshot().decisions;
  }

  getDecisionForFeedback(feedbackId: string) {
    return this.getDecisions().find((decision) => decision.feedbackId === feedbackId);
  }
}
