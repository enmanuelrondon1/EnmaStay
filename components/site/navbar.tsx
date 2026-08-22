// components/site/navbar.tsx
"use client";

import { useState } from "react"; // <-- Importamos useState
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false); // <-- Estado para abrir/cerrar el menú móvil

  return (
    <header className="sticky top-0 z-40 border-b border-stone-300 bg-canvas-soft/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="font-display text-xl italic text-ink">
          EnmaStay
        </Link>

        {/* Navegación de escritorio (oculta en móvil con hidden md:flex) */}
        <nav className="hidden items-center gap-4 text-sm md:flex">
          <Link href="/buscar" className="text-ink hover:text-brass">
            Explorar
          </Link>
          {session?.user ? (
            <>
              <Link href="/favoritos" className="text-ink hover:text-brass">
                Favoritos
              </Link>
              <Link href="/mi-cuenta" className="text-ink hover:text-brass">
                Mis reservas
              </Link>
              {session.user.role === "ADMIN" && (
                <Link
                  href="/admin/propiedades"
                  className="text-ink hover:text-brass"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full bg-ink px-4 py-2 text-canvas-soft hover:bg-brass"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-ink hover:text-brass">
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                className="rounded-full bg-ink px-4 py-2 text-canvas-soft hover:bg-brass"
              >
                Registrarse
              </Link>
            </>
          )}
        </nav>

        {/* Botón de menú hamburguesa (visible solo en móvil con md:hidden) */}
        <button
          className="rounded-md p-2 text-ink md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Menú desplegable de móvil (visible solo si menuOpen es true y en pantallas pequeñas) */}
      {menuOpen && (
        <div className="border-t border-stone-300 bg-canvas-soft md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-sm">
            <Link 
              href="/buscar" 
              className="py-2 text-ink hover:text-brass"
              onClick={() => setMenuOpen(false)} // Cierra el menú al hacer clic
            >
              Explorar
            </Link>
            {session?.user ? (
              <>
                <Link 
                  href="/favoritos" 
                  className="py-2 text-ink hover:text-brass"
                  onClick={() => setMenuOpen(false)}
                >
                  Favoritos
                </Link>
                <Link 
                  href="/mi-cuenta" 
                  className="py-2 text-ink hover:text-brass"
                  onClick={() => setMenuOpen(false)}
                >
                  Mis reservas
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link 
                    href="/admin/propiedades" 
                    className="py-2 text-ink hover:text-brass"
                    onClick={() => setMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="mt-2 rounded-full bg-ink px-4 py-2 text-canvas-soft hover:bg-brass"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="py-2 text-ink hover:text-brass"
                  onClick={() => setMenuOpen(false)}
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/registro"
                  className="mt-2 rounded-full bg-ink px-4 py-2 text-center text-canvas-soft hover:bg-brass"
                  onClick={() => setMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}