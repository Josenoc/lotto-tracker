export type Sorteo = {
  id: number;
  fecha: string;
  juego: string;
  edicion?: string;
  numeros: number[];
};

export type JuegoConfig = {
  nombre: string;
  total: number;
  count: number;
};

export const JUEGOS: Record<string, JuegoConfig> = {
  quiniela_mendoza: { nombre: "Quiniela Mendoza", total: 100, count: 5 },
  quiniela_nacional: { nombre: "Quiniela Nacional", total: 100, count: 5 },
  quini6: { nombre: "Quini 6", total: 46, count: 6 },
  telekino: { nombre: "Telekino", total: 25, count: 10 },
};

export const SORTEOS: Sorteo[] = [
  { id: 1, fecha: "2026-10-23", juego: "quiniela_mendoza", edicion: "Matutina", numeros: [45, 12, 88, 3, 19] },
  { id: 2, fecha: "2026-10-23", juego: "quiniela_nacional", edicion: "Nocturna", numeros: [7, 34, 52, 91, 14] },
  { id: 3, fecha: "2026-10-20", juego: "quini6", edicion: "Tradicional", numeros: [5, 12, 18, 24, 31, 44] },
];

export function configJuego(juego: string): JuegoConfig {
  return JUEGOS[juego] ?? { nombre: juego, total: 46, count: 6 };
}

export function totalNumeros(juego: string): number {
  return configJuego(juego).total;
}

export function countNumeros(juego: string): number {
  return configJuego(juego).count;
}

export function sorteosDe(juego: string, draws: Sorteo[] = SORTEOS): Sorteo[] {
  return draws.filter((s) => s.juego === juego).sort((a, b) =>
    a.fecha < b.fecha ? 1 : -1
  );
}

export function frecuencia(juego: string, draws: Sorteo[] = SORTEOS): number[] {
  const total = totalNumeros(juego);
  const counts = Array(total).fill(0);
  for (const s of sorteosDe(juego, draws)) {
    for (const n of s.numeros) {
      if (n >= 0 && n < total) counts[n]++;
    }
  }
  return counts;
}

export function ultimoSorteo(juego: string, draws: Sorteo[] = SORTEOS): Sorteo | undefined {
  return sorteosDe(juego, draws)[0];
}

export function estadoNumero(juego: string, num: number, draws: Sorteo[] = SORTEOS): string {
  const sorted = sorteosDe(juego, draws);
  if (sorted.length === 0) return "Sin datos";
  const counts = frecuencia(juego, draws);
  const c = counts[num] ?? 0;
  if (c === 0) return "Frío";
  const last = sorted.find((s) => s.numeros.includes(num));
  if (last && last.fecha === sorted[0].fecha) return "Caliente";
  return "Atrasado";
}

export function sugerir(juego: string, estrategia: string, draws: Sorteo[] = SORTEOS): number[] {
  const sorted = sorteosDe(juego, draws);
  if (sorted.length === 0) return [];
  const count = countNumeros(juego);
  const counts = frecuencia(juego, draws);
  const total = totalNumeros(juego);
  const indexed = Array.from({ length: total }, (_, n) => ({ n, c: counts[n] ?? 0 }));
  const byCountDesc = [...indexed].sort((a, b) => b.c - a.c || a.n - b.n);
  const byCountAsc = [...indexed].sort((a, b) => a.c - b.c || a.n - b.n);
  const atrasados = [...indexed]
    .filter((x) => !(sorted[0].numeros || []).includes(x.n))
    .sort((a, b) => a.c - b.c || a.n - b.n);

  let chosen: number[] = [];
  switch (estrategia) {
    case "Más calientes":
      chosen = byCountDesc.slice(0, count).map((x) => x.n);
      break;
    case "Más fríos":
      chosen = byCountAsc.slice(0, count).map((x) => x.n);
      break;
    case "Más atrasados":
      chosen = (atrasados.length >= count ? atrasados : byCountAsc)
        .slice(0, count)
        .map((x) => x.n);
      break;
    default: {
      const hotN = Math.ceil(count / 2);
      const delayedN = Math.floor(count / 3);
      const coldN = count - hotN - delayedN;
      const hot = byCountDesc.slice(0, hotN).map((x) => x.n);
      const delayed = atrasados.slice(0, delayedN).map((x) => x.n);
      const cold = byCountAsc.slice(0, coldN).map((x) => x.n);
      chosen = [...hot, ...delayed, ...cold];
      break;
    }
  }
  return [...new Set(chosen)].slice(0, count).sort((a, b) => a - b);
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