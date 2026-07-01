import { createContext, useContext, useState, type ReactNode } from "react";
import api from "../libs/axios";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AskContextType {
  messages: Message[];
  loading: boolean;
  ask: (question: string) => Promise<void>;
  clear: () => void;
}

const AskContext = createContext<AskContextType | null>(null);

export function AskProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  async function ask(question: string) {
    if (!question.trim()) return;

    const userMessage: Message = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await api.post("/chat/", {
        question,
        history: messages, // send prior conversation
      });
      const assistantMessage: Message = { role: "assistant", content: res.data.answer };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (e: any) {
      const errMsg = e.response?.data?.message ?? "Something went wrong.";
      setMessages((prev) => [...prev, { role: "assistant", content: errMsg }]);
    } finally {
      setLoading(false);
    }
  }

  function clear() {
    setMessages([]);
  }

  return (
    <AskContext.Provider value={{ messages, loading, ask, clear }}>
      {children}
    </AskContext.Provider>
  );
}

export function useAsk() {
  const ctx = useContext(AskContext);
  if (!ctx) throw new Error("useAsk must be used inside AskProvider");
  return ctx;
}