import Link from "next/link";
import {
  aiRecommendations,
  criticalInventory,
  dashboardKpis,
  dashboardMenuItems,
  quickActions,
  recentPurchases,
} from "@/data/home";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <div className="flex">
        <aside className="hidden min-h-screen w-72 border-r border-white/10 bg-[#07101f] p-6 md:block">
          <Link href="/" className="mb-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-xl font-bold shadow-lg shadow-orange-500/30">
              H
            </div>
            <span className="text-2xl font-bold">
              Home<span className="text-orange-500">Maid</span>
            </span>
          </Link>

          <nav aria-label="Navegación del panel" className="space-y-2 text-sm">
            {dashboardMenuItems.map(([icon, item], index) => (
              <button
                key={item}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                  index === 0
                    ? "bg-gradient-to-r from-orange-500/30 to-orange-500/10 text-orange-200"
                    : "text-slate-300 hover:bg-white/5"
                }`}
                type="button"
              >
                <span className="text-lg" aria-hidden="true">
                  {icon}
                </span>
                <span>{item}</span>
              </button>
            ))}
          </nav>

          <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-xl">
            <p className="text-lg font-bold">👑 Versión Premium</p>
            <p className="mt-2 text-sm text-slate-400">
              Desbloquea predicciones, ahorro avanzado y más inteligencia.
            </p>
            <button className="mt-4 w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-2 font-semibold hover:from-orange-400 hover:to-orange-500">
              Actualizar
            </button>
          </div>
        </aside>

        <section className="w-full p-6 md:p-10">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-orange-400">¡Hola, Mi hogar! 👋</p>
              <h1 className="text-4xl font-bold">Resumen de tu hogar</h1>
              <p className="mt-2 text-slate-400">
                Aquí tienes el estado actualizado de consumo, compras y ahorro.
              </p>
            </div>

            <Link
              href="/"
              className="w-fit rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
            >
              Volver al inicio
            </Link>
          </div>

          <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {dashboardKpis.map((kpi) => (
              <div
                key={kpi.label}
                className={`rounded-2xl border border-white/10 bg-gradient-to-br ${kpi.gradient} to-white/[0.03] p-6 shadow-xl`}
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl"
                  aria-hidden="true"
                >
                  {kpi.icon}
                </div>
                <p className="text-3xl font-bold">{kpi.value}</p>
                <p className="mt-1 text-slate-300">{kpi.label}</p>
                <p className="mt-3 text-sm text-green-400">{kpi.note}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-red-500/20 bg-white/[0.03] p-6 shadow-xl">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">⚠️ Inventario crítico</h2>
                <button className="text-sm text-orange-400" type="button">
                  Ver todo
                </button>
              </div>

              <div className="space-y-4">
                {criticalInventory.map((item) => (
                  <div
                    key={item.product}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-[#0b1424] p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-3xl"
                        aria-hidden="true"
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-semibold">{item.product}</p>
                        <p className="text-sm text-orange-300">{item.status}</p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${item.badgeClassName}`}
                    >
                      {item.level}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">🛒 Últimas compras</h2>
                <button className="text-sm text-orange-400" type="button">
                  Ver todas
                </button>
              </div>

              <div className="space-y-4">
                {recentPurchases.map((purchase) => (
                  <div
                    key={purchase.product}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-[#0b1424] p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-3xl"
                        aria-hidden="true"
                      >
                        {purchase.icon}
                      </div>
                      <div>
                        <p className="font-semibold">{purchase.product}</p>
                        <p className="text-sm text-slate-400">{purchase.date}</p>
                      </div>
                    </div>
                    <p className="font-semibold">{purchase.price}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 p-6 shadow-2xl shadow-orange-700/30">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">🤖 Recomendaciones IA</h2>
                <button className="rounded-xl bg-white/20 px-3 py-1 text-sm">
                  Ver todas
                </button>
              </div>

              <div className="space-y-4">
                {aiRecommendations.map((recommendation) => (
                  <div key={recommendation.title} className="rounded-2xl bg-black/20 p-4">
                    <p className="font-semibold">{recommendation.title}</p>
                    <p className="text-sm text-orange-100">{recommendation.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl">
              <h2 className="mb-5 text-2xl font-bold">⚡ Acciones rápidas</h2>

              <div className="space-y-4">
                {quickActions.map(([icon, title, text]) => (
                  <button
                    key={title}
                    className="w-full rounded-2xl border border-white/5 bg-[#0b1424] p-4 text-left transition hover:bg-white/10"
                    type="button"
                  >
                    <span className="mr-3 text-2xl" aria-hidden="true">
                      {icon}
                    </span>
                    <span className="font-semibold">{title}</span>
                    <p className="ml-10 text-sm text-slate-400">{text}</p>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-8 rounded-2xl border border-purple-500/30 bg-purple-950/40 p-5 shadow-xl shadow-purple-950/20">
            <p>
              ⭐ ¡Vas muy bien! Tu hogar está 15% más organizado que el mes
              pasado.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
