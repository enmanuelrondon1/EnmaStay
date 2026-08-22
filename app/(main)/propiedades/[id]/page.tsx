// app/(main)/propiedades/[id]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PropertyDetail } from "@/components/site/property-detail";
import { RelatedProperties } from "@/components/site/related-properties";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { id },
    select: {
      title: true,
      description: true,
      city: true,
      country: true,
      price: true,
      images: { orderBy: { order: "asc" }, take: 1, select: { url: true } },
    },
  });

  if (!property) {
    return { title: "Propiedad no encontrada · EnmaStay" };
  }

  const description = `${property.description.slice(0, 140)}... Desde $${property.price}/noche en ${property.city}, ${property.country}.`;

  return {
    title: `${property.title} · EnmaStay`,
    description,
    openGraph: {
      title: property.title,
      description,
      images: property.images[0] ? [property.images[0].url] : [],
    },
  };
}

export default async function PropiedadPage({ params }: PageProps) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!property) {
    notFound();
  }

  return (
    <>
      <PropertyDetail property={property} />
      <RelatedProperties
        currentPropertyId={property.id}
        city={property.city}
        price={property.price}
      />
    </>
  );
}