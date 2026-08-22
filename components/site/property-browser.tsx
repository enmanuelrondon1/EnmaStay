// components/site/property-browser.tsx
import { PropertyCardPublic } from "@/components/site/property-card-public";
import { PropertyMap } from "@/components/site/property-map-wrapper";

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

export function PropertyBrowser({ properties }: { properties: Property[] }) {
  if (properties.length === 0) {
    return (
      <p className="mt-12 text-center text-stone-600">
        No hay propiedades que coincidan con tu búsqueda.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {properties.map((property) => (
          <PropertyCardPublic key={property.id} property={property} />
        ))}
      </div>
      <div className="h-[70vh] lg:sticky lg:top-20">
        <PropertyMap properties={properties} />
      </div>
    </div>
  );
}