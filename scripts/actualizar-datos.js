const fs = require("fs");
const path = require("path");

async function obtenerUltimosSorteos() {
  try {
    console.log("Buscando últimos sorteos actualizados...");

    // Aquí es donde te conectarías a una API pública o harías web scraping
    // a las fuentes oficiales de Quini 6, Telequino o Quiniela de Mendoza.
    // Ejemplo simulado de un nuevo sorteo obtenido hoy:
    const nuevoSorteo = {
      id: Date.now(),
      fecha: new Date().toISOString().split("T")[0],
      juego: "quini6",
      numeros: [3, 14, 21, 28, 35, 42],
    };

    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const filePath = path.join(dataDir, "sorteos.json");

    let sorteosActuales = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf8");
      sorteosActuales = JSON.parse(fileData);
    }

    // Evitar duplicados por fecha y juego
    const existe = sorteosActuales.some(
      (s) => s.fecha === nuevoSorteo.fecha && s.juego === nuevoSorteo.juego
    );
    if (!existe) {
      sorteosActuales.push(nuevoSorteo);
    }

    fs.writeFileSync(filePath, JSON.stringify(sorteosActuales, null, 2), "utf8");
    console.log("¡Base de datos local actualizada con éxito!");
  } catch (error) {
    console.error("Error al actualizar los datos automáticos:", error);
  }
}

obtenerUltimosSorteos();