"use client";

import { useEffect, useRef } from "react";
import AssistantMessageBubble from "@/components/dashboard/assistant/AssistantMessageBubble";
import type { AssistantMessage } from "@/types/domain";

type AssistantChatProps = {
  messages: AssistantMessage[];
  isLoaded: boolean;
};

export default function AssistantChat({ messages, isLoaded }: AssistantChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto pr-2">
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
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
