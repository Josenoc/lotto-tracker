import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { totalNumeros } from "@/lib/sorteos";

const DATA_PATH = path.join(process.cwd(), "data", "sorteos.json");

function leerSorteos() {
  try {
    if (fs.existsSync(DATA_PATH)) {
      const raw = fs.readFileSync(DATA_PATH, "utf8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Error leyendo sorteos.json:", e);
  }
  return [];
}

function calcularEstadisticas(juego: string, dias: number) {
  const sorteos = leerSorteos();
  const hoy = new Date();
  const desde = new Date(hoy);
  desde.setDate(desde.getDate() - dias);

  const filtrados = sorteos.filter((s: any) => {
    if (s.juego !== juego) return false;
    const fecha = new Date(s.fecha);
    return fecha >= desde && fecha <= hoy;
  });

  const total = totalNumeros(juego);
  const frecuencias: Record<string, number> = {};
  for (let i = 0; i < total; i++) {
    frecuencias[String(i).padStart(2, "0")] = 0;
  }
  for (const s of filtrados) {
    for (const n of s.numeros) {
      const key = String(n).padStart(2, "0");
      if (frecuencias[key] !== undefined) frecuencias[key]++;
    }
  }

  return {
    success: true,
    totalSorteosEnPeriodo: filtrados.length,
    frecuencias,
  };
}

function agregarSorteo(body?: any) {
  let nuevoSorteo = null;
  if (body && body.juego && Array.isArray(body.numeros)) {
    nuevoSorteo = {
      id: body.id ?? Date.now(),
      fecha: body.fecha ?? new Date().toISOString().split("T")[0],
      juego: body.juego,
      edicion: body.edicion,
      numeros: body.numeros,
    };
  } else {
    nuevoSorteo = {
      id: Date.now(),
      fecha: new Date().toISOString().split("T")[0],
      juego: "quini6",
      edicion: "Tradicional",
      numeros: [3, 14, 21, 28, 35, 42],
    };
  }

  const sorteosActuales = leerSorteos();
  const existe = sorteosActuales.some(
    (s: any) => s.fecha === nuevoSorteo.fecha && s.juego === nuevoSorteo.juego
  );
  if (!existe) {
    sorteosActuales.push(nuevoSorteo);
  }
  fs.writeFileSync(DATA_PATH, JSON.stringify(sorteosActuales, null, 2), "utf8");
  return { ok: true, sorteo: nuevoSorteo, total: sorteosActuales.length };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const juego = searchParams.get("juego");
    const dias = searchParams.get("dias");

    if (juego && dias) {
      const stats = calcularEstadisticas(juego, Number(dias));
      return NextResponse.json(stats);
    }

    // Cron / actualización automática (sin params)
    const result = agregarSorteo();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error en /api/actualizar:", error);
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    let body: any = null;
    try {
      body = await request.json();
    } catch {
      // sin body
    }
    if (body && body.juego && Array.isArray(body.numeros)) {
      const result = agregarSorteo(body);
      return NextResponse.json(result);
    }
    // Si se envían juego y dias por POST, devolver estadísticas
    if (body && body.juego && body.dias) {
      const stats = calcularEstadisticas(body.juego, Number(body.dias));
      return NextResponse.json(stats);
    }
    const result = agregarSorteo();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error en /api/actualizar:", error);
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}