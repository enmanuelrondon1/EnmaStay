// app/(main)/page.tsx
import { prisma } from "@/lib/prisma";
import { HomeHero } from "@/components/site/home-hero";
import { FeaturedProperties } from "@/components/site/featured-properties";
import { HomeStats } from "@/components/site/home-stats";
import { ExploreCities } from "@/components/site/explore-cities";
import { Testimonials } from "@/components/site/testimonials";
import { ValueProps } from "@/components/site/value-props";

export default async function HomePage() {
  const [
    properties,
    cityRows,
    propertiesCount,
    countryRows,
    bookingsCount,
    ratingAgg,
    cityGroupsRaw,
    reviewsRaw,
  ] = await Promise.all([
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
    prisma.property.count(),
    prisma.property.findMany({
      distinct: ["country"],
      select: { country: true },
    }),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.review.aggregate({ _avg: { rating: true } }),
    prisma.property.findMany({
      select: {
        city: true,
        country: true,
        images: { orderBy: { order: "asc" }, take: 1 },
      },
    }),
    prisma.review.findMany({
      where: { comment: { not: null } },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: {
        user: { select: { name: true } },
        property: { select: { title: true } },
      },
    }),
  ]);

  // Agrupar propiedades por ciudad (conteo + primera imagen disponible)
  type CityGroupData = {
    city: string;
    country: string;
    count: number;
    imageUrl: string | null;
  };
  const cityMap = new Map<string, CityGroupData>();
  for (const p of cityGroupsRaw) {
    const existing = cityMap.get(p.city);
    if (existing) {
      existing.count += 1;
      if (!existing.imageUrl && p.images[0]?.url) {
        existing.imageUrl = p.images[0].url;
      }
    } else {
      cityMap.set(p.city, {
        city: p.city,
        country: p.country,
        count: 1,
        imageUrl: p.images[0]?.url ?? null,
      });
    }
  }
  const cityGroups = Array.from(cityMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const testimonials = reviewsRaw.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    userName: r.user.name,
    propertyTitle: r.property.title,
  }));

  return (
    <>
      <HomeHero cities={cityRows.map((c) => c.city)} />
      <HomeStats
        propertiesCount={propertiesCount}
        countriesCount={countryRows.length}
        bookingsCount={bookingsCount}
        avgRating={ratingAgg._avg.rating}
      />
      <FeaturedProperties properties={properties} />
      <ValueProps />
      <ExploreCities cities={cityGroups} />
    </>
  );
}
