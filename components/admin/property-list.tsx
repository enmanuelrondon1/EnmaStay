// components/admin/property-list.tsx
import { prisma } from "@/lib/prisma";
import { PropertyCard } from "@/components/admin/property-card";

export async function PropertyList() {
  const properties = await prisma.property.findMany({
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  if (properties.length === 0) {
    return (
      <p className="mt-12 text-center text-stone-600">
        No hay propiedades todavía.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}