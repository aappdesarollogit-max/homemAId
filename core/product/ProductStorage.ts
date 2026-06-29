import type {
  AnalyticsEvent,
  BugReport,
  FeatureRequest,
  Feedback,
  ProductDecision,
  ProductSnapshot,
} from "@/core/product/ProductTypes";
import { readStorageJson, writeStorageJson } from "@/lib/safe-storage";

const PRODUCT_STORAGE_KEY = "homemaid.product.intelligence";

export function createProductId(prefix: string) {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : String(Date.now());

  return `${prefix}-${suffix}`;
}

export function emptyProductSnapshot(): ProductSnapshot {
  return {
    feedback: [],
    bugs: [],
    featureRequests: [],
    decisions: [],
    analytics: [],
  };
}

export function getProductSnapshot(): ProductSnapshot {
  return {
    ...emptyProductSnapshot(),
    ...readStorageJson<Partial<ProductSnapshot>>(PRODUCT_STORAGE_KEY, {}),
  };
}

export function saveProductSnapshot(snapshot: ProductSnapshot) {
  const nextSnapshot: ProductSnapshot = {
    feedback: snapshot.feedback.slice(0, 500),
    bugs: snapshot.bugs.slice(0, 300),
    featureRequests: snapshot.featureRequests.slice(0, 300),
    decisions: snapshot.decisions.slice(0, 500),
    analytics: snapshot.analytics.slice(0, 1000),
  };

  writeStorageJson(PRODUCT_STORAGE_KEY, nextSnapshot);

  return nextSnapshot;
}

export function updateProductSnapshot(updates: Partial<ProductSnapshot>) {
  return saveProductSnapshot({
    ...getProductSnapshot(),
    ...updates,
  });
}

export function appendFeedback(feedback: Feedback) {
  const snapshot = getProductSnapshot();
  return updateProductSnapshot({ feedback: [feedback, ...snapshot.feedback] });
}

export function appendBug(bug: BugReport) {
  const snapshot = getProductSnapshot();
  return updateProductSnapshot({ bugs: [bug, ...snapshot.bugs] });
}

export function appendFeatureRequest(featureRequest: FeatureRequest) {
  const snapshot = getProductSnapshot();
  return updateProductSnapshot({
    featureRequests: [featureRequest, ...snapshot.featureRequests],
  });
}

export function appendDecision(decision: ProductDecision) {
  const snapshot = getProductSnapshot();
  return updateProductSnapshot({ decisions: [decision, ...snapshot.decisions] });
}

export function appendAnalyticsEvent(event: AnalyticsEvent) {
  const snapshot = getProductSnapshot();
  return updateProductSnapshot({ analytics: [event, ...snapshot.analytics] });
}
