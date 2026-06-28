import type { RawPurchaseInput } from "@/lib/ingestion/DataIngestionEngine";

export interface BarcodeProvider {
  resolveBarcode(payload: unknown): Promise<RawPurchaseInput>;
}
