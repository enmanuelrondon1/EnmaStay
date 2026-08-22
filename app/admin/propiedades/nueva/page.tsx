// app/admin/propiedades/nueva/page.tsx
import { PropertyForm } from "@/components/admin/property-form";

export default function NuevaPropiedadPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 font-display text-2xl text-ink">Nueva propiedad</h1>
      <PropertyForm mode="create" />
    </div>
  );
}