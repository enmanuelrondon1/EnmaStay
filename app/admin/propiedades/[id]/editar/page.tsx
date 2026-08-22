// app/admin/propiedades/[id]/editar/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link"; // <-- Importamos Link
import { prisma } from "@/lib/prisma";
import { PropertyForm } from "@/components/admin/property-form";

export default async function EditarPropiedadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!property) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Contenedor flex para alinear el título y el botón */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Editar propiedad</h1>
        <Link
          href="/admin/propiedades"
          className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          ← Volver
        </Link>
      </div>

      <PropertyForm
        mode="edit"
        propertyId={property.id}
        initialData={{
          title: property.title,
          description: property.description,
          price: property.price,
          address: property.address,
          city: property.city,
          country: property.country,
          latitude: property.latitude,
          longitude: property.longitude,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          parkings: property.parkings,
          images: property.images.map((img) => ({ url: img.url, order: img.order })),
        }}
      />
    </div>
  );
}