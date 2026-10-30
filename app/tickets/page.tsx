"use client";

import { useState } from "react";
import { useTickets } from "@/lib/storage";
import { MAIN_COUNT } from "@/lib/types";
import NumberPicker from "@/components/NumberPicker";

export default function TicketsPage() {
  const { tickets, loaded, add, remove } = useTickets();
  const [name, setName] = useState("");
  const [numbers, setNumbers] = useState<number[]>([]);
  const [error, setError] = useState("");

  if (!loaded) return <p className="text-zinc-500">Cargando…</p>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Introduce un nombre para el boleto.");
      return;
    }
    if (numbers.length !== MAIN_COUNT) {
      setError(`Selecciona exactamente ${MAIN_COUNT} números.`);
      return;
    }
    add({ name: name.trim(), numbers });
    setName("");
    setNumbers([]);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      <h1 className="text-2xl font-bold">Boletos</h1>

      <form
        onSubmit={submit}
        className="space-y-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
      >
        <div>
          <label className="mb-1 block text-sm font-medium">Nombre del boleto</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ej. Mi boleto de la suerte"
            className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
          />
        </div>
        <NumberPicker value={numbers} onChange={setNumbers} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Añadir boleto
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="font-semibold">Tus boletos ({tickets.length})</h2>
        {tickets.length === 0 && (
          <p className="text-sm text-zinc-500">Aún no hay boletos.</p>
        )}
        {tickets.map((t) => (
          <div
            key={t.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
          >
            <div>
              <div className="font-medium">{t.name}</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {t.numbers.map((n) => (
                  <span
                    key={n}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
                  >
                    {n}
                  </span>
                ))}
              </div>
              <div className="mt-1 text-xs text-zinc-500">
                Añadido {new Date(t.createdAt).toLocaleString()}
              </div>
            </div>
            <button
              onClick={() => remove(t.id)}
              className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}