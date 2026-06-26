import { features } from "@/data/home";

export default function Features() {
  return (
    <section id="funciones" className="mt-20 w-full max-w-6xl scroll-mt-24">
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
            className="rounded-2xl border border-slate-800 bg-slate-900 p-8 transition hover:border-orange-400"
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
