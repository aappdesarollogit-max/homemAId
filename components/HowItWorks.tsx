const steps = [
  {
    number: "01",
    title: "Elige una preparación",
    description: "Explora opciones de comida casera disponibles cerca de tu zona.",
  },
  {
    number: "02",
    title: "Agenda tu pedido",
    description: "Selecciona horario, cantidad y confirma la solicitud desde la app.",
  },
  {
    number: "03",
    title: "Coordina la entrega",
    description: "Recibe actualizaciones simples para retirar o recibir tu pedido.",
  },
];

export default function HowItWorks() {
  return (
    <section className="mt-16 max-w-5xl w-full">
      <div className="text-center mb-8">
        <p className="text-orange-400 font-semibold mb-2">
          Cómo funciona
        </p>

        <h2 className="text-3xl font-bold">
          Pide comida casera en pocos pasos
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step) => (
          <article
            key={step.number}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
          >
            <span className="text-orange-400 text-sm font-bold">
              {step.number}
            </span>

            <h3 className="text-xl font-semibold mt-3 mb-2">
              {step.title}
            </h3>

            <p className="text-slate-400 text-sm">
              {step.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}