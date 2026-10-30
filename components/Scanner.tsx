"use client";

import { useEffect, useRef } from "react";

type Props = {
  onScan: (text: string) => void;
  onClose: () => void;
};

export default function Scanner({ onScan, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { Html5QrcodeScanner } = await import("html5-qrcode");
      if (!mounted || !containerRef.current) return;
      const scanner = new Html5QrcodeScanner(
        containerRef.current.id,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      scanner.render(
        (decodedText: string) => {
          onScan(decodedText);
          scanner.clear().catch(() => {});
        },
        () => {}
      );
      scannerRef.current = scanner;
    })();

    return () => {
      mounted = false;
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-4 mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Escáner de Códigos</h3>
          <button
            onClick={onClose}
            className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 px-3 py-1.5 rounded-lg text-xs font-bold border border-neutral-700"
          >
            ✕ Cerrar
          </button>
        </div>
        <div id="loto-scanner" ref={containerRef} className="w-full" />
      </div>
    </div>
  );
}