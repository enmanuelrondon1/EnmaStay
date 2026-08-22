// components/admin/admin-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

// Añadimos las props para controlar el estado desde el layout
type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
};

const NAV_ITEMS = [
  { href: "/admin/propiedades", label: "Propiedades" },
  { href: "/admin/reservas", label: "Reservas" },
];

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Fondo oscuro detrás del sidebar en móvil (solo visible cuando está abierto) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-56 flex-col justify-between border-r border-ink/20 bg-ink px-4 py-6 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="mb-8 flex items-center justify-between">
            <Link href="/" className="block font-display text-lg italic text-canvas-soft">
              EnmaStay
            </Link>
            {/* Botón de cerrar (X) solo visible en móvil */}
            <button
              onClick={onClose}
              className="text-canvas-soft/80 hover:text-canvas-soft lg:hidden"
              aria-label="Cerrar menú"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose} // Cierra el menú al hacer clic en un enlace (modo móvil)
                  className={`block rounded-md px-3 py-2 text-sm ${
                    active
                      ? "bg-brass text-ink font-medium"
                      : "text-canvas-soft/80 hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded-md px-3 py-2 text-left text-sm text-canvas-soft/70 hover:bg-white/5"
        >
          Cerrar sesión
        </button>
      </aside>
    </>
  );
}