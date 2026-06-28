import type {
  DataIngestionResult,
  RawPurchaseInput,
} from "@/lib/ingestion/DataIngestionEngine";

export type SmartInputType = "manual" | "text" | "ocr" | "barcode" | "voice" | "excel" | "api";

export type SmartInput = {
  type?: SmartInputType;
  value: unknown;
  source?: string;
  correlationId?: string;
  metadata?: Record<string, string | number | boolean | undefined>;
};

export type SmartInputValidation = {
  valid: boolean;
  message?: string;
};

export type SmartInputNormalizeResult = {
  ok: boolean;
  inputType: SmartInputType;
  rawInputs: RawPurchaseInput[];
  error?: string;
};

export type SmartInputResult = SmartInputNormalizeResult & {
  ingestionResult?: DataIngestionResult;
};

export type InputAdapter = {
  type: SmartInputType;
  canHandle(input: SmartInput): boolean;
  validate(input: SmartInput): SmartInputValidation;
  normalize(input: SmartInput): SmartInputNormalizeResult;
};

export function unsupportedInput(type: SmartInputType, label: string): SmartInputNormalizeResult {
  return {
    ok: false,
    inputType: type,
    rawInputs: [],
    error: `${label} no implementado todavía.`,
  };
}
