"use client";

import { useEffect, useRef } from "react";
import AssistantMessageBubble from "@/components/dashboard/assistant/AssistantMessageBubble";
import type { AssistantMessage } from "@/types/domain";

type AssistantChatProps = {
  messages: AssistantMessage[];
  isLoaded: boolean;
};

export default function AssistantChat({ messages, isLoaded }: AssistantChatProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const visibleMessages = messages.slice(-4);

  useEffect(() => {
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [visibleMessages.length, messages]);

  return (
    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pr-1">
      <div className="space-y-4">
      {!isLoaded ? (
        <div className="max-w-md rounded-3xl bg-white p-4 text-slate-950">
          <p className="text-sm font-bold">Cargando contexto del hogar...</p>
        </div>
      ) : (
        visibleMessages.map((message) => (
          <AssistantMessageBubble key={message.id} message={message} />
        ))
      )}
      </div>
    </div>
  );
}
