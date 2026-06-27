import Link from "next/link";
import SectionHeader from "@/components/dashboard/SectionHeader";
import { assistantPrompts } from "@/lib/dashboard-utils";
import { formatCurrency } from "@/lib/mock-home";

export default function AssistantView({ selectedPromptId }: { selectedPromptId?: string }) {
  const selectedPrompt =
    assistantPrompts.find((prompt) => prompt.id === selectedPromptId) ??
    assistantPrompts[0];

  return (
    <>
      <SectionHeader
        eyebrow="Asistente IA"
        title="Consulta tu hogar"
        description="Primer borrador de la experiencia conversacional. Luego conectaremos lenguaje natural real."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="space-y-4">
            <div className="max-w-md rounded-3xl bg-white p-4 text-slate-950">
              <p className="text-sm font-bold">¡Hola! ¿En qué puedo ayudarte hoy?</p>
            </div>
            <div className="ml-auto max-w-md rounded-3xl bg-violet-500 p-4">
              <p className="text-sm font-bold">Compré 2 leches y un detergente</p>
            </div>
            <div className="max-w-md rounded-3xl bg-white p-4 text-slate-950">
              <p className="text-sm font-bold">
                Listo. Registré la compra por {formatCurrency(7990)} y actualicé el inventario.
              </p>
            </div>
            {selectedPrompt ? (
              <>
                <div className="ml-auto max-w-md rounded-3xl bg-violet-500 p-4">
                  <p className="text-sm font-bold">{selectedPrompt.question}</p>
                </div>
                <div className="max-w-md rounded-3xl bg-white p-4 text-slate-950">
                  <p className="text-sm font-bold">{selectedPrompt.answer}</p>
                </div>
              </>
            ) : null}
          </div>
          <div className="mt-8 rounded-2xl bg-white px-4 py-4 text-sm text-slate-400">
            Escribe un mensaje...
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black">Sugerencias rápidas</h2>
          <div className="mt-5 space-y-3">
            {assistantPrompts.map((prompt) => (
              <Link
                key={prompt.id}
                href={`/dashboard?view=asistente&prompt=${prompt.id}`}
                className={`block w-full rounded-2xl p-4 text-left text-sm font-bold transition ${
                  prompt.id === selectedPrompt?.id
                    ? "bg-violet-500 text-white"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                {prompt.question}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
