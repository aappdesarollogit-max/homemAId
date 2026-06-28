import { getEventBus } from "@/core/platform/events/EventBus";
import ApiInputAdapter from "@/core/platform/input/ApiInputAdapter";
import BarcodeInputAdapter from "@/core/platform/input/BarcodeInputAdapter";
import ExcelInputAdapter from "@/core/platform/input/ExcelInputAdapter";
import InputAdapterRegistry from "@/core/platform/input/InputAdapterRegistry";
import ManualInputAdapter from "@/core/platform/input/ManualInputAdapter";
import OCRInputAdapter from "@/core/platform/input/OCRInputAdapter";
import TextInputAdapter from "@/core/platform/input/TextInputAdapter";
import type {
  InputAdapter,
  SmartInput,
  SmartInputResult,
  SmartInputType,
} from "@/core/platform/input/InputTypes";
import VoiceInputAdapter from "@/core/platform/input/VoiceInputAdapter";
import type DataIngestionEngine from "@/lib/ingestion/DataIngestionEngine";

export type SmartInputFrameworkDependencies = {
  registry?: InputAdapterRegistry;
  ingestionEngine?: DataIngestionEngine;
};

export default class SmartInputFramework {
  private readonly registry: InputAdapterRegistry;
  private readonly ingestionEngine?: DataIngestionEngine;

  constructor(dependencies: SmartInputFrameworkDependencies = {}) {
    this.registry = dependencies.registry ?? createDefaultInputAdapterRegistry();
    this.ingestionEngine = dependencies.ingestionEngine;
  }

  receiveInput(input: SmartInput): SmartInputResult {
    const correlationId = input.correlationId ?? `input-${Date.now()}`;
    const eventBus = getEventBus();

    eventBus.publish({
      type: "input.received",
      source: "input",
      correlationId,
      payload: {
        type: input.type ?? "unknown",
        source: input.source,
      },
    });

    const normalizedInput = this.normalizeInput(input);

    if (!normalizedInput.ok) {
      eventBus.publish({
        type: "input.failed",
        source: "input",
        correlationId,
        payload: {
          inputType: normalizedInput.inputType,
          error: normalizedInput.error,
        },
      });
      return normalizedInput;
    }

    eventBus.publish({
      type: "input.normalized",
      source: "input",
      correlationId,
      payload: {
        inputType: normalizedInput.inputType,
        items: normalizedInput.rawInputs.length,
      },
    });

    return this.sendToDataIngestion(normalizedInput);
  }

  detectInputType(input: SmartInput): SmartInputType | undefined {
    return this.registry.findAdapter(input)?.type;
  }

  normalizeInput(input: SmartInput) {
    const adapter = this.registry.findAdapter(input);

    if (!adapter) {
      return {
        ok: false,
        inputType: input.type ?? ("text" as SmartInputType),
        rawInputs: [],
        error: "No hay adaptador compatible para esta entrada.",
      };
    }

    return adapter.normalize(input);
  }

  sendToDataIngestion(result: SmartInputResult): SmartInputResult {
    if (!this.ingestionEngine) return result;

    return {
      ...result,
      ingestionResult: this.ingestionEngine.receive(result.rawInputs),
    };
  }

  getSupportedInputTypes() {
    return this.registry.getSupportedInputTypes();
  }
}

export function createDefaultInputAdapterRegistry(adapters: InputAdapter[] = []) {
  const registry = new InputAdapterRegistry();

  [
    ManualInputAdapter,
    TextInputAdapter,
    OCRInputAdapter,
    BarcodeInputAdapter,
    VoiceInputAdapter,
    ExcelInputAdapter,
    ApiInputAdapter,
    ...adapters,
  ].forEach((adapter) => registry.register(adapter));

  return registry;
}
