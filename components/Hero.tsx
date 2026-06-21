import PrimaryButton from "./PrimaryButton";

export default function Hero() {
  return (
    <section className="w-full max-w-6xl grid gap-10 md:grid-cols-2 items-center">
      <div>
        <p className="text-orange-400 font-semibold mb-3">
          HomeMade IA
        </p>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Tu asistente inteligente para organizar el hogar
        </h1>

        <p className="text-slate-300 text-lg mb-8">
          Centraliza tareas, recordatorios, compras, rutinas y pendientes del hogar
          con ayuda de inteligencia artificial.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <PrimaryButton text="Comenzar" />

          <button className="border border-slate-700 hover:border-orange-400 text-white font-semibold px-6 py-3 rounded-xl transition">
            Ver funciones
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div className="bg-slate-950 rounded-2xl p-5">
          <p className="text-sm text-slate-400 mb-4">
            Panel del hogar
          </p>

          <div className="space-y-4">
            <div className="bg-slate-900 rounded-xl p-4">
              <p className="font-semibold">Comprar detergente</p>
              <p className="text-sm text-slate-400">Pendiente · Hoy</p>
            </div>

            <div className="bg-slate-900 rounded-xl p-4">
              <p className="font-semibold">Recordar pago de cuentas</p>
              <p className="text-sm text-slate-400">Vence en 2 días</p>
            </div>

            <div className="bg-orange-500 text-white rounded-xl p-4 font-semibold text-center">
              IA: “Te ayudo a organizar tu semana”
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}