const features = [
  {
    title: "Comida casera",
    description: "Encuentra preparaciones hechas por personas cercanas a tu zona.",
  },
  {
    title: "Pedidos simples",
    description: "Agenda, confirma y coordina tus pedidos desde la aplicación.",
  },
  {
    title: "Experiencia cercana",
    description: "Conecta con cocineros locales de forma simple y confiable.",
  },
];

export default function Features() {
  return (
    <section className="grid gap-4 mt-12 max-w-4xl md:grid-cols-3">
      {features.map((feature) => (
        <article
          key={feature.title}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center"
        >
          <h2 className="text-lg font-semibold mb-2">
            {feature.title}
          </h2>

          <p className="text-sm text-slate-400">
            {feature.description}
          </p>
        </article>
      ))}
    </section>
  );
}