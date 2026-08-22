// app/(main)/not-found.tsx
import Link from "next/link";
import { Compass } from "lucide-react";

export default function MainNotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brass/10">
        <Compass className="h-8 w-8 text-brass" strokeWidth={1.5} />
      </div>

      <h1 className="mt-6 font-display text-3xl text-ink">Página no encontrada</h1>
      <p className="mt-2 max-w-sm text-sm text-stone-600">
        Parece que este lugar no existe en el mapa. Puede que la propiedad ya no esté
        disponible o el enlace sea incorrecto.
      </p>

      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-canvas-soft hover:bg-brass"
        >
          Volver al inicio
        </Link>
        <Link
          href="/buscar"
          className="rounded-md border border-stone-300 px-5 py-2.5 text-sm font-medium text-ink hover:bg-white"
        >
          Explorar propiedades
        </Link>
      </div>
    </div>
  );
}