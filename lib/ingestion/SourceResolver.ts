import type { InputSource, RawPurchaseInput } from "@/lib/ingestion/DataIngestionEngine";

export default class SourceResolver {
  detectSource(inputs: RawPurchaseInput[]): InputSource {
    return inputs.find((input) => input.source)?.source ?? "manual";
  }
}
