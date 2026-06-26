import { aiRecommendations, criticalInventory, recentPurchases } from "@/data/home";

export default function DashboardPreview() {
  return (
    <section id="panel" className="mt-24 w-full max-w-6xl scroll-mt-24">
      <div className="mb-12 text-center">
        <p className="mb-2 font-semibold text-orange-400">Vista previa</p>

        <h2 className="text-3xl font-bold md:text-4xl">
          Todo tu consumo familiar en un solo panel
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-slate-400">
          HomeMaid combina inventario, consumo, compras y ahorro para ayudarte a
          tomar mejores decisiones en el hogar.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-950 p-6">
            <h3 className="mb-4 text-xl font-semibold">Inventario crítico</h3>

            <div className="space-y-3">
              {criticalInventory.map((item) => (
                <div key={item.product} className="rounded-xl bg-slate-900 p-4">
                  <p className="font-semibold">
                    {item.icon} {item.product}
                  </p>
                  <p className="text-sm text-orange-300">{item.status}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-950 p-6">
            <h3 className="mb-4 text-xl font-semibold">Consumo estimado</h3>

            <div className="space-y-3">
              <div className="rounded-xl bg-slate-900 p-4">
                <p className="font-semibold">Leche</p>
                <p className="text-sm text-slate-400">
                  Tu familia consume aprox. 1 litro cada 2 días.
                </p>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="font-semibold">Detergente</p>
                <p className="text-sm text-slate-400">
                  La última unidad duró 58 días.
                </p>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="font-semibold">Pan</p>
                <p className="text-sm text-slate-400">
                  Sueles comprarlo 4 veces por semana.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-950 p-6">
            <h3 className="mb-4 text-xl font-semibold">Últimas compras</h3>

            <div className="space-y-3">
              {recentPurchases.map((purchase) => (
                <div
                  key={purchase.product}
                  className="flex items-center justify-between rounded-xl bg-slate-900 p-4"
                >
                  <div>
                    <p className="font-semibold">
                      {purchase.icon} {purchase.product}
                    </p>
                    <p className="text-sm text-slate-400">{purchase.date}</p>
                  </div>
                  <p className="font-semibold">{purchase.price}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-orange-500 p-6 text-white">
            <h3 className="mb-4 text-xl font-semibold">Asistente IA</h3>

            <p>
              {aiRecommendations[0].title}. {aiRecommendations[0].text}
            </p>

            <button className="mt-4 rounded-xl bg-white px-4 py-2 font-semibold text-orange-500">
              Ver recomendaciones
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
