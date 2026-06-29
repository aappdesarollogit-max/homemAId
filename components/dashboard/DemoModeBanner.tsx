"use client";

import { useEffect, useState } from "react";
import { isDemoMode, startFromScratch } from "@/lib/services/first-run-service";

export default function DemoModeBanner() {
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setDemoMode(isDemoMode()));
  }, []);

  if (!demoMode) return null;

  function handleStartFromScratch() {
    startFromScratch();
    setDemoMode(false);
    window.location.href = "/dashboard";
  }

  return (
    <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-sky-300/20 bg-sky-300/10 px-4 py-3 text-sm font-bold text-sky-50 sm:flex-row sm:items-center sm:justify-between">
      <span>Modo demostración</span>
      <button
        type="button"
        onClick={handleStartFromScratch}
        className="rounded-xl bg-white px-4 py-2 text-sm font-black text-sky-800"
      >
        Comenzar desde cero
      </button>
    </div>
  );
}
