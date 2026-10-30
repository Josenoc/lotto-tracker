"use client";

import { useTickets } from "@/lib/storage";
import { useDraws } from "@/lib/storage";
import { checkTicket } from "@/lib/match";
import Link from "next/link";

export default function Dashboard() {
  const { tickets, loaded: tLoaded } = useTickets();
  const { draws, loaded: dLoaded } = useDraws();

  if (!tLoaded || !dLoaded) {
    return <p className="text-zinc-500">Cargando…</p>;
  }

  let best = 0;
  let bestPair: { ticket: string; draw: string } | null = null;
  for (const t of tickets) {
    for (const d of draws) {
      const r = checkTicket(t, d);
      if (r.matchedCount > best) {
        best = r.matchedCount;
        bestPair = { ticket: t.name, draw: d.date };
      }
    }
  }

  const totalMatches = tickets.reduce((acc, t) => {
    return (
      acc +
      draws.reduce((a, d) => a + checkTicket(t, d).matchedCount, 0)
    );
  }, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Inicio</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Boletos" value={tickets.length} />
        <Stat label="Sorteos registrados" value={draws.length} />
        <Stat label="Mejor acierto" value={best > 0 ? `${best} números` : "—"} />
      </div>

      {bestPair && (
        <p className="text-sm text-zinc-500">
          Mejor acierto: <strong>{bestPair.ticket}</strong> vs sorteo del{" "}
          {bestPair.draw}
        </p>
      )}

      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="mb-2 font-semibold">Acciones rápidas</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/tickets"
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-500"
          >
            Añadir boleto
          </Link>
          <Link
            href="/draws"
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-500"
          >
            Registrar sorteo
          </Link>
          <Link
            href="/check"
            className="rounded-md bg-zinc-200 px-3 py-1.5 text-sm text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-200"
          >
            Verificar boleto
          </Link>
        </div>
      </div>

      {tickets.length === 0 && draws.length === 0 && (
        <p className="text-sm text-zinc-500">
          Empieza añadiendo un boleto y registrando un sorteo.
        </p>
      )}

      {totalMatches > 0 && (
        <p className="text-sm text-zinc-500">
          Total de números acertados en todos los pares: {totalMatches}
        </p>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}