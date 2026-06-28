import { unsupportedInput, type InputAdapter } from "@/core/platform/input/InputTypes";

const ApiInputAdapter: InputAdapter = {
  type: "api",
  canHandle(input) {
    return input.type === "api";
  },
  validate() {
    return { valid: false, message: "API no implementada todavía." };
  },
  normalize() {
    return unsupportedInput("api", "API");
  },
};

export default ApiInputAdapter;
