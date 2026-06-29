"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isFirstRun } from "@/lib/services/first-run-service";

export default function FirstRunLandingActions() {
  const [needsSetup, setNeedsSetup] = useState<boolean | undefined>();

  useEffect(() => {
    queueMicrotask(() => setNeedsSetup(isFirstRun()));
  }, []);

  if (needsSetup === undefined) {
    return (
      <div className="mt-9 h-14 max-w-md rounded-2xl border border-white/10 bg-white/5" />
    );
  }

  if (needsSetup) {
    return (
      <div className="mt-9 max-w-xl rounded-3xl border border-white/10 bg-white/[0.06] p-5">
        <p className="text-sm font-bold text-white/75">
          Aún no existe un hogar configurado.
        </p>
        <Link
          href="/onboarding"
          className="mt-4 inline-flex rounded-2xl bg-violet-500 px-7 py-4 text-center font-black text-white shadow-xl shadow-violet-900/30 hover:bg-violet-400"
        >
          Crear mi hogar
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-9 flex flex-col gap-4 sm:flex-row">
      <Link
        href="/dashboard"
        className="rounded-2xl bg-violet-500 px-7 py-4 text-center font-black text-white shadow-xl shadow-violet-900/30 hover:bg-violet-400"
      >
        Entrar al dashboard
      </Link>
      <Link
        href="/dashboard?view=compras&mode=nueva"
        className="rounded-2xl border border-white/15 px-7 py-4 text-center font-black text-white hover:border-violet-300"
      >
        Registrar compra
      </Link>
    </div>
  );
}
