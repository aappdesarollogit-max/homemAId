import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              Dashboard HomeMade
            </h1>

            <p className="text-slate-400 mt-2">
              Bienvenido a tu asistente inteligente para el hogar.
            </p>
          </div>

          <Link
            href="/"
            className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl"
          >
            Volver al inicio
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">

          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
            <h2 className="text-xl font-semibold mb-4">
              Tareas pendientes
            </h2>

            <ul className="space-y-3 text-slate-300">
              <li>✅ Sacar la basura</li>
              <li>🧺 Lavar ropa</li>
              <li>💡 Pagar cuenta de luz</li>
            </ul>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
            <h2 className="text-xl font-semibold mb-4">
              Recordatorios
            </h2>

            <ul className="space-y-3 text-slate-300">
              <li>📅 Reunión escolar</li>
              <li>🏦 Pago dividendo</li>
              <li>🚗 Revisión técnica</li>
            </ul>
          </div>

          <div className="bg-orange-500 rounded-3xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              Asistente IA
            </h2>

            <p>
              Detecté 8 tareas pendientes esta semana.
              ¿Deseas generar una planificación automática?
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}