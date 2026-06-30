"use client";

import { useState } from "react";

export default function ContextHelp({ text }: { text: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        aria-label="Ayuda"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="min-touch inline-flex h-8 min-h-8 w-8 min-w-8 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sm font-black text-white"
      >
        i
      </button>
      {isOpen ? (
        <span className="absolute right-0 top-10 z-20 w-64 rounded-2xl border border-white/10 bg-[#080b19] p-3 text-xs font-bold leading-relaxed text-white/75 shadow-2xl">
          {text}
        </span>
      ) : null}
    </span>
  );
}
