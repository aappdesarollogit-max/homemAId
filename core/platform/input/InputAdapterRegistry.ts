import type { InputAdapter, SmartInput, SmartInputType } from "@/core/platform/input/InputTypes";

export default class InputAdapterRegistry {
  private readonly adapters = new Map<SmartInputType, InputAdapter>();

  register(adapter: InputAdapter) {
    this.adapters.set(adapter.type, adapter);
  }

  get(type: SmartInputType) {
    return this.adapters.get(type);
  }

  getSupportedInputTypes() {
    return Array.from(this.adapters.keys());
  }

  findAdapter(input: SmartInput) {
    if (input.type) return this.adapters.get(input.type);

    return Array.from(this.adapters.values()).find((adapter) => adapter.canHandle(input));
  }
}
