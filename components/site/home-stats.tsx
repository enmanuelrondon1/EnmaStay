// components/site/home-stats.tsx
type Stat = {
  label: string;
  value: string;
};

export function HomeStats({
  propertiesCount,
  countriesCount,
  bookingsCount,
  avgRating,
}: {
  propertiesCount: number;
  countriesCount: number;
  bookingsCount: number;
  avgRating: number | null;
}) {
  const stats: Stat[] = [
    { label: "Propiedades", value: propertiesCount.toString() },
    { label: "Países", value: countriesCount.toString() },
    { label: "Reservas confirmadas", value: bookingsCount.toString() },
    {
      label: "Calificación promedio",
      value: avgRating ? `${avgRating.toFixed(1)} ★` : "—",
    },
  ];

  return (
    <section className="border-y border-stone-300 bg-canvas-soft px-4 py-12">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 text-center sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="font-display text-3xl text-ink sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-xs uppercase tracking-widest text-stone-600">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}