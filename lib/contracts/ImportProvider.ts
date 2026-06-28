import type { RawPurchaseInput } from "@/lib/ingestion/DataIngestionEngine";

export interface ImportProvider {
  parseImport(payload: unknown): Promise<RawPurchaseInput[]>;
}
