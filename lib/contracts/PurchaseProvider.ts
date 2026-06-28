import type { NormalizedPurchase } from "@/lib/ingestion/DataIngestionEngine";
import type { Purchase } from "@/types/domain";

export interface PurchaseProvider {
  createPurchase(purchase: NormalizedPurchase): Purchase;
}
