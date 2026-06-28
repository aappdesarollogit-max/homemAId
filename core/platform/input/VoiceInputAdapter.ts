import { unsupportedInput, type InputAdapter } from "@/core/platform/input/InputTypes";

const VoiceInputAdapter: InputAdapter = {
  type: "voice",
  canHandle(input) {
    return input.type === "voice";
  },
  validate() {
    return { valid: false, message: "Voz no implementada todavía." };
  },
  normalize() {
    return unsupportedInput("voice", "Voz");
  },
};

export default VoiceInputAdapter;
