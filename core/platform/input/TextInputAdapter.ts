import EntityResolver from "@/core/platform/input/EntityResolver";
import type {
  InputAdapter,
  ParsedPurchase,
  SmartInput,
  SmartInputNormalizeResult,
} from "@/core/platform/input/InputTypes";
import TextParser from "@/core/platform/input/TextParser";
import { getInventoryProducts } from "@/lib/services/inventory-service";

function parsedPurchaseToRawInputs(parsedPurchase: ParsedPurchase) {
  return parsedPurchase.products.map((product) => ({
    productId: product.productId,
    producto: product.productName,
    cantidad: product.quantity,
    unidad: product.unit,
    precio: product.price ?? 0,
    tienda: parsedPurchase.store ?? "Entrada de texto",
    fecha: parsedPurchase.date,
    categoria: product.category,
    observaciones: parsedPurchase.observations,
    source: "ai" as const,
    confidence: product.confidence,
  }));
}

export function parseNaturalLanguagePurchase(text: string) {
  const parser = new TextParser();
  const resolver = new EntityResolver(getInventoryProducts());

  return resolver.resolve(parser.parse(text));
}

const TextInputAdapter: InputAdapter = {
  type: "text",
  canHandle(input: SmartInput) {
    return input.type === "text" || typeof input.value === "string";
  },
  validate(input: SmartInput) {
    if (typeof input.value !== "string" || input.value.trim().length === 0) {
      return { valid: false, message: "Texto obligatorio." };
    }

    return { valid: true };
  },
  normalize(input: SmartInput): SmartInputNormalizeResult {
    const validation = this.validate(input);
    if (!validation.valid) {
      return {
        ok: false,
        inputType: "text",
        rawInputs: [],
        error: validation.message,
      };
    }

    const parsedPurchase = parseNaturalLanguagePurchase(String(input.value));
    const rawInputs = parsedPurchaseToRawInputs(parsedPurchase);

    return {
      ok: parsedPurchase.errors.length === 0 && rawInputs.length > 0,
      inputType: "text",
      rawInputs,
      parsedPurchase,
      error:
        parsedPurchase.errors[0] ??
        (rawInputs.length > 0 ? undefined : "No se detectaron productos en el texto."),
    };
  },
};

export default TextInputAdapter;
