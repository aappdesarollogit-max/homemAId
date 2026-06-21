import PrimaryButton from "./PrimaryButton";

export default function Hero() {
  return (
    <section className="max-w-xl text-center">
      <h1 className="text-4xl font-bold mb-4">
        HomeMade
      </h1>

      <p className="text-slate-300 mb-8">
        Tu app para conectar personas con comida casera, pedidos simples y experiencias cercanas.
      </p>

      <PrimaryButton text="Comenzar" />
    </section>
  );
}