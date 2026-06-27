import AssistantMessageBubble from "@/components/dashboard/assistant/AssistantMessageBubble";
import type { AssistantMessage } from "@/types/domain";

type AssistantChatProps = {
  messages: AssistantMessage[];
  isLoaded: boolean;
};

export default function AssistantChat({ messages, isLoaded }: AssistantChatProps) {
  return (
    <div className="space-y-4">
      {!isLoaded ? (
        <div className="max-w-md rounded-3xl bg-white p-4 text-slate-950">
          <p className="text-sm font-bold">Cargando contexto del hogar...</p>
        </div>
      ) : (
        messages.map((message) => (
          <AssistantMessageBubble key={message.id} message={message} />
        ))
      )}
    </div>
  );
}
