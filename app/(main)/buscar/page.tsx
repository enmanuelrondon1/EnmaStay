// app/(main)/buscar/page.tsx
import { prisma } from "@/lib/prisma";
import { PropertyFilters } from "@/components/site/property-filters";
import { PropertyBrowser } from "@/components/site/property-browser";
import { buildPropertyWhere, getUnavailablePropertyIds } from "@/lib/property-filters";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const PAGE_SIZE = 8;

export default async function BuscarPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const where = buildPropertyWhere(params);
  const unavailableIds = await getUnavailablePropertyIds(params);

  if (unavailableIds && unavailableIds.length > 0) {
    where.id = { notIn: unavailableIds };
  }

  const currentPage = Math.max(1, Number(params.page) || 1);

  const [properties, totalCount, cityRows] = await Promise.all([
    prisma.property.findMany({
      where,
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.property.count({ where }),
    prisma.property.findMany({
      distinct: ["city"],
      select: { city: true },
      orderBy: { city: "asc" },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <PropertyFilters cities={cityRows.map((c) => c.city)} />
      <PropertyBrowser
        properties={properties}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}