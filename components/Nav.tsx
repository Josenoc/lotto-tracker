"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/tickets", label: "Boletos" },
  { href: "/draws", label: "Sorteos" },
  { href: "/check", label: "Verificador" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <header className="border-b border-neutral-800 bg-[#0A0A0A]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight text-white">
          🎟️ Loto Track
        </Link>
        <nav className="flex gap-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#0F7B5F] text-white"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}