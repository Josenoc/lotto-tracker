"use client";

import { useState } from "react";
import { useTickets } from "@/lib/storage";
import { useDraws } from "@/lib/storage";
import { checkTicket, prizeForTier } from "@/lib/match";

export default function CheckPage() {
  const { tickets, loaded: tLoaded } = useTickets();
  const { draws, loaded: dLoaded } = useDraws();
  const [ticketId, setTicketId] = useState("");
  const [drawId, setDrawId] = useState("");

  if (!tLoaded || !dLoaded) return <p className="text-zinc-500">Cargando…</p>;

  const ticket = tickets.find((t) => t.id === ticketId);
  const draw = draws.find((d) => d.id === drawId);
  const result = ticket && draw ? checkTicket(ticket, draw) : null;

  const latestDraw = draws[0];
  const allResults =
    latestDraw && tickets.length > 0
      ? tickets.map((t) => ({ ticket: t, result: checkTicket(t, latestDraw) }))
      : [];

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      <h1 className="text-2xl font-bold">Verificador</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Boleto</label>
          <select
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
          >
            <option value="">Selecciona un boleto…</option>
            {tickets.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Sorteo</label>
          <select
            value={drawId}
            onChange={(e) => setDrawId(e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
          >
            <option value="">Selecciona un sorteo…</option>
            {draws.map((d) => (
              <option key={d.id} value={d.id}>
                {d.date}
              </option>
            ))}
          </select>
        </div>
      </div>

      {result && ticket && draw && (
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <h2 className="font-semibold">
            {ticket.name} vs {draw.date}
          </h2>
          <div className="mt-3 flex flex-wrap gap-1">
            {ticket.numbers.map((n) => {
              const hit = draw.numbers.includes(n);
              const bonusHit = draw.bonus != null && draw.bonus === n;
              return (
                <span
                  key={n}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    hit
                      ? "bg-emerald-500 text-white"
                      : bonusHit
                      ? "bg-amber-500 text-white"
                      : "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200"
                  }`}
                >
                  {n}
                </span>
              );
            })}
          </div>
          <div className="mt-3 text-sm">
            <p>
              Acertados: <strong>{result.matchedCount}</strong> de{" "}
              {ticket.numbers.length}
            </p>
            {result.bonusMatched && (
              <p className="text-amber-600">¡Número de bono acertado!</p>
            )}
            <p>
              Categoría: <strong>{result.tier}</strong> · Premio:{" "}
              {prizeForTier(result.tier)}
            </p>
          </div>
        </div>
      )}

      {allResults.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold">
            Todos los boletos vs último sorteo ({latestDraw.date})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="py-2 text-left">Boleto</th>
                  <th className="py-2 text-left">Acertados</th>
                  <th className="py-2 text-left">Categoría</th>
                </tr>
              </thead>
              <tbody>
                {allResults
                  .slice()
                  .sort((a, b) => b.result.matchedCount - a.result.matchedCount)
                  .map(({ ticket: t, result: r }) => (
                    <tr
                      key={t.id}
                      className="border-b border-zinc-100 dark:border-zinc-900"
                    >
                      <td className="py-2">{t.name}</td>
                      <td className="py-2">{r.matchedCount}</td>
                      <td className="py-2">{r.tier}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tickets.length === 0 && (
        <p className="text-sm text-zinc-500">Añade boletos primero.</p>
      )}
      {draws.length === 0 && (
        <p className="text-sm text-zinc-500">Registra un sorteo primero.</p>
      )}
    </div>
  );
}