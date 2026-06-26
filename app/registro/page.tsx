import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10 text-white">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">
        <Link href="/" className="text-sm text-orange-400 hover:text-orange-300">
          ← Volver al inicio
        </Link>

        <h1 className="mt-8 text-3xl font-bold">Crear cuenta</h1>
        <p className="mt-2 text-sm text-slate-400">
          Configura tu hogar para empezar a controlar compras, consumo y ahorro.
        </p>

        <form className="mt-8 space-y-4">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm text-slate-300">
              Nombre
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Tu nombre"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-400"
            />
          </div>

          <div>
            <label htmlFor="home-name" className="mb-2 block text-sm text-slate-300">
              Nombre del hogar
            </label>
            <input
              id="home-name"
              name="homeName"
              type="text"
              required
              placeholder="Casa Muñoz"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-400"
            />
          </div>

          <div>
            <label
              htmlFor="register-email"
              className="mb-2 block text-sm text-slate-300"
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
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-400"
            />
          </div>

          <div>
            <label
              htmlFor="register-password"
              className="mb-2 block text-sm text-slate-300"
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
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-400"
            />
          </div>

          <Link
            href="/dashboard"
            className="block w-full rounded-xl bg-orange-500 py-3 text-center font-semibold text-white hover:bg-orange-400"
          >
            Crear cuenta
          </Link>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-orange-400 hover:text-orange-300">
            Inicia sesión
          </Link>
        </p>
      </section>
    </main>
  );
}
