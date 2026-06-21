const steps = [
  {
    step: "01",
    title: "Configura tu hogar",
    description:
      "Define integrantes, rutinas, tareas frecuentes y preferencias familiares.",
  },
  {
    step: "02",
    title: "Organiza con IA",
    description:
      "La inteligencia artificial te ayuda a crear listas, recordatorios y planes semanales.",
  },
  {
    step: "03",
    title: "Mantén el control",
    description:
      "Visualiza tareas, pendientes y actividades desde un único panel.",
  },
];

export default function HowItWorks() {
  return (
    <section className="mt-24 w-full max-w-6xl">
      <div className="text-center mb-12">
        <p className="text-orange-400 font-semibold mb-2">
          Cómo funciona
        </p>

        <h2 className="text-3xl md:text-4xl font-bold">
          Organiza tu hogar en 3 simples pasos
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <article
            key={step.step}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center"
          >
            <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-orange-500 flex items-center justify-center font-bold text-xl">
              {step.step}
            </div>

            <h3 className="text-xl font-semibold mb-3">
              {step.title}
            </h3>

            <p className="text-slate-400">
              {step.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}