import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { SORTEOS } from "@/lib/sorteos";

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
  return SORTEOS;
}

export async function GET() {
  try {
    const url = process.env.SORTEOS_API_URL;
    if (url) {
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (res.ok) {
        const datos = await res.json();
        return NextResponse.json(datos);
      }
    }
    return NextResponse.json(leerSorteos());
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    return NextResponse.json(leerSorteos());
  }
}