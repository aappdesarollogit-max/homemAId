import Link from "next/link";

function BrandPanel() {
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

      <div className="mt-12 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-black text-violet-600">Resumen de tu hogar</p>
        <div className="mt-5 rounded-3xl bg-emerald-100 p-5">
          <p className="text-xs font-bold text-emerald-700">Estado del hogar</p>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <p className="text-2xl font-black text-emerald-700">Todo en orden</p>
              <p className="text-xs text-emerald-700">Excelente trabajo</p>
            </div>
            <span className="text-4xl">🙂</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-violet-50 p-4">
            <p className="text-[10px] font-bold text-slate-500">Productos</p>
            <p className="mt-1 text-xl font-black">126</p>
          </div>
          <div className="rounded-2xl bg-orange-50 p-4">
            <p className="text-[10px] font-bold text-slate-500">Por agotarse</p>
            <p className="mt-1 text-xl font-black">8</p>
          </div>
        </div>
      </div>

      <p className="mt-8 text-3xl font-black leading-tight">
        Organiza compras, consumo y ahorro desde una sola app.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        HomeMaid aprende los hábitos de tu hogar para ayudarte a tomar mejores
        decisiones cada semana.
      </p>
    </aside>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#060814] px-6 py-10 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-10 lg:grid-cols-[1fr_440px] lg:items-center">
        <BrandPanel />

        <section className="w-full rounded-[32px] border border-white/10 bg-white/[0.06] p-8 shadow-2xl backdrop-blur">
          <Link href="/" className="text-sm font-bold text-violet-300 hover:text-violet-200">
            ← Volver al inicio
          </Link>

          <p className="mt-10 text-sm font-black uppercase tracking-[0.22em] text-violet-300">
            Bienvenido de vuelta
          </p>
          <h1 className="mt-3 text-4xl font-black">Iniciar sesión</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            Ingresa a HomeMaid para administrar inventario, compras y ahorro de
            tu hogar.
          </p>

          <form className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-bold text-white/80">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="tu@correo.com"
                className="w-full rounded-2xl border border-white/10 bg-white px-4 py-4 text-slate-950 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-400/20"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-bold text-white/80">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Tu contraseña"
                className="w-full rounded-2xl border border-white/10 bg-white px-4 py-4 text-slate-950 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-400/20"
              />
            </div>

            <Link
              href="/dashboard"
              className="block w-full rounded-2xl bg-violet-500 py-4 text-center font-black text-white shadow-xl shadow-violet-950/30 hover:bg-violet-400"
            >
              Ingresar
            </Link>
          </form>

          <p className="mt-7 text-center text-sm text-white/60">
            ¿No tienes cuenta?{" "}
            <Link href="/registro" className="font-black text-violet-300 hover:text-violet-200">
              Crea tu hogar
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
