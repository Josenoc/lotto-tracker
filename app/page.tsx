"use client";
import { useState } from "react";

type Estadisticas = {
  success: boolean;
  totalSorteosEnPeriodo: number;
  frecuencias: Record<string, number>;
};

export default function LotoTrackHome() {
  const [juegoSeleccionado, setJuegoSeleccionado] = useState("quiniela_mendoza");
  const [datosEstadisticos, setDatosEstadisticos] = useState<Estadisticas | null>(null);
  const [cargando, setCargando] = useState(false);

  const cargarDatos = async (juego: string, dias: number) => {
    setCargando(true);
    setJuegoSeleccionado(juego);
    try {
      const res = await fetch(`/api/actualizar?juego=${juego}&dias=${dias}`);
      const data = await res.json();
      if (data.success) {
        setDatosEstadisticos(data);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F4F3EE] p-4 md:p-8 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-800 pb-4 mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-wider text-white flex items-center gap-2">
            <span className="bg-[#0F7B5F] w-3 h-3 rounded-full inline-block"></span>
            LOTO TRACK
          </h1>
          <p className="text-xs text-neutral-400 mt-1">Panel Privado de Análisis Estadístico</p>
        </div>

        <div className="flex flex-wrap gap-2 bg-neutral-900 p-1.5 rounded-xl border border-neutral-800">
          <button
            onClick={() => cargarDatos("quiniela_mendoza", 7)}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
              juegoSeleccionado === "quiniela_mendoza"
                ? "bg-[#F4F3EE] text-black"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Quiniela Mendoza (7 días)
          </button>
          <button
            onClick={() => cargarDatos("quiniela_nacional", 7)}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
              juegoSeleccionado === "quiniela_nacional"
                ? "bg-[#F4F3EE] text-black"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Quiniela Nacional (7 días)
          </button>
          <button
            onClick={() => cargarDatos("quini6", 14)}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
              juegoSeleccionado === "quini6" ? "bg-[#F4F3EE] text-black" : "text-neutral-400 hover:text-white"
            }`}
          >
            Quini 6 (14 días)
          </button>
          <button
            onClick={() => cargarDatos("telekino", 14)}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
              juegoSeleccionado === "telekino"
                ? "bg-[#F4F3EE] text-black"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Telekino (14 días)
          </button>
        </div>
      </header>

      <section className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#E0A422] uppercase">
              Estadísticas del Periodo
            </span>
            <h2 className="text-lg font-extrabold text-white capitalize mt-1">
              {juegoSeleccionado.replace("_", " ")}
            </h2>
          </div>
          <span className="text-xs bg-neutral-900 text-neutral-300 px-3 py-1.5 rounded-lg border border-neutral-800 font-medium">
            {cargando
              ? "Actualizando..."
              : `${datosEstadisticos?.totalSorteosEnPeriodo || 0} sorteos analizados`}
          </span>
        </div>

        <p className="text-xs text-neutral-400 mb-6">
          Mostrando los números ganadores procesados automáticamente para las ediciones del período seleccionado.
        </p>

        <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-2">
          {datosEstadisticos?.frecuencias &&
            Object.entries(datosEstadisticos.frecuencias).map(([num, count], i) => (
              <div
                key={i}
                className="p-3 rounded-xl text-center border border-neutral-800 bg-neutral-900/60 shadow"
              >
                <span className="block text-sm font-black text-white">{num}</span>
                <span className="block text-[10px] text-[#E0A422] mt-0.5 font-semibold">
                  {count} apariciones
                </span>
              </div>
            ))}
        </div>
      </section>
    </main>
  );
}