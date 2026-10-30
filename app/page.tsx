"use client";
import { useMemo, useState } from "react";
import {
  SORTEOS,
  TOTAL_NUMEROS,
  colorEstado,
  estadoNumero,
  frecuencia,
  sugerir,
} from "@/lib/sorteos";

export default function LotoTrackHome() {
  const [juegoActivo, setJuegoActivo] = useState("quini6");
  const [estrategia, setEstrategia] = useState("Equilibrada");

  const draws = SORTEOS.filter((s) => s.juego === juegoActivo);
  const counts = useMemo(() => frecuencia(juegoActivo), [juegoActivo]);
  const sugeridos = useMemo(
    () => sugerir(juegoActivo, estrategia),
    [juegoActivo, estrategia]
  );

  const combinacionSugerida = sugeridos.map((n) => ({
    num: n < 10 ? `0${n}` : `${n}`,
    estado: estadoNumero(juegoActivo, n),
    color: colorEstado(estadoNumero(juegoActivo, n)),
  }));

  const resumen = useMemo(() => {
    const estados = combinacionSugerida.map((c) => c.estado);
    const calientes = estados.filter((e) => e === "Caliente").length;
    const atrasados = estados.filter((e) => e === "Atrasado").length;
    const frios = estados.filter((e) => e === "Frío").length;
    return `${calientes} calientes • ${atrasados} atrasados • ${frios} fríos`;
  }, [combinacionSugerida]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F4F3EE] p-4 md:p-8 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-800 pb-4 mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-wider text-white flex items-center gap-2">
            <span className="bg-[#0F7B5F] w-3 h-3 rounded-full inline-block"></span>
            LOTO TRACK
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Análisis estadístico del último año • Sin garantía de azar
            {draws.length > 0 && ` • ${draws.length} sorteos`}
          </p>
        </div>

        <div className="flex gap-2 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
          {["quiniela", "quini6", "telekino"].map((j) => (
            <button
              key={j}
              onClick={() => setJuegoActivo(j)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                juegoActivo === j
                  ? "bg-[#F4F3EE] text-black"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {j === "quiniela"
                ? "Quiniela Mendoza"
                : j === "quini6"
                ? "Quini 6"
                : "Telekino"}
            </button>
          ))}
        </div>
      </header>

      {draws.length === 0 && (
        <p className="mb-6 text-sm text-neutral-400">
          No hay datos para este juego todavía.
        </p>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#E0A422] uppercase">
              Combinación Sugerida
            </span>

            <div className="flex flex-wrap gap-3 my-6">
              {combinacionSugerida.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-14 h-14 rounded-full ${item.color} flex items-center justify-center text-white font-black text-lg shadow-md border-2 border-neutral-800`}
                  >
                    {item.num}
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-2 font-medium">
                    {item.estado}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs text-neutral-400 font-medium">{resumen}</p>
          </div>

          <p className="text-[11px] text-neutral-500 mt-6 border-t border-neutral-900 pt-3">
            Cada sorteo es independiente. Loto Track resume el historial del
            último año, no predice el azar ni asegura premios.
          </p>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
          <div>
            <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
              Estrategia
            </span>
            <div className="space-y-2 mt-3">
              {["Equilibrada", "Más calientes", "Más fríos", "Más atrasados"].map(
                (est) => (
                  <button
                    key={est}
                    onClick={() => setEstrategia(est)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      estrategia === est
                        ? "border-[#0F7B5F] bg-[#0F7B5F]/10 text-white"
                        : "border-neutral-800 text-neutral-400 hover:bg-neutral-900"
                    }`}
                  >
                    {est}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setEstrategia((e) => e)}
              className="flex-1 bg-[#F4F3EE] hover:bg-white text-black font-extrabold text-xs py-3 rounded-xl transition-all shadow-md"
            >
              Generar otra
            </button>
            <button className="px-5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 font-bold text-xs py-3 rounded-xl transition-all">
              Guardar
            </button>
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-2">
          Frecuencia por número (Último Año)
        </h3>
        <p className="text-xs text-neutral-400 mb-6">
          Veces que salió cada número. El contorno marca los de tu combinación
          sugerida.
        </p>

        <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-2">
          {Array.from({ length: TOTAL_NUMEROS }, (_, i) => {
            const numStr = i < 10 ? `0${i}` : `${i}`;
            const isSelected = sugeridos.includes(i);
            return (
              <div
                key={i}
                className={`p-2 rounded-lg text-center border transition-all ${
                  isSelected
                    ? "border-[#E0A422] bg-neutral-900 shadow"
                    : "border-neutral-800 bg-neutral-900/50 text-neutral-400"
                }`}
              >
                <span className="block text-xs font-bold text-white">{numStr}</span>
                <span className="block text-[9px] text-neutral-500 mt-0.5">
                  {counts[i]}x
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}