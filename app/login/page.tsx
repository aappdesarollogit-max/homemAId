import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">
        <Link href="/" className="text-sm text-orange-400 hover:text-orange-300">
          ← Volver al inicio
        </Link>

        <h1 className="mt-8 text-3xl font-bold">Iniciar sesión</h1>
        <p className="mt-2 text-sm text-slate-400">
          Ingresa a HomeMaid para administrar tu hogar.
        </p>

        <form className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-slate-300">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="tu@correo.com"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm text-slate-300">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Tu contraseña"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-400"
            />
          </div>

          <Link
            href="/dashboard"
            className="block w-full rounded-xl bg-orange-500 py-3 text-center font-semibold text-white hover:bg-orange-400"
          >
            Ingresar
          </Link>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="text-orange-400 hover:text-orange-300">
            Regístrate
          </Link>
        </p>
      </section>
    </main>
  );
}
