import Link from "next/link";

const features = [
  {
    title: "Inventario inteligente",
    description: "Controla productos disponibles, abiertos y próximos a agotarse.",
    icon: "📦",
  },
  {
    title: "Compras con IA",
    description: "Registra compras escribiendo frases naturales como “compré leche”.",
    icon: "💬",
  },
  {
    title: "Ahorro familiar",
    description: "Detecta duplicados, gasto impulsivo y oportunidades de ahorro.",
    icon: "💰",
  },
];

const mvpGoals = [
  "Administrar hogar e integrantes",
  "Registrar compras y aperturas",
  "Mantener inventario actualizado",
  "Entender lenguaje natural",
  "Entregar recomendaciones básicas",
  "Dashboard de consumo",
];

function HomeMaidLogo() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="HomeMaid inicio">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-fuchsia-500 text-2xl shadow-lg shadow-violet-800/30">
        ⌂
      </div>
      <span className="text-2xl font-black tracking-normal text-white">
        Home<span className="text-violet-400">Maid</span>
      </span>
    </Link>
  );
}

function PhonePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[310px]">
      <div className="absolute -left-8 top-16 hidden h-36 w-24 rotate-[-10deg] rounded-[28px] border-[5px] border-neutral-900 bg-[#fbf9ff] shadow-2xl md:block">
        <div className="px-4 py-6">
          <p className="text-xs font-black">Inventario</p>
          <div className="mt-4 space-y-2">
            <div className="rounded-xl bg-violet-50 p-2 text-[10px] font-bold">🥛 Leche</div>
            <div className="rounded-xl bg-orange-50 p-2 text-[10px] font-bold">🧻 Papel</div>
          </div>
        </div>
      </div>

      <div className="absolute -right-8 bottom-16 hidden h-36 w-24 rotate-[10deg] rounded-[28px] border-[5px] border-neutral-900 bg-[#fbf9ff] shadow-2xl md:block">
        <div className="px-4 py-6">
          <p className="text-xs font-black">IA</p>
          <div className="mt-4 rounded-xl bg-violet-600 p-2 text-[9px] font-bold text-white">
            Necesitarás leche en 3 días.
          </div>
        </div>
      </div>

      <div className="relative rounded-[42px] border-[8px] border-neutral-950 bg-neutral-950 shadow-2xl shadow-violet-950/40">
        <div className="absolute left-1/2 top-3 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-neutral-950" />
        <div className="min-h-[610px] overflow-hidden rounded-[32px] bg-[#fbf9ff] text-slate-950">
          <div className="flex items-center justify-between px-6 pt-5 text-xs font-bold">
            <span>9:41</span>
            <span>▰ ▰ ▰</span>
          </div>

          <div className="px-6 py-7">
            <p className="text-xl font-black">¡Hola, Rody! 👋</p>
            <p className="mt-1 text-xs text-slate-500">
              Aquí tienes el resumen de tu hogar
            </p>

            <div className="mt-6 rounded-3xl bg-emerald-100 p-5">
              <p className="text-xs font-bold text-emerald-700">Estado del hogar</p>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-black text-emerald-700">Todo en orden</p>
                  <p className="text-xs text-emerald-700">Excelente trabajo</p>
                </div>
                <span className="text-5xl">🙂</span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                ["Productos", "126", "Total en inventario"],
                ["Por agotarse", "8", "Requieren atención"],
                ["Gasto del mes", "$432.000", "70% presupuesto"],
                ["Ahorro", "$68.000", "Este mes"],
              ].map(([label, value, note]) => (
                <div key={label} className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-[10px] font-bold text-slate-500">{label}</p>
                  <p className="mt-2 text-lg font-black">{value}</p>
                  <p className="mt-1 text-[10px] text-slate-400">{note}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-3xl bg-violet-600 p-5 text-white">
              <p className="text-sm font-black">🤖 Recomendación IA</p>
              <p className="mt-2 text-xs leading-relaxed text-violet-100">
                Detecté que necesitarás leche antes del fin de semana y que tu gasto
                en snacks subió esta semana.
              </p>
            </div>
          </div>

          <div className="absolute bottom-8 left-8 right-8 flex h-14 items-center justify-around rounded-2xl bg-white text-xs font-bold text-slate-400 shadow-xl">
            <span className="text-violet-600">⌂</span>
            <span>▤</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-lg text-white">
              +
            </span>
            <span>◌</span>
            <span>•••</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f7fb] text-slate-950">
      <section className="bg-[#060814] text-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <HomeMaidLogo />
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full px-5 py-2 text-sm font-bold text-white/80 hover:text-white sm:block"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              className="rounded-full bg-white px-5 py-2 text-sm font-black text-violet-700 hover:bg-violet-100"
            >
              Crear hogar
            </Link>
          </div>
        </nav>

        <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-10 lg:grid-cols-[1fr_430px] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-violet-300">
              Asistente doméstico con IA
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight tracking-normal md:text-7xl">
              Un hogar organizado, feliz y más inteligente.
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-white/80">
              HomeMaid administra inventario, compras, consumo y ahorro familiar
              desde una experiencia simple, visual y pensada para el día a día.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/registro"
                className="rounded-2xl bg-violet-500 px-7 py-4 text-center font-black text-white shadow-xl shadow-violet-900/30 hover:bg-violet-400"
              >
                Comenzar
              </Link>
              <Link
                href="/dashboard"
                className="rounded-2xl border border-white/15 px-7 py-4 text-center font-black text-white hover:border-violet-300"
              >
                Ver dashboard
              </Link>
            </div>

            <div className="mt-12 grid max-w-2xl gap-3 sm:grid-cols-2">
              {mvpGoals.map((goal) => (
                <div key={goal} className="flex items-center gap-3 text-sm font-semibold text-white/85">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-slate-950">
                    ✓
                  </span>
                  {goal}
                </div>
              ))}
            </div>
          </div>

          <PhonePreview />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 max-w-2xl">
          <p className="font-black uppercase tracking-[0.2em] text-violet-600">
            Funciones principales
          </p>
          <h2 className="mt-3 text-4xl font-black">El estilo del mockup, aplicado a la app real</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-3xl">
                {feature.icon}
              </div>
              <h3 className="mt-6 text-xl font-black">{feature.title}</h3>
              <p className="mt-3 leading-relaxed text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
