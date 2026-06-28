import type {
  InputAdapter,
  SmartInput,
  SmartInputNormalizeResult,
} from "@/core/platform/input/InputTypes";
import type { RawPurchaseInput } from "@/lib/ingestion/DataIngestionEngine";

function isRawPurchaseInputArray(value: unknown): value is RawPurchaseInput[] {
  return Array.isArray(value);
}

const ManualInputAdapter: InputAdapter = {
  type: "manual",
  canHandle(input: SmartInput) {
    return input.type === "manual" || isRawPurchaseInputArray(input.value);
  },
  validate(input: SmartInput) {
    if (!isRawPurchaseInputArray(input.value) || input.value.length === 0) {
      return { valid: false, message: "Entrada manual inválida." };
    }

    return { valid: true };
  },
  normalize(input: SmartInput): SmartInputNormalizeResult {
    const validation = this.validate(input);
    if (!validation.valid) {
      return {
        ok: false,
        inputType: "manual",
        rawInputs: [],
        error: validation.message,
      };
    }

    return {
      ok: true,
      inputType: "manual",
      rawInputs: (input.value as RawPurchaseInput[]).map((rawInput) => ({
        ...rawInput,
        source: rawInput.source ?? "manual",
      })),
    };
  },
};

export default ManualInputAdapter;
