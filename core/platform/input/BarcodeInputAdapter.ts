import { unsupportedInput, type InputAdapter } from "@/core/platform/input/InputTypes";

const BarcodeInputAdapter: InputAdapter = {
  type: "barcode",
  canHandle(input) {
    return input.type === "barcode";
  },
  validate() {
    return { valid: false, message: "Código de barras no implementado todavía." };
  },
  normalize() {
    return unsupportedInput("barcode", "Código de barras");
  },
};

export default BarcodeInputAdapter;
