import type { RawPurchaseInput } from "@/lib/ingestion/DataIngestionEngine";

export interface OCRProvider {
  extractPurchaseInputs(payload: unknown): Promise<RawPurchaseInput[]>;
}
