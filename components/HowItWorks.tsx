import { howItWorksSteps } from "@/data/home";

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="mt-24 w-full max-w-6xl scroll-mt-24">
      <div className="text-center mb-12">
        <p className="text-orange-400 font-semibold mb-2">
          Cómo funciona
        </p>

        <h2 className="text-3xl md:text-4xl font-bold">
          Organiza tu hogar en 3 simples pasos
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {howItWorksSteps.map((step) => (
          <article
            key={step.step}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center"
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
