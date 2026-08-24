// app/(main)/comparar/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PropertyComparisonTable } from "@/components/site/property-comparison-table";

type PageProps = {
  searchParams: Promise<{ ids?: string }>;
};

export default async function CompararPage({ searchParams }: PageProps) {
  const { ids } = await searchParams;
  const propertyIds = ids ? ids.split(",").filter(Boolean) : [];

  if (propertyIds.length < 2) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="font-display text-2xl text-ink">Nada que comparar</h1>
        <p className="mt-2 text-stone-600">
          Selecciona al menos 2 propiedades desde el buscador para compararlas.
        </p>
        <Link
          href="/buscar"
          className="mt-6 inline-block rounded-md bg-ink px-5 py-2 text-sm font-medium text-canvas-soft hover:bg-brass"
        >
          Ir al buscador
        </Link>
      </div>
    );
  }

  const properties = await prisma.property.findMany({
    where: { id: { in: propertyIds } },
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      reviews: { select: { rating: true } },
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 font-display text-2xl text-ink">Comparar propiedades</h1>
      <PropertyComparisonTable properties={properties} />
    </div>
  );
}