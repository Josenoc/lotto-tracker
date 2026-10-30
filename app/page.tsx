"use client";
import { useEffect, useState } from "react";

type Item = { num: string; estado: string; color: string };
type ResultadoAnalisis = {
  juego: string;
  estrategia: string;
  numeros: string[];
  afinidad: string;
  evaluacion: string;
} | null;
type JuegoConfig = { max: number; cantidad: number; pool: number[] };

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

  const [numerosIngresados, setNumerosIngresados] = useState<string[]>([]);
  const [resultadoAnalisisManual, setResultadoAnalisisManual] = useState<ResultadoAnalisis>(null);

  const historialesPorJuego: Record<string, JuegoConfig> = {
    quiniela: { max: 99, cantidad: 5, pool: [3, 7, 12, 14, 19, 22, 34, 45, 52, 88, 91] },
    quini6: { max: 45, cantidad: 6, pool: [1, 3, 5, 8, 11, 12, 18, 22, 24, 27, 29, 31, 35, 40, 44, 45] },
    telekino: { max: 25, cantidad: 15, pool: [1, 2, 3, 5, 6, 8, 10, 11, 13, 14, 15, 17, 18, 19, 21, 22, 23, 24, 25] },
  };

  const generarJugadaDinamica = (tipoEstrategia: string, juego: string): Item[] => {
    const config = historialesPorJuego[juego] || historialesPorJuego.quini6;
    let poolNums = [...config.pool];

    if (poolNums.length < config.cantidad) {
      for (let i = 1; i <= config.max; i++) {
        if (!poolNums.includes(i)) poolNums.push(i);
      }
    }

    poolNums.sort(() => Math.random() - 0.5);

    let seleccionados: number[] = [];
    let colorBolilla = "bg-[#0F7B5F]";

    if (tipoEstrategia === "Más calientes") {
      seleccionados = poolNums.slice(0, config.cantidad);
      colorBolilla = "bg-[#B4470C]";
    } else if (tipoEstrategia === "Más fríos") {
      seleccionados = [...poolNums].reverse().slice(0, config.cantidad);
      colorBolilla = "bg-[#1D5FA8]";
    } else if (tipoEstrategia === "Más atrasados") {
      seleccionados = poolNums.filter((_, idx) => idx % 2 === 0).slice(0, config.cantidad);
      colorBolilla = "bg-[#0F7B5F]";
    } else {
      seleccionados = poolNums.slice(0, config.cantidad);
      colorBolilla = "bg-[#0F7B5F]";
    }

    seleccionados.sort((a, b) => a - b);

    return seleccionados.map((n) => ({
      num: n < 10 ? `0${n}` : `${n}`,
      estado: tipoEstrategia,
      color: colorBolilla,
    }));
  };

  const [combinacionSugerida, setCombinacionSugerida] = useState<Item[]>([
    { num: "05", estado: "Equilibrada", color: "bg-[#0F7B5F]" },
    { num: "12", estado: "Equilibrada", color: "bg-[#0F7B5F]" },
    { num: "18", estado: "Equilibrada", color: "bg-[#0F7B5F]" },
    { num: "24", estado: "Equilibrada", color: "bg-[#0F7B5F]" },
    { num: "31", estado: "Equilibrada", color: "bg-[#0F7B5F]" },
    { num: "44", estado: "Equilibrada", color: "bg-[#0F7B5F]" },
  ]);

  useEffect(() => {
    setCombinacionSugerida(generarJugadaDinamica("Equilibrada", "quini6"));
  }, []);

  const cambiarJuegoYCalcular = (nuevoJuego: string) => {
    setJuegoActivo(nuevoJuego);
    setNumerosIngresados([]);
    setResultadoAnalisisManual(null);
    setCombinacionSugerida(generarJugadaDinamica(estrategia, nuevoJuego));
  };

  const cambiarEstrategiaYCalcular = (nuevaEstrategia: string) => {
    setEstrategia(nuevaEstrategia);
    setCombinacionSugerida(generarJugadaDinamica(nuevaEstrategia, juegoActivo));
  };

  const generarOtraCombinacion = () => {
    setCombinacionSugerida(generarJugadaDinamica(estrategia, juegoActivo));
  };

  const toggleNumeroManual = (numStr: string) => {
    const limite = juegoActivo === "telekino" ? 15 : juegoActivo === "quiniela" ? 5 : 6;
    if (numerosIngresados.includes(numStr)) {
      setNumerosIngresados(numerosIngresados.filter((n) => n !== numStr));
    } else {
      if (numerosIngresados.length >= limite) {
        alert(`Para ${juegoActivo.toUpperCase()} solo podés seleccionar ${limite} números.`);
        return;
      }
      setNumerosIngresados([...numerosIngresados, numStr]);
    }
  };

  const analizarJugadaManual = () => {
    const limite = juegoActivo === "telekino" ? 15 : juegoActivo === "quiniela" ? 5 : 6;
    if (numerosIngresados.length < limite) {
      alert(`Por favor seleccioná los ${limite} números de tu boleta.`);
      return;
    }

    const afinidad = Math.min(95, Math.max(45, numerosIngresados.length * 8 + 30));
    setResultadoAnalisisManual({
      juego: juegoActivo.toUpperCase(),
      estrategia: estrategia,
      numeros: [...numerosIngresados].sort(),
      afinidad: `${afinidad}%`,
      evaluacion:
        afinidad > 70
          ? "🔥 Excelente afinidad con tu estrategia actual."
          : "⚖️ Perfil equilibrado para este sorteo.",
    });
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

  const maxTotalBolillas = juegoActivo === "telekino" ? 25 : juegoActivo === "quiniela" ? 99 : 45;

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
                <div className="flex flex-wrap gap-2.5 my-6">
                  {combinacionSugerida.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center text-white font-black text-sm shadow-md border-2 border-neutral-800`}
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
            Marcá los números de la boleta de <strong>{juegoActivo.toUpperCase()}</strong> para evaluar su afinidad con tu
            estrategia ({estrategia}).
          </p>

          <div className="flex gap-2 bg-neutral-900 p-1 rounded-xl border border-neutral-800 w-fit mb-4">
            {["quiniela", "quini6", "telekino"].map((j) => (
              <button
                key={j}
                onClick={() => cambiarJuegoYCalcular(j)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
                  juegoActivo === j ? "bg-[#F4F3EE] text-black" : "text-neutral-400 hover:text-white"
                }`}
              >
                {j}
              </button>
            ))}
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl mb-6">
            <div className="flex justify-between items-center mb-3 text-xs">
              <span className="text-neutral-300 font-bold">
                Marcá los números ({numerosIngresados.length} / {juegoActivo === "telekino" ? 15 : juegoActivo === "quiniela" ? 5 : 6}):
              </span>
              <button onClick={() => setNumerosIngresados([])} className="text-[#E0A422] hover:underline">
                Limpiar
              </button>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-h-60 overflow-y-auto p-1">
              {Array.from({ length: maxTotalBolillas }, (_, i) => {
                const n = i + 1;
                const numStr = n < 10 ? `0${n}` : `${n}`;
                const seleccionado = numerosIngresados.includes(numStr);
                return (
                  <button
                    key={i}
                    onClick={() => toggleNumeroManual(numStr)}
                    className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                      seleccionado
                        ? "bg-[#0F7B5F] text-white border-[#0F7B5F] shadow"
                        : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-600"
                    }`}
                  >
                    {numStr}
                  </button>
                );
              })}
            </div>

            <button
              onClick={analizarJugadaManual}
              className="w-full mt-4 bg-[#0F7B5F] hover:bg-[#0F7B5F]/80 text-white font-bold text-xs py-3 rounded-xl transition-all shadow"
            >
              🔍 Evaluar Jugada Seleccionada
            </button>
          </div>

          {resultadoAnalisisManual && (
            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl space-y-3 animate-in fade-in">
              <div className="flex justify-between text-xs text-[#E0A422] font-bold">
                <span>EVALUACIÓN: {resultadoAnalisisManual.juego}</span>
                <span>Afinidad: {resultadoAnalisisManual.afinidad}</span>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {resultadoAnalisisManual.numeros.map((n, idx) => (
                  <span
                    key={idx}
                    className="bg-neutral-950 border border-neutral-700 text-white font-bold text-xs px-2.5 py-1 rounded-md"
                  >
                    {n}
                  </span>
                ))}
              </div>
              <p className="text-xs text-white font-medium">{resultadoAnalisisManual.evaluacion}</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}