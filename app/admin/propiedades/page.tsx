// app/admin/propiedades/page.tsx
import Link from "next/link";
import { PropertyList } from "@/components/admin/property-list";

export default function AdminPropiedadesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* 
        Cambios aquí: 
        - flex-col gap-4: En móvil se apilan y tienen separación.
        - sm:flex-row sm:items-center sm:justify-between: En escritorio se alinean a los lados.
      */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Propiedades</h1>
        <Link
          href="/admin/propiedades/nueva"
          /* 
            w-full text-center: En móvil ocupa todo el ancho.
            sm:w-auto sm:text-left: En escritorio vuelve a su tamaño normal.
          */
          className="w-full rounded-md bg-neutral-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-neutral-800 sm:w-auto sm:text-left"
        >
          + Nueva propiedad
        </Link>
      </div>

      <PropertyList />
    </div>
  );
}