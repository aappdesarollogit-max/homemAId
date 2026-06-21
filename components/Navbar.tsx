import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center font-bold">
            H
          </div>

          <span className="font-bold text-xl">
            HomeMade IA
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
          <a href="#funciones" className="hover:text-orange-400 transition">
            Funciones
          </a>

          <a href="#como-funciona" className="hover:text-orange-400 transition">
            Cómo funciona
          </a>

          <a href="#panel" className="hover:text-orange-400 transition">
            Panel
          </a>
        </div>

        <Link
          href="/login"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-xl transition"
        >
          Iniciar
        </Link>
      </nav>
    </header>
  );
}