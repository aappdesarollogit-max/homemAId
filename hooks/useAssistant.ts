"use client";

import { useEffect, useState } from "react";
import {
  assistantQuickActions,
  generateAssistantResponse,
  getAssistantContext,
} from "@/lib/services/assistant-service";
import { publishDomainEvent } from "@/core/platform/events/EventBus";
import { readStorageJson, writeStorageJson } from "@/lib/safe-storage";
import type { AssistantContext, AssistantMessage } from "@/types/domain";

const ASSISTANT_HISTORY_KEY = "homemaid.assistant.messages";

function createMessage(role: AssistantMessage["role"], content: string): AssistantMessage {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : String(Date.now() + Math.random());

  return {
    id: `assistant-message-${suffix}`,
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

function getInitialMessages() {
  return readStorageJson<AssistantMessage[]>(ASSISTANT_HISTORY_KEY, [
    createMessage(
      "assistant",
      "Hola. Puedo ayudarte a revisar inventario, compras, gasto mensual y alertas del hogar.",
    ),
  ]);
}

function persistMessages(messages: AssistantMessage[]) {
  writeStorageJson(ASSISTANT_HISTORY_KEY, messages);
}

export function useAssistant(selectedPrompt?: string) {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [context, setContext] = useState<AssistantContext | undefined>();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const initialMessages = getInitialMessages();
      const assistantContext = getAssistantContext();
      const quickAction = assistantQuickActions.find((action) => action.id === selectedPrompt);
      const nextMessages = quickAction
        ? [
            ...initialMessages,
            createMessage("user", quickAction.message),
            createMessage(
              "assistant",
              generateAssistantResponse(quickAction.message, assistantContext),
            ),
          ]
        : initialMessages;

      setMessages(nextMessages);
      setContext(assistantContext);
      setIsLoaded(true);
    });
  }, [selectedPrompt]);

  function sendMessage(message: string) {
    const cleanMessage = message.trim();
    if (!cleanMessage) return;

    const assistantContext = getAssistantContext();
    const userMessage = createMessage("user", cleanMessage);
    const assistantMessage = createMessage(
      "assistant",
      generateAssistantResponse(cleanMessage, assistantContext),
    );
    setContext(assistantContext);
    publishDomainEvent({
      type: "assistant.message.sent",
      source: "assistant",
      payload: {
        messageId: userMessage.id,
        length: cleanMessage.length,
      },
    });
    setMessages((currentMessages) => {
      const nextMessages = [...currentMessages, userMessage, assistantMessage];
      persistMessages(nextMessages);
      return nextMessages;
    });
    setInputValue("");
  }

  function clearMessages() {
    const initialMessages = [
      createMessage(
        "assistant",
        "Chat limpio. Pregúntame por inventario, gasto, compras o alertas del hogar.",
      ),
    ];

    setMessages(initialMessages);
    persistMessages(initialMessages);
  }

  return {
    messages,
    inputValue,
    setInputValue,
    sendMessage,
    clearMessages,
    quickActions: assistantQuickActions,
    context,
    isLoaded,
  };
}
