// components/site/related-properties.tsx
import { prisma } from "@/lib/prisma";
import { PropertyCardPublic } from "@/components/site/property-card-public";

type RelatedPropertiesProps = {
  currentPropertyId: string;
  city: string;
  price: number;
};

export async function RelatedProperties({
  currentPropertyId,
  city,
  price,
}: RelatedPropertiesProps) {
  // Primero intentamos misma ciudad; si no hay suficientes, completamos con rango de precio similar.
  const sameCity = await prisma.property.findMany({
    where: {
      id: { not: currentPropertyId },
      city,
    },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    take: 3,
  });

  let related = sameCity;

  if (related.length < 3) {
    const priceRange = await prisma.property.findMany({
      where: {
        id: { notIn: [currentPropertyId, ...related.map((p) => p.id)] },
        price: { gte: price * 0.6, lte: price * 1.4 },
      },
      include: { images: { orderBy: { order: "asc" }, take: 1 } },
      take: 3 - related.length,
    });
    related = [...related, ...priceRange];
  }

  if (related.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <h2 className="mb-5 font-display text-xl text-ink">También te puede interesar</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {related.map((property) => (
          <PropertyCardPublic key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}