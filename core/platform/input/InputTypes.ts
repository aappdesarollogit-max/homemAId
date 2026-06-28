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
  parsedPurchase?: ParsedPurchase;
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

export type ParsedPurchaseProduct = {
  productName: string;
  normalizedName: string;
  quantity: number;
  unit: string;
  category?: string;
  productId?: string;
  price?: number;
  confidence: number;
};

export type ParsedPurchase = {
  products: ParsedPurchaseProduct[];
  store?: string;
  totalAmount?: number;
  date?: string;
  observations?: string;
  errors: string[];
  warnings: string[];
  confidence: number;
  originalText: string;
};

export function unsupportedInput(type: SmartInputType, label: string): SmartInputNormalizeResult {
  return {
    ok: false,
    inputType: type,
    rawInputs: [],
    error: `${label} no implementado todavía.`,
  };
}
