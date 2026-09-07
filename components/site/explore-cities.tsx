// components/site/explore-cities.tsx
import Link from "next/link";

type CityGroup = {
  city: string;
  country: string;
  count: number;
  imageUrl: string | null;
};

export function ExploreCities({ cities }: { cities: CityGroup[] }) {
  if (cities.length === 0) return null;

  return (
    <section className="border-y border-stone-300 bg-canvas-soft px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-teal">
            Destinos
          </p>
          <h2 className="mt-2 font-display text-2xl text-ink">
            Explora por ciudad
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Descubre propiedades en tus destinos favoritos
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {cities.slice(0, 8).map((c) => (
            <Link
              key={c.city}
              href={`/buscar?city=${encodeURIComponent(c.city)}`}
              className="group relative aspect-square overflow-hidden rounded-xl bg-stone-300"
            >
              {c.imageUrl && (
                <img
                  src={c.imageUrl}
                  alt={c.city}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-canvas-soft">
                <p className="font-display text-base italic">{c.city}</p>
                <p className="text-[11px] text-canvas-soft/80">
                  {c.count} {c.count === 1 ? "propiedad" : "propiedades"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}