"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { isFirstRun } from "@/lib/services/first-run-service";

export default function FirstRunGate({ children }: { children: ReactNode }) {
  const [needsSetup, setNeedsSetup] = useState<boolean | undefined>();

  useEffect(() => {
    queueMicrotask(() => setNeedsSetup(isFirstRun()));
  }, []);

  if (needsSetup === undefined) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-sm font-bold text-white/55">
        Preparando tu hogar...
      </div>
    );
  }

  if (needsSetup) {
    return (
      <section className="mx-auto mt-10 max-w-2xl rounded-[32px] border border-white/10 bg-white/[0.05] p-8 text-center">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-300">
          Primer uso
        </p>
        <h1 className="mt-3 text-3xl font-black text-white">
          Aún no existe un hogar configurado.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          Crea tu hogar para entrar al dashboard con datos reales o elegir una demo controlada.
        </p>
        <Link
          href="/onboarding"
          className="mt-6 inline-flex rounded-2xl bg-violet-500 px-6 py-3 text-sm font-black text-white"
        >
          Crear mi hogar
        </Link>
      </section>
    );
  }

  return children;
}
