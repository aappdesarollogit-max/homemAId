import type {
  InputAdapter,
  SmartInput,
  SmartInputNormalizeResult,
} from "@/core/platform/input/InputTypes";

function parseText(value: string) {
  const storeMatch = value.match(/\b(?:en|del)\s+([a-záéíóúñ0-9\s]+)$/i);
  const store = storeMatch?.[1]?.trim() || "Entrada de texto";
  const cleanedValue = value
    .replace(/^compr[ée]\s+/i, "")
    .replace(/\s+en\s+[a-záéíóúñ0-9\s]+$/i, "")
    .replace(/\s+y\s+/gi, ", ");

  return cleanedValue
    .split(",")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const match = chunk.match(/^(\d+(?:[.,]\d+)?)\s+(.+)$/);
      const quantity = match ? Number(match[1].replace(",", ".")) : 1;
      const productName = (match ? match[2] : chunk).trim();

      return {
        producto: productName,
        cantidad: Number.isFinite(quantity) ? quantity : 1,
        unidad: "unidad",
        precio: 0,
        tienda: store,
        source: "ai" as const,
        confidence: match ? 65 : 45,
        observaciones: "Normalizado desde entrada de texto local.",
      };
    });
}

const TextInputAdapter: InputAdapter = {
  type: "text",
  canHandle(input: SmartInput) {
    return typeof input.value === "string";
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

    const rawInputs = parseText(String(input.value));

    return {
      ok: rawInputs.length > 0,
      inputType: "text",
      rawInputs,
      error: rawInputs.length > 0 ? undefined : "No se detectaron productos en el texto.",
    };
  },
};

export default TextInputAdapter;
