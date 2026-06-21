export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6">
      <section className="max-w-md text-center">
        <h1 className="text-4xl font-bold mb-4">
          HomeMade
        </h1>

        <p className="text-slate-300 mb-8">
          Tu app para conectar personas con comida casera, pedidos simples y experiencias cercanas.
        </p>

        <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl">
          Comenzar
        </button>
      </section>
    </main>
  );
}