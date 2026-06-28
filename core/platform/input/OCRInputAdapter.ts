import { unsupportedInput, type InputAdapter } from "@/core/platform/input/InputTypes";

const OCRInputAdapter: InputAdapter = {
  type: "ocr",
  canHandle(input) {
    return input.type === "ocr";
  },
  validate() {
    return { valid: false, message: "OCR no implementado todavía." };
  },
  normalize() {
    return unsupportedInput("ocr", "OCR");
  },
};

export default OCRInputAdapter;
