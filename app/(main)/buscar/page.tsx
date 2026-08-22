// app/(main)/buscar/page.tsx
import { prisma } from "@/lib/prisma";
import { buildPropertyWhere } from "@/lib/property-filters";
import { PropertyFilters } from "@/components/site/property-filters";
import { PropertyBrowser } from "@/components/site/property-browser";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BuscarPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const where = buildPropertyWhere(params);

  const [properties, cityRows] = await Promise.all([
    prisma.property.findMany({
      where,
      include: { images: { orderBy: { order: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.property.findMany({
      distinct: ["city"],
      select: { city: true },
      orderBy: { city: "asc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <PropertyFilters cities={cityRows.map((c) => c.city)} />
      <PropertyBrowser properties={properties} />
    </div>
  );
}