// components/site/property-card-public.tsx
import Link from "next/link";
import Image from "next/image";
import { FavoriteButton } from "@/components/site/favorite-button";
import { Star } from "lucide-react";

type PropertyCardPublicProps = {
  property: {
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
    reviews?: { rating: number }[];
  };
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  compareSelected?: boolean;
  onCompareToggle?: () => void;
};

function formatCoord(lat: number, lng: number) {
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(3)}°${latDir} ${Math.abs(lng).toFixed(3)}°${lngDir}`;
}

export function PropertyCardPublic({
  property,
  onMouseEnter,
  onMouseLeave,
  compareSelected,
  onCompareToggle,
}: PropertyCardPublicProps) {
  return (
    <Link
      href={`/propiedades/${property.id}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="group block overflow-hidden rounded-lg border border-stone-300 bg-white transition hover:shadow-md"
    >
      <div className="relative h-44 w-full bg-stone-300/40">
        {property.images[0] && (
          <Image
            src={property.images[0].url}
            alt={property.title}
            fill
            className="object-cover transition group-hover:scale-[1.02]"
          />
        )}
        <span className="absolute bottom-2 left-2 rounded bg-ink/80 px-2 py-0.5 font-mono text-[11px] text-canvas-soft">
          {formatCoord(property.latitude, property.longitude)}
        </span>
        <FavoriteButton propertyId={property.id} />
        {onCompareToggle && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCompareToggle();
            }}
            className={`absolute right-2 top-11 z-10 flex h-8 items-center gap-1 rounded-full px-2.5 text-xs font-medium shadow-sm ${
              compareSelected
                ? "bg-brass text-ink"
                : "bg-white/90 text-ink hover:bg-white"
            }`}
          >
            {compareSelected ? "✓ Comparar" : "+ Comparar"}
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="truncate font-display text-lg text-ink">
          {property.title}
        </h3>
        <p className="text-sm text-stone-600">
          {property.city}, {property.country}
        </p>
        <p className="mt-1 text-xs text-stone-600">
          {property.bedrooms} hab · {property.bathrooms} baños ·{" "}
          {property.parkings} estac.
        </p>
        <div className="mt-2 flex items-center justify-between">
          <p className="font-mono text-sm font-medium text-brass-dark">
            ${property.price} / noche
          </p>
          {property.reviews && property.reviews.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-stone-600">
              <Star size={12} className="fill-brass text-brass" />
              {(
                property.reviews.reduce((sum, r) => sum + r.rating, 0) /
                property.reviews.length
              ).toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
