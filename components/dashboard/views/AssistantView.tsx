"use client";

import AssistantChat from "@/components/dashboard/assistant/AssistantChat";
import AssistantContextPanel from "@/components/dashboard/assistant/AssistantContextPanel";
import AssistantInput from "@/components/dashboard/assistant/AssistantInput";
import AssistantQuickActions from "@/components/dashboard/assistant/AssistantQuickActions";
import SectionHeader from "@/components/dashboard/SectionHeader";
import { useAssistant } from "@/hooks/useAssistant";

export default function AssistantView({ selectedPromptId }: { selectedPromptId?: string }) {
  const {
    messages,
    inputValue,
    setInputValue,
    sendMessage,
    clearMessages,
    quickActions,
    context,
    isLoaded,
  } = useAssistant(selectedPromptId);

  return (
    <>
      <SectionHeader
        eyebrow="Asistente IA"
        title="Consulta tu hogar"
        description="Asistente local basado en reglas, inventario, compras y consumo guardados en este navegador."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <section className="flex h-[calc(100vh-220px)] min-h-[480px] max-h-[720px] flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <AssistantChat messages={messages} isLoaded={isLoaded} />
          <AssistantInput value={inputValue} onChange={setInputValue} onSend={sendMessage} />
        </section>

        <div className="space-y-6">
          <AssistantQuickActions
            actions={quickActions}
            onSelect={sendMessage}
            onClear={clearMessages}
          />
          <AssistantContextPanel context={context} />
        </div>
      </div>
    </>
  );
}
