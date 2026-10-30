export type Sorteo = {
  id: number;
  fecha: string;
  juego: string;
  numeros: number[];
};

export const SORTEOS: Sorteo[] = [
  { id: 1, fecha: "2026-03-01", juego: "quini6", numeros: [5, 12, 18, 24, 31, 44] },
  { id: 2, fecha: "2026-03-08", juego: "quini6", numeros: [2, 5, 18, 22, 31, 40] },
  { id: 3, fecha: "2026-03-15", juego: "quini6", numeros: [0, 5, 18, 24, 31, 37] },
];

export const TOTAL_NUMEROS = 46;

export function sorteosDe(juego: string): Sorteo[] {
  return SORTEOS.filter((s) => s.juego === juego).sort((a, b) =>
    a.fecha < b.fecha ? 1 : -1
  );
}

export function frecuencia(juego: string): number[] {
  const counts = Array(TOTAL_NUMEROS).fill(0);
  for (const s of sorteosDe(juego)) {
    for (const n of s.numeros) {
      if (n >= 0 && n < TOTAL_NUMEROS) counts[n]++;
    }
  }
  return counts;
}

export function ultimoSorteo(juego: string): Sorteo | undefined {
  return sorteosDe(juego)[0];
}

export function estadoNumero(juego: string, num: number): string {
  const draws = sorteosDe(juego);
  if (draws.length === 0) return "Sin datos";
  const counts = frecuencia(juego);
  const c = counts[num];
  if (c === 0) return "Frío";
  const last = draws.find((s) => s.numeros.includes(num));
  if (last && last.fecha === draws[0].fecha) return "Caliente";
  return "Atrasado";
}

export function sugerir(juego: string, estrategia: string): number[] {
  const draws = sorteosDe(juego);
  if (draws.length === 0) return [];
  const counts = frecuencia(juego);
  const indexed = counts.map((c, n) => ({ n, c }));
  const byCountDesc = [...indexed].sort((a, b) => b.c - a.c || a.n - b.n);
  const byCountAsc = [...indexed].sort((a, b) => a.c - b.c || a.n - b.n);
  const lastDate = draws[0].fecha;
  const atrasados = [...indexed]
    .filter((x) => !draws[0].numeros.includes(x.n))
    .sort((a, b) => a.c - b.c || a.n - b.n);

  let chosen: number[] = [];
  switch (estrategia) {
    case "Más calientes":
      chosen = byCountDesc.slice(0, 6).map((x) => x.n);
      break;
    case "Más fríos":
      chosen = byCountAsc.slice(0, 6).map((x) => x.n);
      break;
    case "Más atrasados":
      chosen = (atrasados.length >= 6 ? atrasados : byCountAsc)
        .slice(0, 6)
        .map((x) => x.n);
      break;
    default: {
      const hot = byCountDesc.slice(0, 3).map((x) => x.n);
      const delayed = atrasados.slice(0, 2).map((x) => x.n);
      const cold = byCountAsc.slice(0, 1).map((x) => x.n);
      chosen = [...hot, ...delayed, ...cold];
      break;
    }
  }
  return [...new Set(chosen)].slice(0, 6).sort((a, b) => a - b);
}

export function colorEstado(estado: string): string {
  switch (estado) {
    case "Caliente":
      return "bg-[#B4470C]";
    case "Frío":
      return "bg-[#1D5FA8]";
    case "Atrasado":
      return "bg-[#0F7B5F]";
    default:
      return "bg-neutral-700";
  }
}