import type { RawPurchaseInput } from "@/lib/ingestion/DataIngestionEngine";

export interface AIProvider {
  parsePurchaseConversation(message: string): Promise<RawPurchaseInput[]>;
}
