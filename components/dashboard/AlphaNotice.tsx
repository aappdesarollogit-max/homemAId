export default function AlphaNotice({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm font-bold leading-relaxed text-amber-50 ${className}`}
    >
      Version Alpha: esta app esta en prueba. Tus comentarios ayudan a mejorarla.
    </div>
  );
}
