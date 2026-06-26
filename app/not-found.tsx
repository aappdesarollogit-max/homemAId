import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#060814] px-6 py-12 text-white">
      <section className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl backdrop-blur">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-400 to-fuchsia-500 text-3xl shadow-lg shadow-violet-900/40">
          ⌂
        </div>
        <p className="mt-8 text-sm font-black uppercase tracking-[0.24em] text-violet-300">
          Página no encontrada
        </p>
        <h1 className="mt-4 text-4xl font-black md:text-5xl">
          Este rincón del hogar aún no existe.
        </h1>
        <p className="mx-auto mt-4 max-w-lg leading-relaxed text-white/65">
          Puedes volver al inicio o entrar al dashboard para seguir administrando
          inventario, compras y ahorro familiar.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-2xl bg-violet-500 px-6 py-3 text-center font-black text-white hover:bg-violet-400"
          >
            Volver al inicio
          </Link>
          <Link
            href="/dashboard"
            className="rounded-2xl border border-white/15 px-6 py-3 text-center font-black text-white hover:border-violet-300"
          >
            Ir al dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
