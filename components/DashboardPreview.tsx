export default function DashboardPreview() {
  return (
    <section className="mt-24 w-full max-w-6xl">
      <div className="text-center mb-12">
        <p className="text-orange-400 font-semibold mb-2">
          Vista previa
        </p>

        <h2 className="text-3xl md:text-4xl font-bold">
          Todo tu hogar en un solo panel
        </h2>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
        <div className="grid gap-6 md:grid-cols-2">

          <div className="bg-slate-950 rounded-2xl p-6">
            <h3 className="font-semibold text-xl mb-4">
              Tareas pendientes
            </h3>

            <div className="space-y-3">
              <div className="bg-slate-900 rounded-xl p-3">
                ✅ Sacar la basura
              </div>

              <div className="bg-slate-900 rounded-xl p-3">
                🧺 Lavar ropa
              </div>

              <div className="bg-slate-900 rounded-xl p-3">
                💡 Pagar cuenta de luz
              </div>
            </div>
          </div>

          <div className="bg-slate-950 rounded-2xl p-6">
            <h3 className="font-semibold text-xl mb-4">
              Próximos recordatorios
            </h3>

            <div className="space-y-3">
              <div className="bg-slate-900 rounded-xl p-3">
                📅 Reunión apoderados - Viernes
              </div>

              <div className="bg-slate-900 rounded-xl p-3">
                🏦 Pago dividendo - 25 del mes
              </div>

              <div className="bg-slate-900 rounded-xl p-3">
                🚗 Revisión técnica - Próxima semana
              </div>
            </div>
          </div>

          <div className="bg-slate-950 rounded-2xl p-6">
            <h3 className="font-semibold text-xl mb-4">
              Lista de compras
            </h3>

            <div className="space-y-3">
              <div className="bg-slate-900 rounded-xl p-3">
                🥛 Leche
              </div>

              <div className="bg-slate-900 rounded-xl p-3">
                🍞 Pan
              </div>

              <div className="bg-slate-900 rounded-xl p-3">
                🧻 Papel higiénico
              </div>
            </div>
          </div>

          <div className="bg-orange-500 rounded-2xl p-6 text-white">
            <h3 className="font-semibold text-xl mb-4">
              Asistente IA
            </h3>

            <p>
              Detecté que esta semana tienes 8 tareas pendientes.
              ¿Quieres que organice automáticamente una planificación diaria?
            </p>

            <button className="mt-4 bg-white text-orange-500 font-semibold px-4 py-2 rounded-xl">
              Generar planificación
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}