// app/(main)/page.tsx
import { prisma } from "@/lib/prisma";
import { HomeHero } from "@/components/site/home-hero";
import { FeaturedProperties } from "@/components/site/featured-properties";

export default async function HomePage() {
  const [properties, cityRows] = await Promise.all([
     prisma.property.findMany({
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.property.findMany({
      distinct: ["city"],
      select: { city: true },
      orderBy: { city: "asc" },
    }),
  ]);

  return (
    <>
      <HomeHero cities={cityRows.map((c) => c.city)} />
      <FeaturedProperties properties={properties} />
    </>
  );
}