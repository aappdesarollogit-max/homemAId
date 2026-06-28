import { unsupportedInput, type InputAdapter } from "@/core/platform/input/InputTypes";

const ExcelInputAdapter: InputAdapter = {
  type: "excel",
  canHandle(input) {
    return input.type === "excel";
  },
  validate() {
    return { valid: false, message: "Excel no implementado todavía." };
  },
  normalize() {
    return unsupportedInput("excel", "Excel");
  },
};

export default ExcelInputAdapter;
