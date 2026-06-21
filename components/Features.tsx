const features = [
  {
    icon: "✅",
    title: "Tareas del hogar",
    description:
      "Crea, ordena y prioriza pendientes como limpieza, compras, pagos o mantenciones.",
  },
  {
    icon: "🔔",
    title: "Recordatorios inteligentes",
    description:
      "Recibe alertas para no olvidar cuentas, compras importantes o rutinas familiares.",
  },
  {
    icon: "🛒",
    title: "Lista de compras",
    description:
      "Organiza productos pendientes y deja que la IA sugiera lo que podrías necesitar.",
  },
  {
    icon: "📅",
    title: "Agenda familiar",
    description:
      "Centraliza actividades, responsabilidades y fechas importantes del hogar.",
  },
  {
    icon: "🤖",
    title: "Asistente IA",
    description:
      "Pide ayuda para planificar la semana, ordenar tareas o crear listas automáticamente.",
  },
  {
    icon: "🏠",
    title: "Panel del hogar",
    description:
      "Visualiza en una sola pantalla todo lo importante para mantener tu casa organizada.",
  },
];

export default function Features() {
  return (
    <section className="mt-20 w-full max-w-6xl">
      <div className="text-center mb-12">
        <p className="text-orange-400 font-semibold mb-2">
          Funciones principales
        </p>

        <h2 className="text-3xl md:text-4xl font-bold">
          Una app para que el hogar funcione mejor
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-orange-400 transition"
          >
            <div className="text-4xl mb-4">
              {feature.icon}
            </div>

            <h3 className="text-xl font-semibold mb-3">
              {feature.title}
            </h3>

            <p className="text-slate-400">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}