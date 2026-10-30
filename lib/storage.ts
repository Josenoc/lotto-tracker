"use client";

import { useCallback, useEffect, useState } from "react";
import { Draw, Ticket } from "./types";

const TICKETS_KEY = "lotto:tickets";
const DRAWS_KEY = "lotto:draws";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTickets(read<Ticket[]>(TICKETS_KEY, []));
    setLoaded(true);
  }, []);

  const persist = useCallback((next: Ticket[]) => {
    setTickets(next);
    write(TICKETS_KEY, next);
  }, []);

  const add = useCallback(
    (t: Omit<Ticket, "id" | "createdAt">) => {
      const ticket: Ticket = {
        ...t,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      persist([ticket, ...tickets]);
      return ticket;
    },
    [tickets, persist]
  );

  const remove = useCallback(
    (id: string) => {
      persist(tickets.filter((t) => t.id !== id));
    },
    [tickets, persist]
  );

  return { tickets, loaded, add, remove, set: persist };
}

export function useDraws() {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setDraws(read<Draw[]>(DRAWS_KEY, []));
    setLoaded(true);
  }, []);

  const persist = useCallback((next: Draw[]) => {
    setDraws(next);
    write(DRAWS_KEY, next);
  }, []);

  const add = useCallback(
    (d: Omit<Draw, "id" | "createdAt">) => {
      const draw: Draw = {
        ...d,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      persist([draw, ...draws]);
      return draw;
    },
    [draws, persist]
  );

  const remove = useCallback(
    (id: string) => {
      persist(draws.filter((d) => d.id !== id));
    },
    [draws, persist]
  );

  return { draws, loaded, add, remove, set: persist };
}