export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="bg-slate-900 p-10 rounded-3xl border border-slate-800 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">
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

        <button className="w-full bg-orange-500 py-3 rounded-xl font-semibold">
          Ingresar
        </button>
      </div>
    </main>
  );
}