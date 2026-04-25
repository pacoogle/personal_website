"use client";

import { visibleWhenQuery } from "@/lib/cv";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type Ctx = {
  query: string;
  setQuery: (q: string) => void;
  unrolled: boolean;
  setUnrolled: (v: boolean) => void;
};

const CommandQueryContext = createContext<Ctx | null>(null);

export function CommandQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [unrolled, setUnrolled] = useState(false);

  const value = useMemo(
    () => ({ query, setQuery, unrolled, setUnrolled }),
    [query, unrolled]
  );

  return (
    <CommandQueryContext.Provider value={value}>
      {children}
    </CommandQueryContext.Provider>
  );
}

export function useCommandQuery() {
  const ctx = useContext(CommandQueryContext);
  if (!ctx) {
    throw new Error(
      "useCommandQuery va usato dentro CommandQueryProvider"
    );
  }
  return ctx;
}

export function useMatchQuery() {
  const { query } = useCommandQuery();
  return useCallback(
    (hay: string) => visibleWhenQuery(query, hay),
    [query]
  );
}
