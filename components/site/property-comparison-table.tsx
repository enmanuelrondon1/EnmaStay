// components/site/property-comparison-table.tsx
import Link from "next/link";
import Image from "next/image";

type ComparedProperty = {
  id: string;
  title: string;
  city: string;
  country: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  parkings: number;
  images: { url: string }[];
  reviews: { rating: number }[];
};

export function PropertyComparisonTable({ properties }: { properties: ComparedProperty[] }) {
  const rows: { label: string; render: (p: ComparedProperty) => React.ReactNode }[] = [
    { label: "Ciudad", render: (p) => `${p.city}, ${p.country}` },
    { label: "Precio / noche", render: (p) => `$${p.price}` },
    { label: "Habitaciones", render: (p) => p.bedrooms },
    { label: "Baños", render: (p) => p.bathrooms },
    { label: "Estacionamientos", render: (p) => p.parkings },
    {
      label: "Calificación",
      render: (p) =>
        p.reviews.length > 0
          ? `${(p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length).toFixed(1)} ★ (${p.reviews.length})`
          : "Sin reseñas",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] border-collapse">
        <thead>
          <tr>
            <th className="w-32"></th>
            {properties.map((p) => (
              <th key={p.id} className="p-3 text-left">
                <div className="relative h-28 w-full overflow-hidden rounded-lg bg-stone-300/40">
                  {p.images[0] && (
                    <Image src={p.images[0].url} alt={p.title} fill className="object-cover" />
                  )}
                </div>
                <p className="mt-2 font-display text-sm text-ink">{p.title}</p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-stone-300">
              <td className="p-3 text-sm font-medium text-stone-600">{row.label}</td>
              {properties.map((p) => (
                <td key={p.id} className="p-3 text-sm text-ink">
                  {row.render(p)}
                </td>
              ))}
            </tr>
          ))}
          <tr className="border-t border-stone-300">
            <td className="p-3"></td>
            {properties.map((p) => (
              <td key={p.id} className="p-3">
                <Link
                  href={`/propiedades/${p.id}`}
                  className="inline-block rounded-md bg-ink px-4 py-2 text-xs font-medium text-canvas-soft hover:bg-brass"
                >
                  Ver propiedad
                </Link>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}