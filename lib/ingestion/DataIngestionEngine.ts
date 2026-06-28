import type { PurchaseProvider } from "@/lib/contracts/PurchaseProvider";
import InventoryUpdater, {
  type InventoryUpdaterProvider,
} from "@/lib/ingestion/InventoryUpdater";
import PurchaseNormalizer from "@/lib/ingestion/PurchaseNormalizer";
import SourceResolver from "@/lib/ingestion/SourceResolver";
import ValidationEngine, {
  type ValidationResult,
} from "@/lib/ingestion/ValidationEngine";
import type { Purchase } from "@/types/domain";

export type InputSource = "manual" | "ocr" | "barcode" | "excel" | "ai" | "api";

export type RawPurchaseInput = {
  producto?: string;
  cantidad?: number | string;
  precio?: number | string;
  unidad?: string;
  tienda?: string;
  fecha?: string;
  categoria?: string;
  observaciones?: string;
  source?: InputSource;
  confidence?: number;
  productId?: string;
};

export type NormalizedPurchaseItem = {
  productId?: string;
  productName: string;
  quantity: number;
  unit: string;
  price: number;
  category?: string;
  notes?: string;
  confidence?: number;
};

export type NormalizedPurchase = {
  store: string;
  date: string;
  source: InputSource;
  confidence?: number;
  observations?: string;
  items: NormalizedPurchaseItem[];
};

export type DataIngestionResult = {
  ok: boolean;
  source: InputSource;
  validation: ValidationResult;
  normalizedPurchase?: NormalizedPurchase;
  purchase?: Purchase;
};

export type DataIngestionDependencies = {
  purchaseProvider: PurchaseProvider;
  inventoryProvider: InventoryUpdaterProvider;
  sourceResolver?: SourceResolver;
  validationEngine?: ValidationEngine;
  purchaseNormalizer?: PurchaseNormalizer;
  inventoryUpdater?: InventoryUpdater;
};

export default class DataIngestionEngine {
  private readonly sourceResolver: SourceResolver;
  private readonly validationEngine: ValidationEngine;
  private readonly purchaseNormalizer: PurchaseNormalizer;
  private readonly inventoryUpdater: InventoryUpdater;
  private readonly purchaseProvider: PurchaseProvider;

  constructor(dependencies: DataIngestionDependencies) {
    this.purchaseProvider = dependencies.purchaseProvider;
    this.sourceResolver = dependencies.sourceResolver ?? new SourceResolver();
    this.validationEngine = dependencies.validationEngine ?? new ValidationEngine();
    this.purchaseNormalizer = dependencies.purchaseNormalizer ?? new PurchaseNormalizer();
    this.inventoryUpdater =
      dependencies.inventoryUpdater ?? new InventoryUpdater(dependencies.inventoryProvider);
  }

  receive(rawInputs: RawPurchaseInput | RawPurchaseInput[]): DataIngestionResult {
    const inputs = Array.isArray(rawInputs) ? rawInputs : [rawInputs];
    const source = this.detectSource(inputs);
    const validation = this.validate(inputs);

    if (!validation.valid) {
      return {
        ok: false,
        source,
        validation,
      };
    }

    const normalizedPurchase = this.normalize(inputs, source);
    const purchase = this.createPurchase(normalizedPurchase);

    this.updateInventory(normalizedPurchase);
    this.updateConsumption();

    return {
      ok: true,
      source,
      validation,
      normalizedPurchase,
      purchase,
    };
  }

  detectSource(inputs: RawPurchaseInput[]) {
    return this.sourceResolver.detectSource(inputs);
  }

  validate(inputs: RawPurchaseInput[]) {
    return this.validationEngine.validate(inputs);
  }

  normalize(inputs: RawPurchaseInput[], source: InputSource) {
    return this.purchaseNormalizer.normalize(inputs, source);
  }

  createPurchase(normalizedPurchase: NormalizedPurchase) {
    return this.purchaseProvider.createPurchase(normalizedPurchase);
  }

  updateInventory(normalizedPurchase: NormalizedPurchase) {
    this.inventoryUpdater.updateInventory(normalizedPurchase);
  }

  updateConsumption() {
    // Consumption is derived from purchases at read time, so no write-side action is needed.
  }
}
