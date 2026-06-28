"use client";

import { useMemo, useState } from "react";
import SmartInputFramework from "@/core/platform/input/SmartInputFramework";
import type { SmartInput, SmartInputResult } from "@/core/platform/input/InputTypes";

export function useSmartInput() {
  const framework = useMemo(() => new SmartInputFramework(), []);
  const [result, setResult] = useState<SmartInputResult>();
  const [error, setError] = useState<string>();

  function sendInput(input: SmartInput) {
    const nextResult = framework.receiveInput(input);

    setResult(nextResult);
    setError(nextResult.ok ? undefined : nextResult.error);
    return nextResult;
  }

  return {
    result,
    error,
    supportedInputTypes: framework.getSupportedInputTypes(),
    sendInput,
  };
}
