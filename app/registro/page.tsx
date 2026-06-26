import Link from "next/link";

const setupSteps = [
  "Crea tu hogar",
  "Agrega integrantes",
  "Define presupuesto",
  "Recibe recomendaciones IA",
];

function SetupPanel() {
  return (
    <aside className="hidden rounded-[32px] bg-[#fbf9ff] p-8 text-slate-950 shadow-2xl lg:block">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-fuchsia-500 text-2xl shadow-lg shadow-violet-300/50">
          ⌂
        </div>
        <span className="text-2xl font-black">
          Home<span className="text-violet-600">Maid</span>
        </span>
      </div>

      <p className="mt-12 text-3xl font-black leading-tight">
        Empieza configurando el ADN de tu hogar.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        Mientras más contexto tenga HomeMaid, mejores alertas y recomendaciones
        podrá entregar.
      </p>

      <div className="mt-10 space-y-4">
        {setupSteps.map((step, index) => (
          <div key={step} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-black text-violet-700">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="font-black">{step}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#060814] px-6 py-10 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-10 lg:grid-cols-[1fr_460px] lg:items-center">
        <SetupPanel />

        <section className="w-full rounded-[32px] border border-white/10 bg-white/[0.06] p-8 shadow-2xl backdrop-blur">
          <Link href="/" className="text-sm font-bold text-violet-300 hover:text-violet-200">
            ← Volver al inicio
          </Link>

          <p className="mt-10 text-sm font-black uppercase tracking-[0.22em] text-violet-300">
            Nuevo hogar
          </p>
          <h1 className="mt-3 text-4xl font-black">Crear cuenta</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            Configura tu hogar para empezar a controlar compras, consumo y ahorro.
          </p>

          <form className="mt-8 space-y-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-bold text-white/80">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Tu nombre"
                className="w-full rounded-2xl border border-white/10 bg-white px-4 py-4 text-slate-950 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-400/20"
              />
            </div>

            <div>
              <label htmlFor="home-name" className="mb-2 block text-sm font-bold text-white/80">
                Nombre del hogar
              </label>
              <input
                id="home-name"
                name="homeName"
                type="text"
                required
                placeholder="Casa Muñoz"
                className="w-full rounded-2xl border border-white/10 bg-white px-4 py-4 text-slate-950 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-400/20"
              />
            </div>

            <div>
              <label
                htmlFor="register-email"
                className="mb-2 block text-sm font-bold text-white/80"
              >
                Correo electrónico
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="tu@correo.com"
                className="w-full rounded-2xl border border-white/10 bg-white px-4 py-4 text-slate-950 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-400/20"
              />
            </div>

            <div>
              <label
                htmlFor="register-password"
                className="mb-2 block text-sm font-bold text-white/80"
              >
                Contraseña
              </label>
              <input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Crea una contraseña"
                className="w-full rounded-2xl border border-white/10 bg-white px-4 py-4 text-slate-950 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-400/20"
              />
            </div>

            <Link
              href="/dashboard"
              className="block w-full rounded-2xl bg-violet-500 py-4 text-center font-black text-white shadow-xl shadow-violet-950/30 hover:bg-violet-400"
            >
              Crear hogar
            </Link>
          </form>

          <p className="mt-7 text-center text-sm text-white/60">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-black text-violet-300 hover:text-violet-200">
              Inicia sesión
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
