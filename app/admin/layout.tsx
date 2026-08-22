// app/admin/layout.tsx
"use client"; // Necesario para usar useState

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas-soft">
      {/* Barra superior exclusiva para móvil */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-ink px-4 py-3 text-canvas-soft lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-md p-2 hover:bg-white/10"
          aria-label="Abrir menú"
        >
          {/* Icono de hamburguesa SVG */}
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-display text-lg italic">EnmaStay</span>
        <div className="w-10"></div> {/* Spacer para centrar el título */}
      </div>

      <div className="flex">
        {/* Pasamos el estado y la función para cerrar al sidebar */}
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}