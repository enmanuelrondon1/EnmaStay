// components/site/home-globe.tsx
import { Globe3D } from "@/components/site/property-globe-wrapper";
import type { GlobeMarker } from "@/components/site/property-globe-wrapper";

type Property = {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  price: number;
  images: { url: string }[];
};

export function HomeGlobe({ properties }: { properties: Property[] }) {
  const markers: GlobeMarker[] = properties
    .filter((p) => p.images[0]?.url)
    .map((p) => ({
      lat: p.latitude,
      lng: p.longitude,
      src: p.images[0].url,
      label: p.title,
      propertyId: p.id,
      price: p.price,
    }));

  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="mb-6 text-center">
        <h2 className="font-display text-2xl text-ink">
          Propiedades alrededor del mundo
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          Explora nuestras estadías en un mapa interactivo
        </p>
      </div>
      <Globe3D
        markers={markers}
        config={{ autoRotateSpeed: 0.4, enableZoom: true }}
      />
    </section>
  );
}