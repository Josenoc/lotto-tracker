"use client";

import { useEffect, useState } from "react";

const CLAVE_SECRETA = "loto2026";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [autenticado, setAutenticado] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const [listo, setListo] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("loto_auth") === "1") {
      setAutenticado(true);
    }
    setListo(true);
  }, []);

  const ingresar = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === CLAVE_SECRETA) {
      setAutenticado(true);
      sessionStorage.setItem("loto_auth", "1");
      setError("");
    } else {
      setError("Contraseña incorrecta");
    }
  };

  if (!listo) return null;

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#F4F3EE] flex items-center justify-center p-4">
        <form
          onSubmit={ingresar}
          className="w-full max-w-sm bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-lg space-y-4"
        >
          <h1 className="text-xl font-bold text-white">Loto Track</h1>
          <p className="text-xs text-neutral-400">Ingresa la contraseña para continuar</p>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Contraseña"
            className="w-full rounded-md border border-neutral-700 bg-transparent px-3 py-2 text-sm"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#0F7B5F] hover:bg-[#0d6a52] text-white font-bold text-sm py-2.5 rounded-xl transition-all"
          >
            Ingresar
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}