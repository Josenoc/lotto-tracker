"use client";

import { useEffect, useState } from "react";
import { useDraws } from "@/lib/storage";
import { MAIN_COUNT, NUMBER_MAX } from "@/lib/types";
import NumberPicker from "@/components/NumberPicker";

export default function DrawsPage() {
  const { draws, loaded, add, remove } = useDraws();
  const [date, setDate] = useState("");
  const [numbers, setNumbers] = useState<number[]>([]);
  const [bonus, setBonus] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!date) setDate(new Date().toISOString().slice(0, 10));
  }, [date]);

  if (!loaded) return <p className="text-zinc-500">Cargando…</p>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (numbers.length !== MAIN_COUNT) {
      setError(`Selecciona exactamente ${MAIN_COUNT} números.`);
      return;
    }
    if (bonus != null && numbers.includes(bonus)) {
      setError("El número de bono debe ser distinto de los principales.");
      return;
    }
    add({ date, numbers, bonus });
    setNumbers([]);
    setBonus(null);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      <h1 className="text-2xl font-bold">Sorteos</h1>

      <form
        onSubmit={submit}
        className="space-y-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
      >
        <div>
          <label className="mb-1 block text-sm font-medium">Fecha del sorteo</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
          />
        </div>
        <NumberPicker value={numbers} onChange={setNumbers} />
        <div>
          <label className="mb-1 block text-sm font-medium">
            Número de bono (opcional)
          </label>
          <select
            value={bonus ?? ""}
            onChange={(e) =>
              setBonus(e.target.value === "" ? null : Number(e.target.value))
            }
            className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
          >
            <option value="">Ninguno</option>
            {Array.from({ length: NUMBER_MAX }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n} disabled={numbers.includes(n)}>
                {n}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Registrar sorteo
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="font-semibold">Historial de sorteos ({draws.length})</h2>
        {draws.length === 0 && (
          <p className="text-sm text-zinc-500">Aún no hay sorteos registrados.</p>
        )}
        {draws.map((d) => (
          <div
            key={d.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
          >
            <div>
              <div className="font-medium">{d.date}</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {d.numbers.map((n) => (
                  <span
                    key={n}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200"
                  >
                    {n}
                  </span>
                ))}
                {d.bonus != null && (
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-700 dark:bg-amber-900 dark:text-amber-200">
                    {d.bonus}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => remove(d.id)}
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