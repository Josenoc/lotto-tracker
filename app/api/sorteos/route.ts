import { NextResponse } from "next/server";
import { SORTEOS } from "@/lib/sorteos";

export async function GET() {
  try {
    // Reemplaza esta URL por tu endpoint real de datos
    const url = process.env.SORTEOS_API_URL;
    if (url) {
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (res.ok) {
        const datos = await res.json();
        return NextResponse.json(datos);
      }
    }
    // Fallback a datos locales
    return NextResponse.json(SORTEOS);
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    return NextResponse.json(SORTEOS);
  }
}