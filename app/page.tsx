"use client";
import { useState } from "react";

type Sorteo = { fecha: string; edicion: string; numeros: number[] };
type Item = { num: string; estado: string; color: string };
type ResultadoEscaneo = {
  ticket: string;
  juego: string;
  estadoPremio: string;
  chancesEstadisticas: string;
} | null;

export default function LotoTrackHome() {
  const [autenticado, setAutenticado] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const CLAVE_PRIVADA = "loto2026";

  const [juegoActivo, setJuegoActivo] = useState("quini6");
  const [estrategia, setEstrategia] = useState("Equilibrada");
  const [historialAbierto, setHistorialAbierto] = useState(false);
  const [escannerAbierto, setEscannerAbierto] = useState(false);
  const [resultadoEscaneo, setResultadoEscaneo] = useState<ResultadoEscaneo>(null);

  const historialesPorJuego: Record<string, Sorteo[]> = {
    quiniela: [
      { fecha: "28/10/2026", edicion: "Matutina (Mendoza)", numeros: [12, 45, 88, 3, 19] },
      { fecha: "27/10/2026", edicion: "Nocturna (Mendoza)", numeros: [7, 34, 52, 91, 14] },
    ],
    quini6: [
      { fecha: "25/10/2026", edicion: "Tradicional / Revancha", numeros: [5, 12, 18, 24, 31, 44] },
      { fecha: "18/10/2026", edicion: "Siempre Sale", numeros: [3, 11, 22, 29, 35, 40] },
    ],
    telekino: [
      { fecha: "25/10/2026", edicion: "Sorteo Oficial", numeros: [1, 3, 5, 8, 11, 13, 15, 17, 19, 21, 23, 25, 2, 6, 10] },
    ],
  };

  const calcularJugadaEstadistica = (tipoEstrategia: string, juego: string): Item[] => {
    const sorteos = historialesPorJuego[juego] || historialesPorJuego.quini6;
    const frecuencias: Record<string, number> = {};

    sorteos.forEach((sorteo) => {
      sorteo.numeros.forEach((num) => {
        const numStr = num < 10 ? `0${num}` : `${num}`;
        frecuencias[numStr] = (frecuencias[numStr] || 0) + 1;
      });
    });

    const numerosOrdenados = Object.entries(frecuencias).sort((a, b) => b[1] - a[1]);

    if (numerosOrdenados.length < 6) {
      return [
        { num: "05", estado: tipoEstrategia, color: "bg-[#0F7B5F]" },
        { num: "12", estado: tipoEstrategia, color: "bg-[#B4470C]" },
        { num: "18", estado: tipoEstrategia, color: "bg-[#1D5FA8]" },
        { num: "24", estado: tipoEstrategia, color: "bg-[#0F7B5F]" },
        { num: "31", estado: tipoEstrategia, color: "bg-[#B4470C]" },
        { num: "44", estado: tipoEstrategia, color: "bg-[#1D5FA8]" },
      ];
    }

    let resultadoFinal: Item[] = [];
    if (tipoEstrategia === "Más calientes") {
      resultadoFinal = numerosOrdenados.slice(0, 6).map(([num, count]) => ({
        num,
        estado: `${count}x`,
        color: "bg-[#B4470C]",
      }));
    } else if (tipoEstrategia === "Más fríos") {
      resultadoFinal = [...numerosOrdenados].reverse().slice(0, 6).map(([num, count]) => ({
        num,
        estado: `${count}x`,
        color: "bg-[#1D5FA8]",
      }));
    } else if (tipoEstrategia === "Más atrasados") {
      resultadoFinal = numerosOrdenados.slice(-6).map(([num]) => ({
        num,
        estado: "Atrasado",
        color: "bg-[#0F7B5F]",
      }));
    } else {
      const calientes = numerosOrdenados.slice(0, 3);
      const frios = [...numerosOrdenados].reverse().slice(0, 3);
      resultadoFinal = [
        ...calientes.map(([num]) => ({ num, estado: "Caliente", color: "bg-[#B4470C]" })),
        ...frios.map(([num]) => ({ num, estado: "Frío", color: "bg-[#1D5FA8]" })),
      ];
    }
    return resultadoFinal;
  };

  const [combinacionSugerida, setCombinacionSugerida] = useState<Item[]>(() =>
    calcularJugadaEstadistica("Equilibrada", "quini6")
  );

  const cambiarJuegoYCalcular = (nuevoJuego: string) => {
    setJuegoActivo(nuevoJuego);
    setCombinacionSugerida(calcularJugadaEstadistica(estrategia, nuevoJuego));
  };

  const cambiarEstrategiaYCalcular = (nuevaEstrategia: string) => {
    setEstrategia(nuevaEstrategia);
    setCombinacionSugerida(calcularJugadaEstadistica(nuevaEstrategia, juegoActivo));
  };

  const generarOtraCombinacion = () => {
    setCombinacionSugerida(calcularJugadaEstadistica(estrategia, juegoActivo));
  };

  const simularEscaneoBoleta = () => {
    setResultadoEscaneo(null);
    setTimeout(() => {
      setResultadoEscaneo({
        ticket: "AGENCIA #402 - TICKET #884920",
        juego: juegoActivo.toUpperCase(),
        estadoPremio: "Sin premios registrados en este sorteo (Participa en sorteo adicional por auto 0km).",
        chancesEstadisticas: "Moderadas-Altas (Incluye 2 números calientes del último periodo).",
      });
    }, 1500);
  };

  const verificarClave = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === CLAVE_PRIVADA) {
      setAutenticado(true);
    } else {
      alert("Contraseña incorrecta");
    }
  };

  if (!autenticado) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] text-[#F4F3EE] flex items-center justify-center p-4 font-sans">
        <form
          onSubmit={verificarClave}
          className="bg-neutral-950 border border-neutral-800 p-8 rounded-2xl w-full max-w-sm shadow-xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-[#0F7B5F] w-3 h-3 rounded-full inline-block"></span>
            <h1 className="text-lg font-extrabold text-white tracking-wider">LOTO TRACK</h1>
          </div>
          <p className="text-xs text-neutral-400 mb-4">Acceso privado restringido. Ingresá tu contraseña.</p>
          <input
            type="password"
            placeholder="Contraseña"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm mb-4 focus:outline-none focus:border-[#0F7B5F]"
          />
          <button
            type="submit"
            className="w-full bg-[#0F7B5F] hover:bg-[#0F7B5F]/80 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md"
          >
            Ingresar al Panel
          </button>
        </form>
      </main>
    );
  }

  const frecuencias: Record<string, number> = {};
  const sorteos = historialesPorJuego[juegoActivo] || [];
  sorteos.forEach((sorteo) => {
    sorteo.numeros.forEach((num) => {
      const numStr = num < 10 ? `0${num}` : `${num}`;
      frecuencias[numStr] = (frecuencias[numStr] || 0) + 1;
    });
  });

  const total = juegoActivo === "quiniela" ? 100 : juegoActivo === "telekino" ? 26 : 46;

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F4F3EE] p-4 md:p-8 font-sans relative overflow-x-hidden">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-800 pb-4 mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-wider text-white flex items-center gap-2">
            <span className="bg-[#0F7B5F] w-3 h-3 rounded-full inline-block"></span>
            LOTO TRACK
          </h1>
          <p className="text-xs text-neutral-400 mt-1">Análisis estadístico y escáner de boletas</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-2 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => cambiarJuegoYCalcular("quiniela")}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                juegoActivo === "quiniela" ? "bg-[#F4F3EE] text-black" : "text-neutral-400 hover:text-white"
              }`}
            >
              Quiniela
            </button>
            <button
              onClick={() => cambiarJuegoYCalcular("quini6")}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                juegoActivo === "quini6" ? "bg-[#F4F3EE] text-black" : "text-neutral-400 hover:text-white"
              }`}
            >
              Quini 6
            </button>
            <button
              onClick={() => cambiarJuegoYCalcular("telekino")}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                juegoActivo === "telekino" ? "bg-[#F4F3EE] text-black" : "text-neutral-400 hover:text-white"
              }`}
            >
              Telekino
            </button>
          </div>

          <button
            onClick={() => setEscannerAbierto(true)}
            className="bg-[#0F7B5F] hover:bg-[#0F7B5F]/80 text-white border border-[#0F7B5F] text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow flex items-center gap-2"
          >
            📷 Escanear Boleta
          </button>

          <button
            onClick={() => setHistorialAbierto(true)}
            className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-bold px-4 py-2.5 rounded-xl text-white transition-all shadow flex items-center gap-2"
          >
            📜 Ver Anteriores
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold tracking-widest text-[#E0A422] uppercase">
                Combinación Sugerida ({juegoActivo.toUpperCase()})
              </span>
              <span className="text-[11px] text-neutral-400 bg-neutral-900 px-3 py-1 rounded-lg border border-neutral-800">
                Estrategia: <strong className="text-white">{estrategia}</strong>
              </span>
            </div>

            <div className="flex flex-wrap gap-3 my-6">
              {combinacionSugerida.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-14 h-14 rounded-full ${item.color} flex items-center justify-center text-white font-black text-lg shadow-md border-2 border-neutral-800 transition-all transform hover:scale-105`}
                  >
                    {item.num}
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-2 font-medium">{item.estado}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-neutral-500 mt-6 border-t border-neutral-900 pt-3">
            Cada sorteo es independiente. Sugerencia basada en la frecuencia de los sorteos anteriores.
          </p>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
          <div>
            <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">Estrategia</span>
            <div className="space-y-2 mt-3">
              {["Equilibrada", "Más calientes", "Más fríos", "Más atrasados"].map((est) => (
                <button
                  key={est}
                  onClick={() => cambiarEstrategiaYCalcular(est)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    estrategia === est
                      ? "border-[#0F7B5F] bg-[#0F7B5F]/10 text-white"
                      : "border-neutral-800 text-neutral-400 hover:bg-neutral-900"
                  }`}
                >
                  {est}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={generarOtraCombinacion}
              className="flex-1 bg-[#F4F3EE] hover:bg-white text-black font-extrabold text-xs py-3 rounded-xl transition-all shadow-md active:scale-95"
            >
              Generar otra
            </button>
            <button
              onClick={() => alert("Combinación guardada en tu panel.")}
              className="px-5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 font-bold text-xs py-3 rounded-xl transition-all"
            >
              Guardar
            </button>
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-2">Frecuencia por número (Último Año)</h3>
        <p className="text-xs text-neutral-400 mb-6">Veces que salió cada número. El contorno marca los de tu combinación sugerida.</p>

        <div className={`grid gap-2 ${total > 50 ? "grid-cols-8 sm:grid-cols-10 md:grid-cols-12" : "grid-cols-6 sm:grid-cols-10 md:grid-cols-15"}`}>
          {Array.from({ length: total }, (_, i) => {
            const numStr = String(i).padStart(2, "0");
            const count = frecuencias[numStr] || 0;
            const isSelected = combinacionSugerida.some((c) => c.num === numStr);
            return (
              <div
                key={i}
                className={`p-2 rounded-lg text-center border transition-all ${
                  isSelected ? "border-[#E0A422] bg-neutral-900 shadow" : "border-neutral-800 bg-neutral-900/50 text-neutral-400"
                }`}
              >
                <span className="block text-xs font-bold text-white">{numStr}</span>
                <span className="block text-[9px] text-neutral-500 mt-0.5">{count}x</span>
              </div>
            );
          })}
        </div>
      </section>

      {escannerAbierto && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Escáner Óptico de Boleta</h3>
                <p className="text-[11px] text-neutral-400">Apunta al código de barras o fotografía la jugada</p>
              </div>
              <button
                onClick={() => {
                  setEscannerAbierto(false);
                  setResultadoEscaneo(null);
                }}
                className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 px-3 py-1.5 rounded-lg text-xs font-bold border border-neutral-700"
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="bg-neutral-900 border-2 border-dashed border-neutral-700 rounded-xl h-48 flex flex-col items-center justify-center p-4 mb-4 text-center">
              <span className="text-3xl mb-2">📷</span>
              <p className="text-xs text-neutral-300 font-medium">Coloca el código de barras o los números dentro del recuadro</p>
              <button
                onClick={simularEscaneoBoleta}
                className="mt-4 bg-[#0F7B5F] hover:bg-[#0F7B5F]/80 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow"
              >
                Capturar e Interpretar Ticket
              </button>
            </div>

            {resultadoEscaneo && (
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl space-y-2 animate-in fade-in">
                <div className="flex justify-between text-xs text-[#E0A422] font-bold">
                  <span>{resultadoEscaneo.ticket}</span>
                  <span>{resultadoEscaneo.juego}</span>
                </div>
                <p className="text-xs text-white">
                  <strong>Estado de premios:</strong> {resultadoEscaneo.estadoPremio}
                </p>
                <p className="text-xs text-neutral-300">
                  <strong>Análisis Loto Track:</strong> {resultadoEscaneo.chancesEstadisticas}
                </p>
              </div>
            )}

            <div className="border-t border-neutral-900 pt-3 mt-4 text-[10px] text-neutral-500 text-center">
              Loto Track • Validación y Estadística
            </div>
          </div>
        </div>
      )}

      {historialAbierto && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-end transition-all backdrop-blur-sm">
          <div className="w-full max-w-md bg-neutral-950 border-l border-neutral-800 h-full p-6 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Anteriores: {juegoActivo.toUpperCase()}
                </h3>
                <p className="text-[11px] text-neutral-400">Resultados reales de este juego</p>
              </div>
              <button
                onClick={() => setHistorialAbierto(false)}
                className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 px-3 py-1.5 rounded-lg text-xs font-bold border border-neutral-700"
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {historialesPorJuego[juegoActivo].map((sorteo, idx) => (
                <div key={idx} className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl shadow-inner">
                  <div className="flex justify-between text-xs text-neutral-400 mb-2 font-medium">
                    <span>📅 {sorteo.fecha}</span>
                    <span className="text-[#E0A422] font-bold">{sorteo.edicion}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {sorteo.numeros.map((n, i) => (
                      <span
                        key={i}
                        className="bg-neutral-950 border border-neutral-800 text-white font-bold text-xs px-2.5 py-1 rounded-md"
                      >
                        {n < 10 ? `0${n}` : n}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-900 pt-3 mt-4 text-[10px] text-neutral-500 text-center">
              Loto Track • Análisis Estadístico
            </div>
          </div>
        </div>
      )}
    </main>
  );
}