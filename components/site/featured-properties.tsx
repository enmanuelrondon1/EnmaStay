// components/site/featured-properties.tsx
import Link from "next/link";
import { PropertyCardPublic } from "@/components/site/property-card-public";

type Property = {
  id: string;
  title: string;
  city: string;
  country: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  parkings: number;
  latitude: number;
  longitude: number;
  images: { url: string }[];
};

export function FeaturedProperties({ properties }: { properties: Property[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="font-display text-2xl text-ink">Propiedades destacadas</h2>
        <Link href="/buscar" className="text-sm font-medium text-teal hover:text-brass">
          Ver todas →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCardPublic key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}