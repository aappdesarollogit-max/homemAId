import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="bg-slate-900 p-10 rounded-3xl border border-slate-800 w-full max-w-md">
        <Link href="/" className="text-sm text-orange-400 hover:text-orange-300">
          ← Volver al inicio
        </Link>

        <h1 className="text-3xl font-bold mt-6 mb-6">
          Iniciar sesión
        </h1>

        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full mb-4 p-3 rounded-xl bg-slate-800 border border-slate-700"
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mb-6 p-3 rounded-xl bg-slate-800 border border-slate-700"
        />

<Link
  href="/dashboard"
  className="block w-full bg-orange-500 py-3 rounded-xl font-semibold text-center">
  Ingresar
         </Link>

        <p className="text-sm text-slate-400 mt-6 text-center">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="text-orange-400 hover:text-orange-300">
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  );
}