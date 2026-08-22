// components/site/property-detail.tsx
import { PropertyGallery } from "@/components/site/property-gallery";
import { PropertyMap } from "@/components/site/property-map-wrapper";
import { BookingCalendar } from "@/components/site/booking-calendar";
import { FavoriteButton } from "@/components/site/favorite-button";

type PropertyDetailProps = {
  property: {
    id: string;
    title: string;
    description: string;
    price: number;
    address: string;
    city: string;
    country: string;
    bedrooms: number;
    bathrooms: number;
    parkings: number;
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

export function PropertyDetail({ property }: PropertyDetailProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <p className="font-mono text-xs uppercase tracking-widest text-teal">
        {property.city}, {property.country}
      </p>
      <h1 className="mt-1 font-display text-3xl text-ink">{property.title}</h1>
      <p className="mt-1 font-mono text-xs text-stone-600">
        {formatCoord(property.latitude, property.longitude)} ·{" "}
        {property.address}
      </p>

     <div className="relative mt-6">
  <PropertyGallery images={property.images} title={property.title} />
  <FavoriteButton propertyId={property.id} />
</div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex gap-6 border-b border-stone-300 pb-6 text-sm text-stone-600">
            <span>{property.bedrooms} habitaciones</span>
            <span>{property.bathrooms} baños</span>
            <span>{property.parkings} estacionamientos</span>
          </div>

          <h2 className="mt-6 font-display text-xl text-ink">Descripción</h2>
          <p className="mt-2 leading-relaxed text-stone-600">
            {property.description}
          </p>

          <h2 className="mt-8 font-display text-xl text-ink">Ubicación</h2>
          <div className="mt-3 h-72 w-full">
            <PropertyMap
              properties={[
                {
                  id: property.id,
                  title: property.title,
                  price: property.price,
                  latitude: property.latitude,
                  longitude: property.longitude,
                },
              ]}
              center={[property.latitude, property.longitude]}
              zoom={13}
            />
          </div>
        </div>

        <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-lg border border-stone-300 bg-white p-4">
            <p className="font-mono text-2xl font-medium text-brass-dark">
              ${property.price}
              <span className="text-sm font-normal text-stone-600">
                {" "}
                / noche
              </span>
            </p>
            <div className="mt-4">
              <BookingCalendar
                propertyId={property.id}
                pricePerNight={property.price}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
