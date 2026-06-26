import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import api from "../libs/axios";

export type ContentType = "image" | "video" | "article" | "audio";

export interface Content {
  _id: string;
  title: string;
  link: string;
  type: ContentType;
}

interface ContentContextType {
  cards: Content[];
  loading: boolean;
  filter: ContentType | "all";
  setFilter: (f: ContentType | "all") => void;
  addCard: (card: Content) => void;
  deleteCard: (id: string) => void;
  refresh: () => void;
  search : string;
  setSearch: (s: string) => void;
}

export const ContentContext = createContext<ContentContextType | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<Content[]>([]);
  const [filter, setFilter] = useState<ContentType | "all">("all");
  const[loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  function fetchCards(q?:string) {
    setLoading(true)
    api.get("/user/content",{params: q ? {q} : {}})
    .then((res) => setCards(res.data.content ?? []))
    .finally(() => setLoading(false));
  }

  useEffect(() => {
  const timer = setTimeout(() => fetchCards(search), 600);
  return () => clearTimeout(timer);
}, [search]);

  function addCard(card: Content) {
    setCards((prev) => [card, ...prev]);
  }

  function deleteCard(id: string) {
    setCards((prev) => prev.filter((c) => c._id !== id));
  }

  return (
    <ContentContext.Provider value={{ cards,loading, filter, setFilter, addCard, deleteCard, refresh: fetchCards,search,setSearch }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside ContentProvider");
  return ctx;
}