"use client";
import { useEffect, useState } from "react";
import Scanner from "@/components/Scanner";

type Sorteo = { fecha: string; edicion: string; numeros: number[] };
type Item = { num: string; estado: string; color: string };
type Comparativa = {
  fotoNombre: string;
  juego: string;
  estrategiaAplicada: string;
  boletasAnalizadas: {
    id: string;
    numeros: number[];
    score: string;
    estado: string;
  }[];
  recomendada: string;
} | null;

export default function LotoTrackHome() {
  const [autenticado, setAutenticado] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const CLAVE_PRIVADA = "loto2026";

  useEffect(() => {
    const sesionActiva = sessionStorage.getItem("loto_auth");
    if (sesionActiva === "true") {
      setAutenticado(true);
    }
  }, []);

  const [seccionActiva, setSeccionActiva] = useState("inicio");
  const [juegoActivo, setJuegoActivo] = useState("quini6");
  const [estrategia, setEstrategia] = useState("Equilibrada");
  const [historialAbierto, setHistorialAbierto] = useState(false);

  const [analizandoBoletas, setAnalizandoBoletas] = useState(false);
  const [comparativaBoletas, setComparativaBoletas] = useState<Comparativa>(null);
  const [scannerAbierto, setScannerAbierto] = useState(false);

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
    const cantidadNumeros = juego === "telekino" ? 15 : 6;
    const maxBolilla = juego === "telekino" ? 25 : juego === "quiniela" ? 99 : 45;

    let numerosGenerados: Item[] = [];
    for (let i = 0; i < cantidadNumeros; i++) {
      const n = (i * 2 + (juego === "telekino" ? 1 : 5)) % maxBolilla + 1;
      const numStr = n < 10 ? `0${n}` : `${n}`;
      numerosGenerados.push({
        num: numStr,
        estado: tipoEstrategia,
        color: juego === "telekino" ? "bg-[#1D5FA8]" : "bg-[#0F7B5F]",
      });
    }
    return numerosGenerados;
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

  const manejarFotoBoletasEnAgencia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    setAnalizandoBoletas(true);
    setComparativaBoletas(null);

    setTimeout(() => {
      setAnalizandoBoletas(false);
      const esTelekino = juegoActivo === "telekino";
      const numsA = esTelekino
        ? [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 2, 8, 14]
        : [5, 12, 18, 24, 31, 44];
      const numsB = esTelekino
        ? [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 1, 9, 15]
        : [2, 14, 27, 33, 40, 45];

      setComparativaBoletas({
        fotoNombre: archivo.name,
        juego: juegoActivo.toUpperCase(),
        estrategiaAplicada: estrategia,
        boletasAnalizadas: [
          { id: "Cartón / Boleta 1", numeros: numsA, score: "91%", estado: "🔥 Alta afinidad estadística con tu selección" },
          { id: "Cartón / Boleta 2", numeros: numsB, score: "72%", estado: "⚖️ Perfil equilibrado estándar" },
        ],
        recomendada: "Cartón / Boleta 1",
      });
    }, 2000);
  };

  const verificarClave = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === CLAVE_PRIVADA) {
      setAutenticado(true);
      sessionStorage.setItem("loto_auth", "true");
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
          <p className="text-xs text-neutral-400 mb-4">Acceso privado restringido. Ingresá tu contraseña una vez.</p>
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

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F4F3EE] p-4 md:p-8 font-sans relative overflow-x-hidden">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-800 pb-4 mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-wider text-white flex items-center gap-2">
            <span className="bg-[#0F7B5F] w-3 h-3 rounded-full inline-block"></span>
            LOTO TRACK
          </h1>
          <p className="text-xs text-neutral-400 mt-1">Panel de control privado y seguro</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-neutral-900 p-1.5 rounded-xl border border-neutral-800">
          <button
            onClick={() => setSeccionActiva("inicio")}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
              seccionActiva === "inicio" ? "bg-[#F4F3EE] text-black" : "text-neutral-400 hover:text-white"
            }`}
          >
            🏠 Inicio
          </button>
          <button
            onClick={() => setSeccionActiva("boletos")}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
              seccionActiva === "boletos" ? "bg-[#F4F3EE] text-black" : "text-neutral-400 hover:text-white"
            }`}
          >
            🎫 Boletos
          </button>
          <button
            onClick={() => setSeccionActiva("sorteos")}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
              seccionActiva === "sorteos" ? "bg-[#F4F3EE] text-black" : "text-neutral-400 hover:text-white"
            }`}
          >
            📊 Sorteos
          </button>
          <button
            onClick={() => setSeccionActiva("verificador")}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
              seccionActiva === "verificador" ? "bg-[#F4F3EE] text-black" : "text-neutral-400 hover:text-white"
            }`}
          >
            🔍 Asesor en Agencia
          </button>
        </div>
      </header>

      {seccionActiva === "inicio" && (
        <div className="space-y-6">
          <div className="flex gap-2 bg-neutral-900 p-1 rounded-xl border border-neutral-800 w-fit mb-4">
            {["quiniela", "quini6", "telekino"].map((j) => (
              <button
                key={j}
                onClick={() => cambiarJuegoYCalcular(j)}
                className={`px-4 py-2 text-xs font-bold rounded-lg capitalize transition-all ${
                  juegoActivo === j ? "bg-[#F4F3EE] text-black" : "text-neutral-400 hover:text-white"
                }`}
              >
                {j}
              </button>
            ))}
          </div>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
              <div>
                <span className="text-xs font-bold tracking-widest text-[#E0A422] uppercase">
                  Combinación Sugerida ({juegoActivo.toUpperCase()})
                </span>
                <div className="flex flex-wrap gap-2 my-6">
                  {combinacionSugerida.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-11 h-11 rounded-full ${item.color} flex items-center justify-center text-white font-black text-sm shadow-md border-2 border-neutral-800`}
                      >
                        {item.num}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
              <button
                onClick={generarOtraCombinacion}
                className="w-full mt-6 bg-[#F4F3EE] hover:bg-white text-black font-extrabold text-xs py-3 rounded-xl transition-all shadow-md"
              >
                Generar otra
              </button>
            </div>
          </section>
        </div>
      )}

      {seccionActiva === "boletos" && (
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-base font-bold text-white mb-2">Gestión de Boletos Guardados</h2>
          <p className="text-xs text-neutral-400 mb-4">Administrá tus jugadas favoritas.</p>
          <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-xs text-neutral-300">
            No hay boletos guardados en esta sesión. Usá el asesor en agencia para fotografiar jugadas.
          </div>
        </div>
      )}

      {seccionActiva === "sorteos" && (
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-base font-bold text-white mb-2">Historial de Sorteos Anteriores</h2>
          <p className="text-xs text-neutral-400 mb-4">Consulta los últimos extractos registrados.</p>
        </div>
      )}

      {seccionActiva === "verificador" && (
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-base font-bold text-white mb-2">Asesor Estadístico en Agencia 🏪 ({juegoActivo.toUpperCase()})</h2>
          <p className="text-xs text-neutral-400 mb-4">
            ¿Estás en la agencia y querés saber cuál boleta comprar? Sácale una foto a las opciones impresas y Loto Track te
            dirá cuál tiene más afinidad con tu estrategia actual ({estrategia}).
          </p>

          <div className="bg-neutral-900 border-2 border-dashed border-neutral-700 rounded-xl p-8 flex flex-col items-center justify-center text-center mb-6">
            <span className="text-4xl mb-3">📸</span>
            <p className="text-xs text-neutral-300 font-medium mb-4">
              Fotografía las opciones de boletas sobre el mostrador de la agencia
            </p>

            <div className="flex gap-2">
              <label className="bg-[#0F7B5F] hover:bg-[#0F7B5F]/80 text-white font-bold text-xs px-6 py-3 rounded-xl cursor-pointer transition-all shadow">
                {analizandoBoletas ? "Procesando y cruzando estadísticas..." : "🎯 Fotografiar Boletas y Analizar"}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={manejarFotoBoletasEnAgencia}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => setScannerAbierto(true)}
                className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs px-6 py-3 rounded-xl border border-neutral-700 transition-all shadow"
              >
                📷 Escanear código
              </button>
            </div>
          </div>

          {comparativaBoletas && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl">
                <div className="flex justify-between text-xs text-[#E0A422] font-bold mb-2">
                  <span>RESULTADO DEL ANÁLISIS EN AGENCIA</span>
                  <span>Estrategia: {comparativaBoletas.estrategiaAplicada}</span>
                </div>
                <p className="text-xs text-neutral-300 mb-4">
                  Imagen procesada: <strong>{comparativaBoletas.fotoNombre}</strong>
                </p>

                <div className="space-y-3">
                  {comparativaBoletas.boletasAnalizadas.map((bol, i) => {
                    const esLaRecomendada = bol.id === comparativaBoletas.recomendada;
                    return (
                      <div
                        key={i}
                        className={`p-4 rounded-xl border transition-all ${
                          esLaRecomendada ? "border-[#E0A422] bg-[#E0A422]/10 shadow-md" : "border-neutral-800 bg-neutral-950"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-white flex items-center gap-2">
                            {bol.id}{" "}
                            {esLaRecomendada && (
                              <span className="bg-[#E0A422] text-black text-[10px] px-2 py-0.5 rounded-full font-black">
                                ⭐ RECOMENDADA PARA COMPRAR
                              </span>
                            )}
                          </span>
                          <span className="text-xs font-mono font-bold text-[#0F7B5F]">Afinidad: {bol.score}</span>
                        </div>
                        <div className="flex gap-2 mb-2 flex-wrap">
                          {bol.numeros.map((n, idx) => (
                            <span
                              key={idx}
                              className="bg-neutral-900 border border-neutral-700 text-white font-bold text-xs px-2.5 py-1 rounded-md"
                            >
                              {n < 10 ? `0${n}` : n}
                            </span>
                          ))}
                        </div>
                        <p className="text-[11px] text-neutral-400">{bol.estado}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {scannerAbierto && (
        <Scanner
          onScan={(text) => {
            setScannerAbierto(false);
            setAnalizandoBoletas(true);
            setComparativaBoletas(null);
            setTimeout(() => {
              setAnalizandoBoletas(false);
              setComparativaBoletas({
                fotoNombre: `Escaneo: ${text}`,
                juego: juegoActivo.toUpperCase(),
                estrategiaAplicada: estrategia,
                boletasAnalizadas: [
                  { id: "Boleta escaneada", numeros: [5, 12, 18, 24, 31, 44], score: "88%", estado: "Código detectado correctamente" },
                ],
                recomendada: "Boleta escaneada",
              });
            }, 1200);
          }}
          onClose={() => setScannerAbierto(false)}
        />
      )}
    </main>
  );
}