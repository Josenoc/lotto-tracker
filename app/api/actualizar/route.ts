import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "sorteos.json");

export async function POST(request: Request) {
  try {
    let nuevoSorteo = null;
    try {
      const body = await request.json();
      if (body && body.juego && Array.isArray(body.numeros)) {
        nuevoSorteo = {
          id: body.id ?? Date.now(),
          fecha: body.fecha ?? new Date().toISOString().split("T")[0],
          juego: body.juego,
          numeros: body.numeros,
        };
      }
    } catch {
      // sin body
    }

    if (!nuevoSorteo) {
      nuevoSorteo = {
        id: Date.now(),
        fecha: new Date().toISOString().split("T")[0],
        juego: "quini6",
        numeros: [3, 14, 21, 28, 35, 42],
      };
    }

    let sorteosActuales: any[] = [];
    if (fs.existsSync(DATA_PATH)) {
      const fileData = fs.readFileSync(DATA_PATH, "utf8");
      sorteosActuales = JSON.parse(fileData);
    }

    // Evitar duplicados por fecha y juego
    const existe = sorteosActuales.some(
      (s) => s.fecha === nuevoSorteo.fecha && s.juego === nuevoSorteo.juego
    );
    if (!existe) {
      sorteosActuales.push(nuevoSorteo);
    }

    fs.writeFileSync(DATA_PATH, JSON.stringify(sorteosActuales, null, 2), "utf8");

    return NextResponse.json({ ok: true, sorteo: nuevoSorteo, total: sorteosActuales.length });
  } catch (error) {
    console.error("Error al actualizar los datos automáticos:", error);
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  // Permitir disparar la actualización vía GET también
  const req = new Request("http://localhost/api/actualizar", { method: "POST" });
  return POST(req);
}