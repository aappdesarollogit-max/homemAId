import type { AssistantMessage } from "@/types/domain";

type AssistantMessageBubbleProps = {
  message: AssistantMessage;
};

export default function AssistantMessageBubble({ message }: AssistantMessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-md rounded-3xl p-4 ${
          isUser ? "bg-violet-500 text-white" : "bg-white text-slate-950"
        }`}
      >
        <p className="text-sm font-bold leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
}
