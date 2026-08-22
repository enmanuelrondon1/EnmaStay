// components/admin/property-card.tsx
import Link from "next/link";
import Image from "next/image";

type PropertyCardProps = {
  property: {
    id: string;
    title: string;
    city: string;
    country: string;
    price: number;
    latitude: number;
    longitude: number;
    images: { url: string }[];
  };
};

function formatCoord(lat: number, lng: number) {
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(3)}°${latDir} ${Math.abs(lng).toFixed(3)}°${lngDir}`;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-stone-300 bg-white">
      <div className="relative h-40 w-full bg-stone-300/40">
        {property.images[0] && (
          <Image
            src={property.images[0].url}
            alt={property.title}
            fill
            className="object-cover"
          />
        )}
        <span className="absolute bottom-2 left-2 rounded bg-ink/80 px-2 py-0.5 font-mono text-[11px] text-canvas-soft">
          {formatCoord(property.latitude, property.longitude)}
        </span>
      </div>
      <div className="p-4">
        <h2 className="truncate font-display text-lg text-ink">{property.title}</h2>
        <p className="text-sm text-stone-600">
          {property.city}, {property.country}
        </p>
        <p className="mt-1 font-mono text-sm font-medium text-brass-dark">
          ${property.price} / noche
        </p>
        <div className="mt-3 flex gap-2">
          <Link
            href={`/admin/propiedades/${property.id}/editar`}
            className="flex-1 rounded-md border border-stone-300 py-1.5 text-center text-sm hover:bg-canvas-soft"
          >
            Editar
          </Link>
        </div>
      </div>
    </div>
  );
}