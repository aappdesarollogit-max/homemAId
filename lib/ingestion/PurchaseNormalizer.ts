import type {
  InputSource,
  NormalizedPurchase,
  RawPurchaseInput,
} from "@/lib/ingestion/DataIngestionEngine";

function readNumber(value: number | string | undefined) {
  const numberValue = Number(value ?? 0);
  return Number.isNaN(numberValue) ? 0 : numberValue;
}

function todayLabel() {
  return new Date().toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default class PurchaseNormalizer {
  normalize(inputs: RawPurchaseInput[], source: InputSource): NormalizedPurchase {
    const firstInput = inputs[0];

    return {
      store: firstInput?.tienda?.trim() || "Sin tienda",
      date: firstInput?.fecha || todayLabel(),
      source,
      confidence: firstInput?.confidence,
      observations: firstInput?.observaciones,
      items: inputs.map((input) => ({
        productId: input.productId,
        productName: input.producto?.trim() ?? "",
        quantity: Math.max(0, readNumber(input.cantidad)),
        unit: input.unidad?.trim() || "unidad",
        price: Math.max(0, readNumber(input.precio)),
        category: input.categoria?.trim(),
        notes: input.observaciones,
        confidence: input.confidence,
      })),
    };
  }
}
