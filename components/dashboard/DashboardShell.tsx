import Link from "next/link";
import { dashboardViews } from "@/lib/mock-home";
import type { DashboardView } from "@/types/domain";
import type { ReactNode } from "react";

function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-3 lg:mb-10">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-fuchsia-500 text-2xl shadow-lg shadow-violet-900/40">
        ⌂
      </div>
      <span className="text-2xl font-black">
        Home<span className="text-violet-400">Maid</span>
      </span>
    </Link>
  );
}

export default function DashboardShell({
  activeView,
  children,
}: {
  activeView: DashboardView;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#050713] text-white">
      <div className="flex">
        <aside className="hidden min-h-screen w-72 border-r border-white/10 bg-[#080b19] p-6 lg:block">
          <AppLogo />

          <nav aria-label="Navegación del panel" className="space-y-2 text-sm">
            {dashboardViews.map((item) => {
              const isActive = item.id === activeView;

              return (
                <Link
                  key={item.id}
                  href={`/dashboard?view=${item.id}`}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition ${
                    isActive
                      ? "bg-violet-500 text-white shadow-lg shadow-violet-950/30"
                      : "text-white/65 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-lg font-black">MVP HomeMaid</p>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              Base navegable lista para conectar formularios, base de datos e IA.
            </p>
          </div>
        </aside>

        <section className="min-h-screen w-full px-4 pb-28 pt-5 sm:px-5 md:p-8 lg:p-10">
          <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
            <AppLogo />
            <Link
              href="/"
              className="min-touch rounded-full bg-white px-4 py-2 text-sm font-black text-violet-700"
            >
              Inicio
            </Link>
          </div>

          {children}
        </section>
      </div>

      <nav
        aria-label="Navegación principal móvil"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#080b19]/95 px-2 pb-safe pt-2 shadow-2xl backdrop-blur lg:hidden"
      >
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
          {dashboardViews
            .filter((item) =>
              ["inicio", "inventario", "compras", "consumo", "asistente"].includes(item.id),
            )
            .map((item) => {
              const isActive = item.id === activeView;

              return (
                <Link
                  key={item.id}
                  href={`/dashboard?view=${item.id}`}
                  className={`min-touch flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-black transition ${
                    isActive
                      ? "bg-violet-500 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="text-lg leading-none">{item.icon}</span>
                  <span className="max-w-full truncate">{item.label}</span>
                </Link>
              );
            })}
        </div>
      </nav>
    </main>
  );
}
